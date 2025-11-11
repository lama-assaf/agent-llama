/**
 * Agent Llama - Modern chat interface for Claude Agent SDK
 * Copyright (C) 2025 Safastak
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { AgentQueueManager } from "./agentQueueManager";

describe('AgentQueueManager', () => {
  let manager: AgentQueueManager;

  beforeEach(() => {
    manager = new AgentQueueManager(2); // Max 2 concurrent agents
  });

  test('should allow spawning up to max concurrent agents', async () => {
    const agent1 = manager.enqueueAgent('agent-1', { type: 'researcher', prompt: 'test1' });
    const agent2 = manager.enqueueAgent('agent-2', { type: 'coder', prompt: 'test2' });

    expect(manager.getRunningCount()).toBe(2);
    expect(manager.getQueuedCount()).toBe(0);
  });

  test('should queue agents beyond max concurrency', async () => {
    const agent1 = manager.enqueueAgent('agent-1', { type: 'researcher', prompt: 'test1' });
    const agent2 = manager.enqueueAgent('agent-2', { type: 'coder', prompt: 'test2' });
    const agent3 = manager.enqueueAgent('agent-3', { type: 'debugger', prompt: 'test3' });

    expect(manager.getRunningCount()).toBe(2);
    expect(manager.getQueuedCount()).toBe(1);
  });

  test('should auto-spawn queued agents when slot opens', async () => {
    const agent1 = manager.enqueueAgent('agent-1', { type: 'researcher', prompt: 'test1' });
    const agent2 = manager.enqueueAgent('agent-2', { type: 'coder', prompt: 'test2' });
    const agent3 = manager.enqueueAgent('agent-3', { type: 'debugger', prompt: 'test3' });

    // Complete agent1
    manager.markAgentComplete('agent-1');

    // agent3 should now be running
    expect(manager.getRunningCount()).toBe(2);
    expect(manager.getQueuedCount()).toBe(0);
    expect(manager.isAgentRunning('agent-3')).toBe(true);
  });
});
