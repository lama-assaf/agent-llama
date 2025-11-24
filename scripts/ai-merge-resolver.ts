/*
  AI-assisted merge conflict resolver
  - Scans for conflicted files
  - Sends file content with conflict markers to an AI provider
  - Writes back resolved content without conflict markers
  - Stages the files

  Providers supported via environment variables:
  - Anthropic: set ANTHROPIC_API_KEY (default model: claude-3-5-sonnet-latest)
  - OpenAI: set OPENAI_API_KEY (default model: gpt-4o-mini)
*/

import { execSync } from 'child_process';
import fs from 'fs/promises';

type Provider = 'anthropic' | 'openai';

async function getConflictedFiles(): Promise<string[]> {
  const output = execSync('git diff --name-only --diff-filter=U', { encoding: 'utf8' });
  return output.split('\n').map(s => s.trim()).filter(Boolean);
}

function detectProvider(): { provider: Provider; apiKey: string; model: string } {
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  if (anthropicKey) {
    return {
      provider: 'anthropic',
      apiKey: anthropicKey,
      model: process.env.ANTHROPIC_MERGE_MODEL?.trim() || 'claude-3-5-sonnet-latest',
    };
  }
  if (openaiKey) {
    return {
      provider: 'openai',
      apiKey: openaiKey,
      model: process.env.OPENAI_MERGE_MODEL?.trim() || 'gpt-4o-mini',
    };
  }
  throw new Error('No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.');
}

function buildPrompt(filePath: string, contentsWithConflicts: string): { system: string; user: string } {
  const system = [
    'You are an expert code merge assistant.',
    'Resolve Git merge conflicts by producing a single, compilable file output.',
    'Rules:',
    '- Preserve both sides when they are compatible; otherwise choose the approach that matches upstream style and recent changes.',
    '- Keep imports consistent and remove unused imports.',
    '- Do not include conflict markers (<<<<<<<, =======, >>>>>>>).',
    '- Maintain formatting and indentation style found in the file.',
    '- Return ONLY the full resolved file content. No commentary.',
  ].join('\n');

  const user = `File: ${filePath}\n\n` +
    'Resolve the following file content with Git conflict markers into a single, valid file.\n' +
    'Return only the resolved file content.\n\n' +
    contentsWithConflicts;

  return { system, user };
}

async function callAnthropic(apiKey: string, model: string, system: string, user: string): Promise<string> {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Anthropic API error: ${resp.status} ${resp.statusText} - ${text}`);
  }
  const data = await resp.json();
  const content = data?.content?.[0]?.text;
  if (!content || typeof content !== 'string') throw new Error('Anthropic API returned empty content');
  return content;
}

async function callOpenAI(apiKey: string, model: string, system: string, user: string): Promise<string> {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.1,
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`OpenAI API error: ${resp.status} ${resp.statusText} - ${text}`);
  }
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') throw new Error('OpenAI API returned empty content');
  return content;
}

async function resolveFile(provider: Provider, apiKey: string, model: string, filePath: string): Promise<void> {
  const original = await fs.readFile(filePath, 'utf8');
  if (!original.includes('<<<<<<<') || !original.includes('>>>>>>>')) {
    return; // not a conflicted file anymore
  }
  const { system, user } = buildPrompt(filePath, original);

  const resolved = provider === 'anthropic'
    ? await callAnthropic(apiKey, model, system, user)
    : await callOpenAI(apiKey, model, system, user);

  if (resolved.includes('<<<<<<<') || resolved.includes('>>>>>>>')) {
    throw new Error(`AI did not remove conflict markers for ${filePath}`);
  }

  await fs.writeFile(filePath, resolved, 'utf8');
  execSync(`git add -- "${filePath}"`, { stdio: 'inherit' });
}

async function main() {
  const conflicted = await getConflictedFiles();
  if (conflicted.length === 0) {
    console.log('No conflicted files.');
    return;
  }

  const { provider, apiKey, model } = detectProvider();
  console.log(`Resolving ${conflicted.length} conflicted file(s) using ${provider}:${model}...`);

  let failures = 0;
  for (const file of conflicted) {
    try {
      await resolveFile(provider, apiKey, model, file);
      console.log(`Resolved: ${file}`);
    } catch (err) {
      failures++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to resolve ${file}: ${message}`);
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
    console.error(`AI resolution failed for ${failures} file(s). Resolve manually and commit.`);
    return;
  }

  console.log('All conflicted files resolved and staged.');
}

// Execute
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});








