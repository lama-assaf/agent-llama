/**
 * Agent Llama - Modern chat interface for Claude Agent SDK
 * Copyright (C) 2025 Safastak
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { ReactNode } from 'react';

export interface FeatureOption {
  id: string;
  name: string;
  description: string;
  tooltip?: string; // Beginner-friendly explanation with use cases
  recommended?: boolean; // Show "Recommended" badge
  configOptions?: ConfigOption[];
  autoBundles?: string[]; // Feature IDs that are automatically included when this feature is selected
  hidden?: boolean; // Don't show in UI (only added via auto-bundling or always included)
}

export interface ConfigOption {
  id: string;
  label: string;
  type: 'select' | 'toggle';
  options?: { value: string; label: string; tooltip?: string; recommended?: boolean }[];
  defaultValue?: string | boolean;
  tooltip?: string; // Explain what this config does
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  tooltip?: string; // Explain what this template is for and when to use it
  icon: ReactNode;
  gradient: string;
  command: string;
  commandFlags?: Record<string, (value: string | boolean | number) => string>;
  features: FeatureOption[];
}

/**
 * Project Templates Configuration
 *
 * Each template defines:
 * - Basic info (name, description, icon, gradient)
 * - Scaffolding command (e.g., npx create-next-app@latest)
 * - Available features (auth, database, styling, etc.)
 * - Configuration options per feature
 */
export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'nextjs',
    name: 'Next.js App',
    description: 'Full-stack React framework with App Router',
    tooltip: 'Build complete web applications with frontend and backend in one project. Perfect for SaaS products, dashboards, e-commerce sites, blogs, portfolios, or any website that needs a database, user accounts, or APIs. Most popular choice for modern web apps. Examples: Notion, TikTok, Twitch use Next.js.',
    icon: null, // Will be set in component
    gradient: 'linear-gradient(90deg, #A8C7FA 0%, #DAEEFF 25%, #ffffff 50%, #DAEEFF 75%, #A8C7FA 100%)',
    command: 'npx create-next-app@latest',
    commandFlags: {
      typescript: () => '--typescript',
      tailwind: () => '--tailwind',
      appRouter: () => '--app',
      srcDir: () => '--src-dir',
      eslint: () => '--eslint',
    },
    features: [
      {
        id: 'auth',
        name: 'Authentication',
        description: 'Add user authentication to your app',
        tooltip: 'Let users create accounts and log in to your app. Use this for apps where users need to save their data, have personalized experiences, or access protected content. Examples: social apps, productivity tools, dashboards.',
        recommended: true,
        configOptions: [
          {
            id: 'authProvider',
            label: 'Auth Provider',
            type: 'select',
            tooltip: 'Choose how users will sign in to your app',
            options: [
              { value: 'nextauth', label: 'NextAuth.js', tooltip: 'Free, fully customizable. Great for apps that need email/password login, Google, GitHub sign-in. Best if you want full control.', recommended: true },
              { value: 'clerk', label: 'Clerk', tooltip: 'Easiest setup with beautiful pre-built UI. Includes user management dashboard. Free tier: 10,000 users. Best for quick launches.' },
              { value: 'supabase', label: 'Supabase Auth', tooltip: 'Free, includes database. Best if you\'re also using Supabase for your database. Supports email, Google, GitHub, and more.' },
            ],
            defaultValue: 'nextauth',
          },
        ],
      },
      {
        id: 'database',
        name: 'Database',
        description: 'Connect a database to your app',
        tooltip: 'Store your app\'s data permanently (user profiles, posts, settings, etc.). Essential for any app that needs to remember information between visits. Without this, data disappears when users close their browser.',
        recommended: true,
        configOptions: [
          {
            id: 'dbType',
            label: 'Database',
            type: 'select',
            tooltip: 'Where your app\'s data will be stored',
            options: [
              { value: 'postgresql', label: 'PostgreSQL', tooltip: 'Most popular for production apps. Free hosting: Supabase, Vercel Postgres, Railway. Best for apps that will scale.', recommended: true },
              { value: 'sqlite', label: 'SQLite', tooltip: 'Simplest option, stores data in a file on your computer. Great for prototypes and learning. No setup needed.' },
              { value: 'mysql', label: 'MySQL', tooltip: 'Popular alternative to PostgreSQL. Use if your host specifically requires MySQL.' },
            ],
            defaultValue: 'postgresql',
          },
          {
            id: 'orm',
            label: 'ORM',
            type: 'select',
            tooltip: 'Tool that lets you work with your database using simple code instead of SQL',
            options: [
              { value: 'prisma', label: 'Prisma', tooltip: 'Easiest to learn, great documentation, visual database editor. Industry standard for Next.js apps.', recommended: true },
              { value: 'drizzle', label: 'Drizzle ORM', tooltip: 'Newer, faster, more TypeScript-friendly. Great if you\'re comfortable with code and want best performance.' },
            ],
            defaultValue: 'prisma',
          },
        ],
      },
      {
        id: 'styling',
        name: 'UI Components',
        description: 'Add pre-built UI component library',
        tooltip: 'Get ready-made components like buttons, forms, dialogs, dropdowns instead of building everything from scratch. Saves weeks of work. Use this to make your app look professional without being a designer.',
        recommended: true,
        configOptions: [
          {
            id: 'uiLibrary',
            label: 'Component Library',
            type: 'select',
            tooltip: 'Choose which set of pre-built components to use',
            options: [
              { value: 'shadcn', label: 'shadcn/ui', tooltip: 'Copy-paste components you own and can fully customize. Free, beautiful, accessible. Best for most apps. You can modify anything.', recommended: true },
              { value: 'mui', label: 'Material-UI', tooltip: 'Google Material Design style. Huge library, very popular. Free with lots of examples. Great for business/admin apps.' },
              { value: 'chakra', label: 'Chakra UI', tooltip: 'Simple, accessible, easy to learn. Good documentation. Best for quick prototypes and learning React.' },
            ],
            defaultValue: 'shadcn',
          },
        ],
      },
      {
        id: 'api',
        name: 'API Layer',
        description: 'Type-safe API integration',
        tooltip: 'Connect your frontend (what users see) to your backend (server/database). Without this, your app can\'t fetch or save data. Use this for any app that needs a backend API.',
        recommended: true,
        configOptions: [
          {
            id: 'apiType',
            label: 'API Type',
            type: 'select',
            tooltip: 'Choose how your frontend talks to your backend',
            options: [
              { value: 'trpc', label: 'tRPC', tooltip: 'End-to-end type safety. Your IDE autocompletes everything and catches errors before runtime. Best for TypeScript projects. No API documentation needed.', recommended: true },
              { value: 'rest', label: 'REST API Routes', tooltip: 'Traditional API approach. Simple, well-known, works with any client. Best if you need a public API or mobile apps.' },
              { value: 'graphql', label: 'GraphQL', tooltip: 'Flexible queries, fetch only what you need. Best for complex apps with lots of data relationships. Steeper learning curve.' },
            ],
            defaultValue: 'trpc',
          },
        ],
      },
      {
        id: 'env-validation',
        name: 'Environment Variables',
        description: 'Type-safe env validation with @t3-oss/env-nextjs',
        tooltip: 'Safely manage secret keys (API keys, database passwords) and configuration. Validates your .env file at build time so you catch missing keys before deployment. Essential for any production app.',
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'ESLint, Prettier, Husky git hooks',
        tooltip: 'Automatically format your code and catch common mistakes. Your code stays clean and consistent. Husky runs checks before each commit so bad code never reaches your repo. Great for teams and solo devs.',
        recommended: true,
      },
      {
        id: 'testing',
        name: 'Testing',
        description: 'Complete testing setup',
        tooltip: 'Write automated tests to catch bugs before users do. Tests run automatically and tell you if something breaks. Essential for professional apps. Saves hours of manual testing.',
        configOptions: [
          {
            id: 'testingTools',
            label: 'Testing Tools',
            type: 'select',
            tooltip: 'Choose your testing framework',
            options: [
              { value: 'vitest-playwright', label: 'Vitest + Playwright', tooltip: 'Unit tests (Vitest) for logic + browser tests (Playwright) for UI. Complete coverage. Best for production apps.', recommended: true },
              { value: 'jest-playwright', label: 'Jest + Playwright', tooltip: 'Same as above but with Jest. Use if your team already knows Jest.' },
              { value: 'vitest-only', label: 'Vitest only', tooltip: 'Unit tests only, no browser testing. Fastest setup. Good for APIs or simple apps.' },
            ],
            defaultValue: 'vitest-playwright',
          },
        ],
      },
      {
        id: 'deployment',
        name: 'Deployment',
        description: 'Vercel deployment configuration',
        tooltip: 'One-click deploy to Vercel (made by Next.js creators). Free hosting for personal projects. Auto-deploys when you push to GitHub. Perfect for Next.js apps.',
        recommended: true,
      },
    ],
  },
  {
    id: 'chrome-wxt',
    name: 'Chrome Extension (WXT)',
    description: 'Modern Chrome extension with React/Vue/Svelte',
    tooltip: 'Build browser extensions that add features to Chrome (and other browsers). Perfect for productivity tools, ad blockers, price trackers, page modifiers, or any tool that enhances browsing. Extensions appear in your browser toolbar and can interact with any webpage. Examples: Grammarly, Honey, LastPass are Chrome extensions.',
    icon: null,
    gradient: 'linear-gradient(90deg, #A8FAC7 0%, #DAFFEE 25%, #ffffff 50%, #DAFFEE 75%, #A8FAC7 100%)',
    command: 'npx wxt@latest init',
    commandFlags: {
      template: (framework: string | boolean | number) => `--template ${String(framework)}`,
      packageManager: (pm: string | boolean | number) => `--pm ${String(pm)}`,
    },
    features: [
      {
        id: 'framework',
        name: 'Framework',
        description: 'Choose your UI framework',
        tooltip: 'Pick the JavaScript framework for building your extension\'s UI. React is most popular with best resources. Vue is simpler. Svelte is fastest. Vanilla JS means no framework.',
        recommended: true,
        configOptions: [
          {
            id: 'uiFramework',
            label: 'Framework',
            type: 'select',
            tooltip: 'Choose your UI development framework',
            options: [
              { value: 'react', label: 'React', tooltip: 'Most popular, huge ecosystem, tons of tutorials. Best for complex extensions with lots of UI.', recommended: true },
              { value: 'vue', label: 'Vue 3', tooltip: 'Easier to learn than React, great documentation. Good balance of simplicity and power.' },
              { value: 'svelte', label: 'Svelte', tooltip: 'Fastest performance, smallest bundle size. Less resources but growing community.' },
              { value: 'vanilla', label: 'Vanilla JS', tooltip: 'No framework, just JavaScript. Lightest option. Best for very simple extensions.' },
            ],
            defaultValue: 'react',
          },
        ],
      },
      {
        id: 'popup',
        name: 'Popup UI',
        description: 'Extension popup interface',
        tooltip: 'The small window that opens when users click your extension icon in the toolbar. Essential for most extensions. This is where users interact with your extension\'s main features.',
        recommended: true,
      },
      {
        id: 'content-script',
        name: 'Content Script',
        description: 'Inject scripts into web pages',
        tooltip: 'Run JavaScript code on websites the user visits. Use this to modify web pages, add features to sites, or extract data. Examples: ad blockers, grammar checkers, price trackers.',
      },
      {
        id: 'background',
        name: 'Background Service',
        description: 'Service worker for background tasks',
        tooltip: 'Code that runs in the background even when popup is closed. Use for: listening to browser events, managing extension state, scheduling tasks, handling notifications.',
      },
      {
        id: 'styling',
        name: 'Styling',
        description: 'CSS framework',
        tooltip: 'Choose how to style your extension\'s UI. Tailwind is fastest for building interfaces. UnoCSS is lighter. Plain CSS gives full control.',
        configOptions: [
          {
            id: 'cssFramework',
            label: 'CSS Framework',
            type: 'select',
            tooltip: 'Choose your styling approach',
            options: [
              { value: 'tailwind', label: 'Tailwind CSS', tooltip: 'Utility-first CSS, fastest development. Most popular choice. Great for rapid UI building.', recommended: true },
              { value: 'unocss', label: 'UnoCSS', tooltip: 'Like Tailwind but faster and smaller. Good for extensions where size matters.' },
              { value: 'css', label: 'Plain CSS', tooltip: 'Traditional CSS. Full control, no learning curve. Best if you prefer writing CSS yourself.' },
            ],
            defaultValue: 'tailwind',
          },
        ],
      },
      {
        id: 'storage',
        name: 'Storage',
        description: 'Chrome storage API wrapper',
        tooltip: 'Save extension settings and user data that persists across browser sessions. Essential if your extension needs to remember preferences or store data.',
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'ESLint, Prettier, lint-staged',
        tooltip: 'Keep code clean and catch errors before they reach users. Auto-formats code and runs checks before commits. Essential for professional extensions.',
        recommended: true,
      },
      {
        id: 'testing',
        name: 'Testing',
        description: 'Vitest + Playwright for extension testing',
        tooltip: 'Automated tests for your extension. Catch bugs before users do. Playwright can test your extension in a real browser environment.',
      },
      {
        id: 'env-config',
        name: 'Environment Config',
        description: 'Type-safe environment variables',
        tooltip: 'Manage API keys and configuration safely. Different settings for development vs production. Essential if you\'re using external APIs.',
      },
      {
        id: 'deployment',
        name: 'Deployment',
        description: 'Chrome Web Store publishing workflow',
        tooltip: 'Automated workflow for publishing your extension to Chrome Web Store. Includes build optimization and packaging for distribution.',
      },
    ],
  },
  {
    id: 'chrome-plasmo',
    name: 'Chrome Extension (Plasmo)',
    description: 'TypeScript-first Chrome extension framework',
    tooltip: 'Alternative Chrome extension framework focused on TypeScript and developer experience. Great if you want batteries-included setup with less configuration. Similar to WXT but with different conventions. Choose this if you prefer opinionated frameworks that handle setup for you.',
    icon: null,
    gradient: 'linear-gradient(90deg, #C7FAA8 0%, #EEFFDA 25%, #ffffff 50%, #EEFFDA 75%, #C7FAA8 100%)',
    command: 'pnpm create plasmo',
    features: [
      {
        id: 'popup',
        name: 'Popup UI',
        description: 'Extension popup interface',
        tooltip: 'The small window that opens when users click your extension icon in the toolbar. Essential for most extensions. This is where users interact with your extension\'s main features.',
        recommended: true,
      },
      {
        id: 'content-script',
        name: 'Content Script',
        description: 'Inject scripts into web pages',
        tooltip: 'Run JavaScript code on websites the user visits. Use this to modify web pages, add features to sites, or extract data. Examples: ad blockers, grammar checkers, price trackers.',
      },
      {
        id: 'background',
        name: 'Background Service',
        description: 'Service worker for background tasks',
        tooltip: 'Code that runs in the background even when popup is closed. Use for: listening to browser events, managing extension state, scheduling tasks, handling notifications.',
      },
      {
        id: 'storage',
        name: 'Storage API',
        description: 'Chrome storage integration',
        tooltip: 'Save extension settings and user data that persists across browser sessions. Essential if your extension needs to remember preferences or store data.',
      },
      {
        id: 'styling',
        name: 'Styling',
        description: 'Tailwind CSS setup',
        tooltip: 'Pre-configured Tailwind CSS for styling your extension. Utility-first CSS framework for rapid UI development. Build beautiful interfaces quickly.',
        recommended: true,
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'ESLint, Prettier, Husky',
        tooltip: 'Keep code clean and catch errors before they reach users. Auto-formats code and runs checks before commits. Essential for professional extensions.',
        recommended: true,
      },
      {
        id: 'testing',
        name: 'Testing',
        description: 'Vitest for unit and E2E testing',
        tooltip: 'Automated tests for your extension. Catch bugs before users do. Includes both unit tests and end-to-end testing capabilities.',
      },
      {
        id: 'env-config',
        name: 'Environment Config',
        description: 'Type-safe .env.* files',
        tooltip: 'Manage API keys and configuration safely. Different settings for development vs production. Essential if you\'re using external APIs.',
      },
      {
        id: 'deployment',
        name: 'Deployment',
        description: 'Chrome Web Store + automated builds',
        tooltip: 'Automated workflow for publishing your extension to Chrome Web Store. Includes build optimization and packaging for distribution.',
      },
    ],
  },
  {
    id: 'vite-react',
    name: 'Vite + React',
    description: 'Lightning-fast React development with Vite',
    tooltip: 'Build fast single-page applications (SPAs) for frontend-only projects. Perfect for: interactive dashboards, admin panels, portfolio sites, landing pages, or prototypes. Simpler than Next.js - no backend/server code, just frontend. Best for apps that don\'t need a database or user accounts, or when you already have a separate backend API.',
    icon: null,
    gradient: 'linear-gradient(90deg, #C7A8FA 0%, #DAAEEE 25%, #ffffff 50%, #DAAEEE 75%, #C7A8FA 100%)',
    command: 'npm create vite@latest',
    commandFlags: {
      template: () => '--template react-ts',
    },
    features: [
      {
        id: 'routing',
        name: 'Routing',
        description: 'React Router for navigation',
        tooltip: 'Add multiple pages/views to your app. Users can navigate between different screens (Home, About, Dashboard, etc.). Essential for any app with more than one page.',
        recommended: true,
      },
      {
        id: 'state',
        name: 'State Management',
        description: 'Global state management',
        tooltip: 'Share data across your entire app. User info, settings, cart items accessible from any component. Essential for medium to large apps where components need to share data.',
        configOptions: [
          {
            id: 'stateLibrary',
            label: 'State Library',
            type: 'select',
            tooltip: 'Choose how to manage app-wide state',
            options: [
              { value: 'zustand', label: 'Zustand', tooltip: 'Simplest, easiest to learn. Small bundle size. Best for most apps. Growing in popularity.', recommended: true },
              { value: 'redux', label: 'Redux Toolkit', tooltip: 'Industry standard, huge ecosystem, tons of jobs use it. More complex but very powerful. Best for large teams.' },
              { value: 'jotai', label: 'Jotai', tooltip: 'Atomic state management, flexible and minimal. Good TypeScript support. Best if you want granular control.' },
            ],
            defaultValue: 'zustand',
          },
        ],
      },
      {
        id: 'styling',
        name: 'Styling',
        description: 'CSS framework',
        tooltip: 'Choose how to style your app. Tailwind is fastest for building interfaces. Styled Components keeps styles with components. CSS Modules prevents style conflicts.',
        recommended: true,
        configOptions: [
          {
            id: 'cssFramework',
            label: 'CSS Framework',
            type: 'select',
            tooltip: 'Choose your styling approach',
            options: [
              { value: 'tailwind', label: 'Tailwind CSS', tooltip: 'Utility-first CSS, fastest development. Most popular choice. Build interfaces rapidly with utility classes.', recommended: true },
              { value: 'styled', label: 'Styled Components', tooltip: 'Write CSS in JavaScript. Scoped styles, dynamic styling. Great for component libraries.' },
              { value: 'css-modules', label: 'CSS Modules', tooltip: 'Traditional CSS with automatic scope. No style conflicts. Good if you prefer writing regular CSS.' },
            ],
            defaultValue: 'tailwind',
          },
        ],
      },
      {
        id: 'ui-library',
        name: 'UI Library',
        description: 'Component library',
        tooltip: 'Get ready-made components like buttons, forms, dialogs instead of building from scratch. Saves weeks of work. Make your app look professional quickly.',
        configOptions: [
          {
            id: 'componentLib',
            label: 'Components',
            type: 'select',
            tooltip: 'Choose your component library',
            options: [
              { value: 'shadcn', label: 'shadcn/ui', tooltip: 'Copy-paste components you own and can fully customize. Free, beautiful, accessible. Best for most apps.', recommended: true },
              { value: 'mui', label: 'Material-UI', tooltip: 'Google Material Design style. Huge library, very popular. Free with lots of examples. Great for business apps.' },
              { value: 'none', label: 'None', tooltip: 'Build everything yourself. Full control but more work. Choose this if you have custom design requirements.' },
            ],
            defaultValue: 'shadcn',
          },
        ],
      },
      {
        id: 'ai-integration',
        name: 'AI Integration',
        description: 'Add AI capabilities to your app',
        tooltip: 'Add ChatGPT-like features to your app: chatbots, content generation, text analysis, summaries, translations. Use this to build AI-powered tools, writing assistants, smart search, or automated customer support.',
        configOptions: [
          {
            id: 'aiProvider',
            label: 'AI Provider',
            type: 'select',
            tooltip: 'Choose which AI model will power your app',
            options: [
              { value: 'vercel-ai', label: 'Vercel AI SDK', tooltip: 'Works with OpenAI, Anthropic, Google, and more. Switch providers anytime without changing code. Best for flexibility.', recommended: true },
              { value: 'openai', label: 'OpenAI', tooltip: 'ChatGPT creator. Great for chatbots and content generation. Pricing: $0.0015 per 1K words. Free $5 credit for new accounts.' },
              { value: 'anthropic', label: 'Anthropic Claude', tooltip: 'Best for long documents and complex reasoning. More accurate than ChatGPT for analysis. Pricing: $0.008 per 1K words.' },
            ],
            defaultValue: 'vercel-ai',
          },
        ],
      },
      {
        id: 'payments',
        name: 'Payments',
        description: 'Accept payments and manage subscriptions',
        tooltip: 'Let users pay you with credit cards for one-time purchases or monthly subscriptions. Essential for SaaS, online courses, premium features, memberships, or any app that makes money. Handles checkout, billing, and tax automatically.',
        autoBundles: ['email', 'rate-limiting'], // Payments need receipts and webhook protection
        configOptions: [
          {
            id: 'paymentProvider',
            label: 'Payment Provider',
            type: 'select',
            tooltip: 'Choose which service will handle your payments and money',
            options: [
              { value: 'stripe', label: 'Stripe', tooltip: 'Industry standard, works in 100+ countries. Fees: 2.9% + 30¢ per transaction. Best documentation and features. Used by Amazon, Google, Shopify.', recommended: true },
              { value: 'lemonsqueezy', label: 'LemonSqueezy', tooltip: 'Simplest setup, merchant of record handles taxes. Fees: 5% + 50¢. Best for digital products and courses. Quick start for indie devs. Recently acquired by Stripe.' },
              { value: 'paddle', label: 'Paddle', tooltip: 'Handles all taxes and compliance for you (SaaS focus). Fees: 5% + 50¢. Best if selling globally and want easy tax handling. Merchant of record.' },
            ],
            defaultValue: 'stripe',
          },
        ],
      },
      {
        id: 'email',
        name: 'Email',
        description: 'Send transactional and marketing emails',
        tooltip: 'Send emails from your app: welcome emails, password resets, receipts, notifications, newsletters. Essential for user communication. Without this, users won\'t get confirmation emails or important updates.',
        configOptions: [
          {
            id: 'emailProvider',
            label: 'Email Provider',
            type: 'select',
            tooltip: 'Choose which service will send emails for your app',
            options: [
              { value: 'resend', label: 'Resend + React Email', tooltip: 'Modern, simple API with beautiful React Email templates. Free: 3,000 emails/month, then $20/month. Best for startups and modern apps. 270K+ weekly downloads.', recommended: true },
              { value: 'sendgrid', label: 'SendGrid', tooltip: 'Enterprise option. Free: 100 emails/day. Paid from $20/month. Good for marketing emails and analytics. Higher deliverability.' },
            ],
            defaultValue: 'resend',
          },
        ],
      },
      {
        id: 'file-storage',
        name: 'File Storage',
        description: 'Upload and store user files',
        tooltip: 'Let users upload files: profile pictures, documents, videos, PDFs. Use for apps with user content, portfolios, file sharing, or media platforms. Files are stored in the cloud, not on your server.',
        configOptions: [
          {
            id: 'storageProvider',
            label: 'Storage Provider',
            type: 'select',
            tooltip: 'Choose where user-uploaded files will be stored',
            options: [
              { value: 'uploadthing', label: 'UploadThing', tooltip: 'Easiest setup. Free: 2GB storage, 2GB bandwidth/month. Handles file uploads with one line of code. Best for quick starts.', recommended: true },
              { value: 's3', label: 'AWS S3', tooltip: 'Industry standard, unlimited scale. $0.023 per GB/month. Best for large apps with many files. More complex setup but most powerful.' },
              { value: 'r2', label: 'Cloudflare R2', tooltip: 'Like S3 but free bandwidth. $0.015 per GB/month. Best if serving many files to users (downloads, media). Good for cost savings.' },
            ],
            defaultValue: 'uploadthing',
          },
        ],
      },
      {
        id: 'testing',
        name: 'Testing',
        description: 'Complete testing setup',
        configOptions: [
          {
            id: 'testingTools',
            label: 'Testing Tools',
            type: 'select',
            options: [
              { value: 'vitest-playwright', label: 'Vitest + Playwright' },
              { value: 'vitest-only', label: 'Vitest only' },
            ],
            defaultValue: 'vitest-playwright',
          },
        ],
      },
      {
        id: 'env-validation',
        name: 'Environment Variables',
        description: 'Type-safe env with Zod',
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'ESLint, Prettier, Husky',
      },
      {
        id: 'error-tracking',
        name: 'Error Tracking',
        description: 'Sentry integration',
      },
      {
        id: 'analytics',
        name: 'Analytics',
        description: 'Privacy-focused analytics',
        configOptions: [
          {
            id: 'analyticsProvider',
            label: 'Analytics',
            type: 'select',
            options: [
              { value: 'posthog', label: 'PostHog' },
              { value: 'plausible', label: 'Plausible' },
              { value: 'umami', label: 'Umami' },
            ],
            defaultValue: 'posthog',
          },
        ],
      },
      {
        id: 'deployment',
        name: 'Deployment',
        description: 'Deploy config',
        configOptions: [
          {
            id: 'deployTarget',
            label: 'Platform',
            type: 'select',
            options: [
              { value: 'vercel', label: 'Vercel' },
              { value: 'netlify', label: 'Netlify' },
              { value: 'cloudflare', label: 'Cloudflare Pages' },
            ],
            defaultValue: 'vercel',
          },
        ],
      },
    ],
  },
  {
    id: 'mcp-server',
    name: 'MCP Server',
    description: 'Model Context Protocol server for Claude integration',
    tooltip: 'Create servers that extend Claude with custom tools, resources, and prompts. Perfect for connecting Claude to APIs, databases, file systems, or custom business logic. Examples: database query tools, code analysis, web scraping, custom workflows. Used by Claude Desktop, Claude Code, and any MCP-compatible client.',
    icon: null, // Will be set in component
    gradient: 'linear-gradient(90deg, #FF6B35 0%, #FFA07A 25%, #ffffff 50%, #FFA07A 75%, #FF6B35 100%)',
    command: 'npx @modelcontextprotocol/create-server',
    commandFlags: {
      name: (value) => `--name "${value}"`,
      description: (value) => `--description "${value}"`,
    },
    features: [
      {
        id: 'transport',
        name: 'Transport Type',
        description: 'How your MCP server communicates with clients',
        tooltip: 'STDIO = Local-only (Claude Desktop). HTTP = Remote/cloud deployment (Claude web, team sharing). Choose STDIO for personal tools, HTTP for team/production use.',
        recommended: true,
        configOptions: [
          {
            id: 'transportType',
            label: 'Transport Protocol',
            type: 'select',
            tooltip: 'STDIO runs locally on your machine. HTTP allows remote access for teams and cloud deployment.',
            options: [
              {
                value: 'stdio',
                label: 'STDIO (Local)',
                tooltip: 'Best for: Personal Claude Desktop use, file system access, local databases, tools that need direct system access. Fastest, most secure for local use.',
                recommended: true
              },
              {
                value: 'http',
                label: 'HTTP (Remote)',
                tooltip: 'Best for: Team collaboration, cloud APIs, webhooks, shared tools. Accessible from Claude web, requires hosting (Cloudflare, AWS, etc.).'
              },
            ],
            defaultValue: 'stdio',
          },
        ],
      },
      {
        id: 'capabilities',
        name: 'Server Capabilities',
        description: 'What your MCP server will provide to Claude',
        tooltip: 'Tools = Actions Claude can perform (e.g., query database, call API). Resources = Data Claude can read (e.g., files, docs). Prompts = Reusable instruction templates. Select all that apply.',
        recommended: true,
        configOptions: [
          {
            id: 'includeTools',
            label: 'Tools (Executable Functions)',
            type: 'toggle',
            tooltip: 'Add tools for Claude to execute actions. Examples: search database, call weather API, create file, send email. Tools can modify state and have side effects.',
            defaultValue: true,
          },
          {
            id: 'includeResources',
            label: 'Resources (Data Sources)',
            type: 'toggle',
            tooltip: 'Expose data for Claude to read. Examples: config files, documentation, user profiles, logs. Resources are read-only and have no side effects.',
            defaultValue: false,
          },
          {
            id: 'includePrompts',
            label: 'Prompts (Reusable Templates)',
            type: 'toggle',
            tooltip: 'Define prompt templates for common tasks. Examples: code review template, bug report format, analysis framework. Ensures consistent AI interactions.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'tool-examples',
        name: 'Tool Examples',
        description: 'Pre-built tool templates to include',
        tooltip: 'Start with example tools you can customize. These demonstrate best practices for different use cases.',
        configOptions: [
          {
            id: 'toolType',
            label: 'Tool Template',
            type: 'select',
            tooltip: 'Choose a starting template that matches your use case. You can add more tools later.',
            options: [
              {
                value: 'api',
                label: 'API Client',
                tooltip: 'Tools for calling REST APIs. Example: Fetch data from external services, webhooks, GraphQL queries.',
                recommended: true
              },
              {
                value: 'database',
                label: 'Database Query',
                tooltip: 'Tools for querying databases (SQL, MongoDB, etc.). Example: Run queries, insert records, aggregate data.'
              },
              {
                value: 'filesystem',
                label: 'File Operations',
                tooltip: 'Tools for reading/writing files. Example: Search files, read configs, generate reports, modify code.'
              },
              {
                value: 'web',
                label: 'Web Scraping',
                tooltip: 'Tools for fetching and parsing web content. Example: Extract data from websites, monitor pages, aggregate info.'
              },
              {
                value: 'git',
                label: 'Git Operations',
                tooltip: 'Tools for Git operations. Example: Search repos, read commits, analyze diffs, automate workflows.'
              },
              {
                value: 'custom',
                label: 'Custom Logic',
                tooltip: 'Blank template for your own business logic. Example: Calculations, data transformation, integrations.'
              },
            ],
            defaultValue: 'api',
          },
        ],
      },
      {
        id: 'authentication',
        name: 'Authentication',
        description: 'Secure your MCP server (HTTP only)',
        tooltip: 'HTTP servers should always use authentication. Choose API keys for simplicity or OAuth for enterprise SSO. STDIO servers don\'t need auth (already local).',
        configOptions: [
          {
            id: 'authMethod',
            label: 'Auth Method',
            type: 'select',
            tooltip: 'API Key = Simple, good for personal/small teams. OAuth = Enterprise SSO (Google, Microsoft). None = Only use for local STDIO.',
            options: [
              {
                value: 'none',
                label: 'None (STDIO only)',
                tooltip: 'No authentication. Only safe for local STDIO transport. Never use with HTTP!',
                recommended: true
              },
              {
                value: 'api-key',
                label: 'API Key',
                tooltip: 'Simple bearer token authentication. Best for: Internal tools, personal use, small teams. Easy to implement.'
              },
              {
                value: 'oauth',
                label: 'OAuth 2.0',
                tooltip: 'Enterprise authentication with SSO providers (Google, Microsoft, GitHub). Best for: Team deployments, production apps, enterprise environments.'
              },
            ],
            defaultValue: 'none',
          },
        ],
      },
      {
        id: 'validation',
        name: 'Input Validation',
        description: 'Validate tool inputs with schemas',
        tooltip: 'Use Zod to validate tool parameters before execution. Prevents errors, improves type safety, generates better documentation. Highly recommended for production servers.',
        recommended: true,
        configOptions: [
          {
            id: 'validationLib',
            label: 'Validation Library',
            type: 'select',
            tooltip: 'Zod provides runtime type checking and automatic schema generation for MCP tools.',
            options: [
              {
                value: 'zod',
                label: 'Zod',
                tooltip: 'TypeScript-first validation. Best DX with MCP SDK. Auto-generates input schemas. Example: z.object({ query: z.string() })',
                recommended: true
              },
              {
                value: 'none',
                label: 'No validation',
                tooltip: 'Manual validation. Only choose if you have specific requirements. Not recommended for production.'
              },
            ],
            defaultValue: 'zod',
          },
        ],
      },
      {
        id: 'deployment',
        name: 'Deployment Target',
        description: 'Where you plan to host your MCP server',
        tooltip: 'Local = Claude Desktop only. Cloud = Accessible from anywhere, team sharing. Choose based on who needs access.',
        configOptions: [
          {
            id: 'deployTarget',
            label: 'Deployment Platform',
            type: 'select',
            tooltip: 'Where will your MCP server run?',
            options: [
              {
                value: 'local',
                label: 'Local (Claude Desktop)',
                tooltip: 'Run on your machine only. Best for: Personal tools, file system access, local databases. Requires STDIO transport.',
                recommended: true
              },
              {
                value: 'cloudflare',
                label: 'Cloudflare Workers',
                tooltip: 'Serverless edge deployment. Best for: Global low-latency, API integrations, auto-scaling. Free tier available. Requires HTTP transport.'
              },
              {
                value: 'vercel',
                label: 'Vercel',
                tooltip: 'Next.js-friendly serverless. Best for: Integrating with existing Next.js apps, quick deployment. Free tier available. Requires HTTP transport.'
              },
              {
                value: 'aws-lambda',
                label: 'AWS Lambda',
                tooltip: 'Flexible serverless compute. Best for: Enterprise environments, AWS ecosystem, advanced networking. Requires HTTP transport.'
              },
              {
                value: 'docker',
                label: 'Docker Container',
                tooltip: 'Self-hosted container. Best for: On-premise deployments, custom infrastructure, full control. Requires HTTP transport.'
              },
              {
                value: 'desktop-extension',
                label: 'Desktop Extension (.mcpb)',
                tooltip: 'Package as one-click installable for Claude Desktop. Best for: Distributing to non-technical users, easy installation. Uses STDIO internally.'
              },
            ],
            defaultValue: 'local',
          },
        ],
      },
      {
        id: 'error-handling',
        name: 'Error Handling & Logging',
        description: 'Handle errors and log activity',
        tooltip: 'Production servers need robust error handling and observability. Choose logging that matches your deployment platform.',
        configOptions: [
          {
            id: 'loggingLib',
            label: 'Logging Library',
            type: 'select',
            tooltip: 'How to track server activity and debug issues.',
            options: [
              {
                value: 'console',
                label: 'Console (Simple)',
                tooltip: 'Basic console.log. Good for: Local development, testing. Not recommended for production.',
                recommended: true
              },
              {
                value: 'pino',
                label: 'Pino (Fast)',
                tooltip: 'Fast structured logging. Good for: Production servers, high traffic. Works with log aggregators (Datadog, Splunk).'
              },
              {
                value: 'winston',
                label: 'Winston (Feature-rich)',
                tooltip: 'Flexible logging with transports. Good for: Complex apps, multiple outputs (file, cloud, console).'
              },
            ],
            defaultValue: 'console',
          },
        ],
      },
      {
        id: 'testing',
        name: 'Testing Setup',
        description: 'Test your MCP server tools and resources',
        tooltip: 'Write tests to ensure your server works correctly. Catch bugs before deployment, document expected behavior.',
        configOptions: [
          {
            id: 'testFramework',
            label: 'Test Framework',
            type: 'select',
            tooltip: 'Choose a test runner for unit and integration tests.',
            options: [
              {
                value: 'vitest',
                label: 'Vitest',
                tooltip: 'Fast, modern test runner. Compatible with Vite. Good for: TypeScript projects, fast feedback loops.',
                recommended: true
              },
              {
                value: 'jest',
                label: 'Jest',
                tooltip: 'Popular, mature test framework. Good for: Large projects, extensive ecosystem, familiar to most developers.'
              },
              {
                value: 'none',
                label: 'No testing',
                tooltip: 'Skip testing setup. Only for quick prototypes. Not recommended for production servers.'
              },
            ],
            defaultValue: 'vitest',
          },
        ],
      },
      {
        id: 'documentation',
        name: 'Documentation',
        description: 'Generate documentation for your server',
        tooltip: 'Auto-generate docs from your tool schemas. Helps users understand what your server does and how to use it.',
        configOptions: [
          {
            id: 'docGen',
            label: 'Documentation Type',
            type: 'select',
            tooltip: 'MCP servers should document their tools, resources, and prompts.',
            options: [
              {
                value: 'readme',
                label: 'README.md',
                tooltip: 'Basic markdown documentation. Good for: Simple servers, GitHub sharing, quick reference.',
                recommended: true
              },
              {
                value: 'typedoc',
                label: 'TypeDoc (API Docs)',
                tooltip: 'Generate HTML API docs from TypeScript. Good for: Complex servers, public APIs, detailed documentation.'
              },
              {
                value: 'none',
                label: 'No docs',
                tooltip: 'Skip documentation. Only for personal prototypes.'
              },
            ],
            defaultValue: 'readme',
          },
        ],
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'Linting, formatting, and type checking',
        tooltip: 'Ensure code quality with automated tools. Catches bugs early, maintains consistent style.',
        recommended: true,
        hidden: true, // Auto-included
      },
      {
        id: 'env-config',
        name: 'Environment Configuration',
        description: 'Manage environment variables and secrets',
        tooltip: 'Handle API keys, database URLs, and other secrets safely. Never commit secrets to Git.',
        recommended: true,
        hidden: true, // Auto-included
      },
    ],
  },
  {
    id: 'discord-bot',
    name: 'Discord Bot',
    description: 'Discord.js bot with slash commands and interactions',
    tooltip: 'Build Discord bots with slash commands, buttons, modals, and event handlers. Perfect for: community moderation, custom commands, automation, games, music bots, server management, notification systems. Examples: MEE6, Dyno, Dank Memer use Discord.js. Works with Discord\'s latest API.',
    icon: null, // Will be set in component
    gradient: 'linear-gradient(90deg, #5865F2 0%, #7289DA 25%, #ffffff 50%, #7289DA 75%, #5865F2 100%)',
    command: 'npx @flzyy/create-discord-bot@latest',
    commandFlags: {
      typescript: (value) => value ? '--typescript' : '--javascript',
      packageManager: (value) => `--package-manager ${value}`,
    },
    features: [
      {
        id: 'slash-commands',
        name: 'Slash Commands',
        description: 'Modern Discord command system',
        tooltip: 'Slash commands are Discord\'s official command system. They appear in the Discord UI with autocomplete, validation, and help text. Required for all modern bots. Examples: /help, /ban @user, /play song-name. Discord deprecated old prefix commands (!help).',
        recommended: true,
        configOptions: [
          {
            id: 'commandHandler',
            label: 'Command Organization',
            type: 'select',
            tooltip: 'How to organize your slash commands for scalability.',
            options: [
              {
                value: 'category-folders',
                label: 'Category Folders',
                tooltip: 'Organize commands by category (moderation/, fun/, utility/). Best for: Bots with 10+ commands, clear organization, team development. Example: commands/moderation/ban.js',
                recommended: true
              },
              {
                value: 'single-file',
                label: 'Single File',
                tooltip: 'All commands in one file. Best for: Simple bots with <5 commands, quick prototypes. Gets messy with many commands.'
              },
              {
                value: 'command-registry',
                label: 'Command Registry',
                tooltip: 'Advanced pattern with auto-registration. Best for: Large bots (50+ commands), dynamic loading, plugin systems. Example: Dyno, MEE6 use this.'
              },
            ],
            defaultValue: 'category-folders',
          },
          {
            id: 'includeExamples',
            label: 'Include Example Commands',
            type: 'toggle',
            tooltip: 'Generate example slash commands: /ping, /help, /userinfo. Great for learning patterns and testing setup.',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'interactions',
        name: 'Interactive Components',
        description: 'Buttons, select menus, and modals',
        tooltip: 'Discord UI components for rich interactions. Buttons = clickable in messages, Select Menus = dropdowns, Modals = forms/popups. Examples: reaction roles, polls, verification, settings menus.',
        recommended: true,
        configOptions: [
          {
            id: 'includeButtons',
            label: 'Button Components',
            type: 'toggle',
            tooltip: 'Add button support. Examples: "Yes/No" confirmation, pagination (Next/Prev), role selectors, game controls.',
            defaultValue: true,
          },
          {
            id: 'includeSelectMenus',
            label: 'Select Menus',
            type: 'toggle',
            tooltip: 'Add dropdown menu support. Examples: multi-role selector, language picker, category navigation, settings.',
            defaultValue: true,
          },
          {
            id: 'includeModals',
            label: 'Modal Forms',
            type: 'toggle',
            tooltip: 'Add popup form support. Examples: report user form, ticket creation, survey, configuration wizard. Modals can have text inputs.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'events',
        name: 'Event Handlers',
        description: 'React to Discord events',
        tooltip: 'Listen to Discord server events to trigger bot actions. Examples: welcome new members, log deleted messages, auto-moderate, track voice joins, react to emoji.',
        recommended: true,
        configOptions: [
          {
            id: 'eventTypes',
            label: 'Event Categories',
            type: 'select',
            tooltip: 'Which Discord events to handle in your bot.',
            options: [
              {
                value: 'essential',
                label: 'Essential Only',
                tooltip: 'messageCreate, interactionCreate, ready. Best for: Simple command bots, minimal overhead. Most bots only need these.',
                recommended: true
              },
              {
                value: 'moderation',
                label: 'Moderation Events',
                tooltip: 'Essential + messageDelete, messageUpdate, guildMemberAdd, guildMemberRemove, guildBanAdd. Best for: Moderation bots, logging, auto-mod.'
              },
              {
                value: 'comprehensive',
                label: 'Comprehensive',
                tooltip: 'All common events including voice, reactions, roles, channels. Best for: Full-featured bots, analytics, complex automation.'
              },
            ],
            defaultValue: 'essential',
          },
        ],
      },
      {
        id: 'permissions',
        name: 'Permission System',
        description: 'Role and permission management',
        tooltip: 'Control who can use commands. Examples: Admin-only commands, moderator tools, VIP features, cooldowns. Prevents abuse and unauthorized use.',
        configOptions: [
          {
            id: 'permissionType',
            label: 'Permission Model',
            type: 'select',
            tooltip: 'How to check user permissions for commands.',
            options: [
              {
                value: 'discord-native',
                label: 'Discord Permissions',
                tooltip: 'Use Discord\'s built-in permissions (Administrator, Manage Messages, etc.). Best for: Simple bots, standard moderation. Easy to use, Discord UI support.',
                recommended: true
              },
              {
                value: 'role-based',
                label: 'Role-Based',
                tooltip: 'Check by role names/IDs. Best for: Custom hierarchies, VIP systems, custom permissions. Example: "Premium" role gets extra commands.'
              },
              {
                value: 'custom-db',
                label: 'Custom Database',
                tooltip: 'Store permissions in database. Best for: Per-user permissions, complex systems, multi-server setups. Most flexible but requires database.'
              },
            ],
            defaultValue: 'discord-native',
          },
        ],
      },
      {
        id: 'database',
        name: 'Database Integration',
        description: 'Store persistent data',
        tooltip: 'Save data across bot restarts. Examples: user levels/XP, economy systems, custom settings, moderation logs, leaderboards, user preferences.',
        configOptions: [
          {
            id: 'dbType',
            label: 'Database Type',
            type: 'select',
            tooltip: 'Where to store bot data persistently.',
            options: [
              {
                value: 'none',
                label: 'No Database',
                tooltip: 'No persistent storage. Data lost on restart. Best for: Simple bots, stateless commands, testing. Not recommended for production.',
                recommended: true
              },
              {
                value: 'sqlite',
                label: 'SQLite (Local)',
                tooltip: 'File-based SQL database. Best for: Small-medium bots (<100 servers), easy setup, no hosting needed. Fast for single-server deployment.'
              },
              {
                value: 'mongodb',
                label: 'MongoDB (Cloud)',
                tooltip: 'NoSQL cloud database. Best for: Large bots (100+ servers), flexible schemas, horizontal scaling. Free tier: MongoDB Atlas.'
              },
              {
                value: 'postgresql',
                label: 'PostgreSQL (Cloud)',
                tooltip: 'SQL cloud database. Best for: Complex queries, relational data, transactions. Free tier: Supabase, Railway.'
              },
            ],
            defaultValue: 'none',
          },
        ],
        autoBundles: ['env-config'],
      },
      {
        id: 'logging',
        name: 'Logging & Debugging',
        description: 'Track bot activity and errors',
        tooltip: 'Monitor bot health, debug issues, track usage. Essential for production bots. Examples: command usage stats, error alerts, performance monitoring.',
        configOptions: [
          {
            id: 'logLevel',
            label: 'Logging Library',
            type: 'select',
            tooltip: 'How to log bot activity and errors.',
            options: [
              {
                value: 'console',
                label: 'Console (Simple)',
                tooltip: 'Basic console.log. Best for: Development, small bots. No setup needed. Not recommended for production.',
                recommended: true
              },
              {
                value: 'pino',
                label: 'Pino (Fast)',
                tooltip: 'Fast structured logging. Best for: Production bots, performance-critical apps. Integrates with log aggregators (Datadog, Logtail).'
              },
              {
                value: 'winston',
                label: 'Winston (Feature-rich)',
                tooltip: 'Flexible logging with transports. Best for: Multiple outputs (file + console + cloud), log rotation, custom formatting.'
              },
            ],
            defaultValue: 'console',
          },
        ],
      },
      {
        id: 'features',
        name: 'Bot Features',
        description: 'Common Discord bot functionality',
        tooltip: 'Pre-built features to add to your bot. Save time with ready-made implementations of popular bot features.',
        configOptions: [
          {
            id: 'includeEconomy',
            label: 'Economy System',
            type: 'toggle',
            tooltip: 'Virtual currency, shops, inventory. Examples: /balance, /daily, /buy, /leaderboard. Requires database. Popular feature for engagement.',
            defaultValue: false,
          },
          {
            id: 'includeLeveling',
            label: 'Leveling/XP System',
            type: 'toggle',
            tooltip: 'User levels and experience points. Examples: /rank, /leaderboard, role rewards. Requires database. Boosts server activity.',
            defaultValue: false,
          },
          {
            id: 'includeModeration',
            label: 'Moderation Tools',
            type: 'toggle',
            tooltip: 'Moderation commands: /ban, /kick, /mute, /warn, /purge. Includes logging and reason tracking. Essential for server management.',
            defaultValue: false,
          },
          {
            id: 'includeMusic',
            label: 'Music Player',
            type: 'toggle',
            tooltip: 'Play music from YouTube/Spotify. Examples: /play, /skip, /queue, /pause. Uses discord-player or voice library. Resource-intensive.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'deployment',
        name: 'Hosting & Deployment',
        description: 'Where to run your Discord bot',
        tooltip: 'Discord bots must run 24/7 to respond to commands. Choose hosting that fits your bot\'s scale and budget.',
        configOptions: [
          {
            id: 'deployTarget',
            label: 'Hosting Platform',
            type: 'select',
            tooltip: 'Where will your bot be hosted?',
            options: [
              {
                value: 'local',
                label: 'Local Machine',
                tooltip: 'Run on your computer. Best for: Development, testing. Free but requires your PC to stay on 24/7. Not for production.',
                recommended: true
              },
              {
                value: 'railway',
                label: 'Railway',
                tooltip: 'Easy cloud hosting for Discord bots. Best for: Production bots, $5/month. One-click deploy, automatic restarts, logs dashboard.'
              },
              {
                value: 'heroku',
                label: 'Heroku',
                tooltip: 'Classic PaaS hosting. Best for: Simple deploy, familiar platform. Free tier discontinued (Nov 2022), paid plans start $7/month.'
              },
              {
                value: 'vps',
                label: 'VPS (DigitalOcean/Linode)',
                tooltip: 'Virtual private server. Best for: Full control, multiple bots, custom setup. Requires Linux knowledge. $4-6/month.'
              },
              {
                value: 'docker',
                label: 'Docker Container',
                tooltip: 'Containerized deployment. Best for: Reproducible builds, multi-platform, Kubernetes. Deploy to any cloud provider.'
              },
            ],
            defaultValue: 'local',
          },
          {
            id: 'includeDockerfile',
            label: 'Include Dockerfile',
            type: 'toggle',
            tooltip: 'Generate Dockerfile for container deployment. Useful even for non-Docker hosting (ensures reproducible builds).',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'Linting, formatting, and type checking',
        tooltip: 'Ensure code quality with automated tools. Catches bugs early, maintains consistent style. Essential for team development.',
        recommended: true,
        hidden: true, // Auto-included
      },
      {
        id: 'env-config',
        name: 'Environment Configuration',
        description: 'Manage bot token and secrets',
        tooltip: 'Store Discord bot token, API keys, and config safely. Never commit secrets to Git. Uses .env file with .env.example template.',
        recommended: true,
        hidden: true, // Auto-included
      },
      {
        id: 'testing',
        name: 'Testing Setup',
        description: 'Test your bot commands and handlers',
        tooltip: 'Write tests for commands and event handlers. Prevents regressions, documents expected behavior.',
        configOptions: [
          {
            id: 'testFramework',
            label: 'Test Framework',
            type: 'select',
            tooltip: 'Choose a test runner for bot testing.',
            options: [
              {
                value: 'none',
                label: 'No Testing',
                tooltip: 'Skip testing setup. Best for: Quick prototypes, personal bots. Not recommended for production.',
                recommended: true
              },
              {
                value: 'jest',
                label: 'Jest',
                tooltip: 'Popular test framework. Best for: Discord bots, mocking Discord.js, familiar to most devs. Extensive Discord.js testing guides available.'
              },
              {
                value: 'vitest',
                label: 'Vitest',
                tooltip: 'Fast, modern test runner. Best for: TypeScript bots, Vite projects, fast feedback loops.'
              },
            ],
            defaultValue: 'none',
          },
        ],
      },
    ],
  },
  {
    id: 'slack-bot',
    name: 'Slack Bot',
    description: 'Slack Bolt app with slash commands and workflows',
    tooltip: 'Build Slack bots with slash commands, shortcuts, modals, and event handlers. Perfect for: team automation, workflows, custom integrations, notifications, productivity tools, ChatOps, scheduled tasks. Examples: Polly, Donut, Standuply use Slack Bolt. Works with Slack\'s latest Block Kit UI.',
    icon: null, // Will be set in component
    gradient: 'linear-gradient(90deg, #E01E5A 0%, #ECB22E 25%, #ffffff 50%, #36C5F0 75%, #2EB67D 100%)',
    command: 'git clone https://github.com/slack-samples/bolt-ts-starter-template',
    commandFlags: {},
    features: [
      {
        id: 'slash-commands',
        name: 'Slash Commands',
        description: 'Custom commands for Slack',
        tooltip: 'Slash commands let users trigger your app from any Slack conversation. Examples: /standup, /poll "Question?", /remind me in 1h. They appear in Slack\'s autocomplete. Essential for most Slack bots.',
        recommended: true,
        configOptions: [
          {
            id: 'commandPattern',
            label: 'Command Organization',
            type: 'select',
            tooltip: 'How to structure your slash command handlers.',
            options: [
              {
                value: 'listeners-folder',
                label: 'Listeners Folder',
                tooltip: 'Bolt best practice: /listeners/commands/ directory. Best for: Organized bots, team development, 5+ commands. Example: listeners/commands/standup.ts',
                recommended: true
              },
              {
                value: 'single-file',
                label: 'Single File',
                tooltip: 'All commands in app.ts. Best for: Simple bots with 1-3 commands, quick prototypes. Gets messy with many commands.'
              },
              {
                value: 'command-registry',
                label: 'Command Registry',
                tooltip: 'Advanced pattern with dynamic loading. Best for: Large bots (20+ commands), plugin systems, multi-workspace apps.'
              },
            ],
            defaultValue: 'listeners-folder',
          },
          {
            id: 'includeExamples',
            label: 'Include Example Commands',
            type: 'toggle',
            tooltip: 'Generate example slash commands: /hello, /echo <message>, /remind. Great for learning Bolt patterns.',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'shortcuts',
        name: 'Shortcuts & Actions',
        description: 'Quick actions from messages and menus',
        tooltip: 'Shortcuts = Quick actions triggered from Slack UI. Message shortcuts = right-click messages (e.g., "Create Task"). Global shortcuts = lightning bolt menu (e.g., "Start Standup"). Boost productivity.',
        recommended: true,
        configOptions: [
          {
            id: 'includeMessageShortcuts',
            label: 'Message Shortcuts',
            type: 'toggle',
            tooltip: 'Right-click message actions. Examples: "Save to Notes", "Create Ticket", "Translate Message". Access any message context.',
            defaultValue: true,
          },
          {
            id: 'includeGlobalShortcuts',
            label: 'Global Shortcuts',
            type: 'toggle',
            tooltip: 'Lightning bolt menu actions. Examples: "Create Poll", "Start Standup", "Open Dashboard". Available from anywhere in Slack.',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'block-kit',
        name: 'Block Kit UI',
        description: 'Rich interactive messages',
        tooltip: 'Block Kit = Slack\'s UI framework for beautiful messages. Build with blocks (text, buttons, dropdowns, images, dividers). Use Block Kit Builder to design visually. Much better than plain text!',
        recommended: true,
        configOptions: [
          {
            id: 'includeButtons',
            label: 'Interactive Buttons',
            type: 'toggle',
            tooltip: 'Add clickable buttons to messages. Examples: "Approve/Reject", "Yes/No", "Mark Complete". Actions trigger your bot handlers.',
            defaultValue: true,
          },
          {
            id: 'includeSelectMenus',
            label: 'Select Menus',
            type: 'toggle',
            tooltip: 'Dropdown/checkbox selections. Examples: user picker, channel picker, date picker, static options. Great for forms and settings.',
            defaultValue: true,
          },
          {
            id: 'includeModals',
            label: 'Modal Forms',
            type: 'toggle',
            tooltip: 'Popup forms for complex input. Examples: ticket creation, survey, settings, multi-step wizards. Can have text inputs, selects, checkboxes.',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'events',
        name: 'Event Subscriptions',
        description: 'React to Slack workspace events',
        tooltip: 'Listen to Slack events to trigger bot actions. Examples: welcome new members, react to mentions, monitor messages, track emoji reactions, log file uploads.',
        recommended: true,
        configOptions: [
          {
            id: 'eventTypes',
            label: 'Event Categories',
            type: 'select',
            tooltip: 'Which Slack events your bot will handle.',
            options: [
              {
                value: 'essential',
                label: 'Essential Only',
                tooltip: 'message, app_mention, app_home_opened. Best for: Simple bots, minimal permissions. Most bots only need these.',
                recommended: true
              },
              {
                value: 'automation',
                label: 'Automation Events',
                tooltip: 'Essential + member_joined_channel, reaction_added, file_shared. Best for: Welcome bots, notification systems, file processing.'
              },
              {
                value: 'comprehensive',
                label: 'Comprehensive',
                tooltip: 'All common events including channel updates, team changes, workflow steps. Best for: Analytics, compliance, advanced automation.'
              },
            ],
            defaultValue: 'essential',
          },
        ],
      },
      {
        id: 'app-home',
        name: 'App Home',
        description: 'Custom app homepage in Slack',
        tooltip: 'App Home = Your bot\'s dedicated tab in Slack. Users click your app → see custom UI. Examples: dashboards, settings, help docs, task lists. Great for app discoverability.',
        configOptions: [
          {
            id: 'includeHomeTab',
            label: 'Home Tab',
            type: 'toggle',
            tooltip: 'Enable custom Home tab with Block Kit UI. Examples: personalized dashboard, recent activity, quick actions. Users see it when opening your app.',
            defaultValue: false,
          },
          {
            id: 'includeMessagesTab',
            label: 'Messages Tab',
            type: 'toggle',
            tooltip: 'Enable DM conversations with your bot. Users can message your bot directly. Essential for conversational bots.',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'workflows',
        name: 'Workflow Steps',
        description: 'Custom steps for Slack Workflows',
        tooltip: 'Workflow Steps = Add your bot to Slack\'s no-code Workflow Builder. Users can drag-drop your custom steps. Examples: "Send to External API", "Create Database Record", "Custom Approval". Extends Slack workflows.',
        configOptions: [
          {
            id: 'includeWorkflowSteps',
            label: 'Enable Workflow Steps',
            type: 'toggle',
            tooltip: 'Create custom workflow steps users can add to their workflows. Great for: integrations, approvals, data processing. Non-technical users love this.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'database',
        name: 'Database Integration',
        description: 'Store persistent data',
        tooltip: 'Save data across bot restarts. Examples: user preferences, task lists, poll results, analytics, custom settings, approval history.',
        configOptions: [
          {
            id: 'dbType',
            label: 'Database Type',
            type: 'select',
            tooltip: 'Where to store bot data persistently.',
            options: [
              {
                value: 'none',
                label: 'No Database',
                tooltip: 'No persistent storage. Data lost on restart. Best for: Simple bots, stateless commands, testing. Not recommended for production.',
                recommended: true
              },
              {
                value: 'sqlite',
                label: 'SQLite (Local)',
                tooltip: 'File-based SQL database. Best for: Small teams (<50 users), easy setup, single workspace. Fast for development.'
              },
              {
                value: 'mongodb',
                label: 'MongoDB (Cloud)',
                tooltip: 'NoSQL cloud database. Best for: Multi-workspace apps, flexible schemas, scaling. Free tier: MongoDB Atlas.'
              },
              {
                value: 'postgresql',
                label: 'PostgreSQL (Cloud)',
                tooltip: 'SQL cloud database. Best for: Complex queries, relational data, transactions. Free tier: Supabase, Railway.'
              },
              {
                value: 'firebase',
                label: 'Firebase (Google)',
                tooltip: 'Real-time NoSQL database. Best for: Real-time updates, mobile/web sync, Google Cloud ecosystem. Free tier: Spark plan.'
              },
            ],
            defaultValue: 'none',
          },
        ],
        autoBundles: ['env-config'],
      },
      {
        id: 'authentication',
        name: 'OAuth & Permissions',
        description: 'User authentication and scopes',
        tooltip: 'OAuth = Users install your bot to their workspace. Scopes = Permissions your bot requests (read messages, post messages, etc.). Essential for production bots.',
        configOptions: [
          {
            id: 'distributionType',
            label: 'Distribution Model',
            type: 'select',
            tooltip: 'How will users install your bot?',
            options: [
              {
                value: 'single-workspace',
                label: 'Single Workspace',
                tooltip: 'Bot for one workspace only (your team). Best for: Internal tools, team automation. Simpler setup, no OAuth needed.',
                recommended: true
              },
              {
                value: 'multi-workspace',
                label: 'Multi-Workspace',
                tooltip: 'Distribute to multiple workspaces. Best for: Public bots, SaaS products. Requires OAuth flow, workspace database.'
              },
            ],
            defaultValue: 'single-workspace',
          },
        ],
      },
      {
        id: 'logging',
        name: 'Logging & Debugging',
        description: 'Track bot activity and errors',
        tooltip: 'Monitor bot health, debug issues, track usage. Essential for production bots. Examples: command usage stats, error alerts, performance monitoring.',
        configOptions: [
          {
            id: 'logLevel',
            label: 'Logging Library',
            type: 'select',
            tooltip: 'How to log bot activity and errors.',
            options: [
              {
                value: 'console',
                label: 'Console (Simple)',
                tooltip: 'Basic console.log. Best for: Development, small bots. Bolt has built-in logging. Not recommended for production.',
                recommended: true
              },
              {
                value: 'pino',
                label: 'Pino (Fast)',
                tooltip: 'Fast structured logging. Best for: Production bots, high traffic. Integrates with log aggregators (Datadog, Logtail).'
              },
              {
                value: 'winston',
                label: 'Winston (Feature-rich)',
                tooltip: 'Flexible logging with transports. Best for: Multiple outputs (file + console + cloud), log rotation, custom formatting.'
              },
            ],
            defaultValue: 'console',
          },
        ],
      },
      {
        id: 'deployment',
        name: 'Hosting & Deployment',
        description: 'Where to run your Slack bot',
        tooltip: 'Slack bots must run 24/7 with public HTTPS endpoint. Slack sends events to your URL. Choose hosting that supports HTTPS and webhooks.',
        configOptions: [
          {
            id: 'deployTarget',
            label: 'Hosting Platform',
            type: 'select',
            tooltip: 'Where will your bot be hosted?',
            options: [
              {
                value: 'local-ngrok',
                label: 'Local + ngrok',
                tooltip: 'Run locally with ngrok tunnel. Best for: Development, testing. Free but requires your PC on. Not for production.',
                recommended: true
              },
              {
                value: 'heroku',
                label: 'Heroku',
                tooltip: 'Classic PaaS hosting. Best for: Easy deploy, familiar platform. Paid plans start $7/month (free tier discontinued).'
              },
              {
                value: 'railway',
                label: 'Railway',
                tooltip: 'Modern cloud hosting. Best for: Production bots, $5/month. One-click deploy, automatic HTTPS, logs dashboard.'
              },
              {
                value: 'aws-lambda',
                label: 'AWS Lambda',
                tooltip: 'Serverless functions. Best for: Enterprise, auto-scaling, AWS ecosystem. More complex setup but very scalable.'
              },
              {
                value: 'vercel',
                label: 'Vercel',
                tooltip: 'Serverless platform. Best for: TypeScript bots, Next.js integration, quick deploy. Free tier available.'
              },
              {
                value: 'docker',
                label: 'Docker Container',
                tooltip: 'Containerized deployment. Best for: Reproducible builds, Kubernetes, any cloud provider. Requires Docker knowledge.'
              },
            ],
            defaultValue: 'local-ngrok',
          },
        ],
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'Linting, formatting, and type checking',
        tooltip: 'Ensure code quality with automated tools. Catches bugs early, maintains consistent style. Essential for team development.',
        recommended: true,
        hidden: true, // Auto-included
      },
      {
        id: 'env-config',
        name: 'Environment Configuration',
        description: 'Manage Slack tokens and secrets',
        tooltip: 'Store Slack bot/app tokens, signing secret, and API keys safely. Never commit secrets to Git. Uses .env file with .env.example template.',
        recommended: true,
        hidden: true, // Auto-included
      },
      {
        id: 'testing',
        name: 'Testing Setup',
        description: 'Test your bot commands and handlers',
        tooltip: 'Write tests for slash commands, shortcuts, and event handlers. Prevents regressions, documents expected behavior.',
        configOptions: [
          {
            id: 'testFramework',
            label: 'Test Framework',
            type: 'select',
            tooltip: 'Choose a test runner for Slack bot testing.',
            options: [
              {
                value: 'none',
                label: 'No Testing',
                tooltip: 'Skip testing setup. Best for: Quick prototypes, personal bots. Not recommended for production.',
                recommended: true
              },
              {
                value: 'jest',
                label: 'Jest',
                tooltip: 'Popular test framework. Best for: Slack bots, mocking Bolt framework, familiar to most devs.'
              },
              {
                value: 'vitest',
                label: 'Vitest',
                tooltip: 'Fast, modern test runner. Best for: TypeScript bots, fast feedback loops, ESM support.'
              },
            ],
            defaultValue: 'none',
          },
        ],
      },
    ],
  },
  {
    id: 'tauri-desktop',
    name: 'Tauri Desktop App',
    description: 'Cross-platform desktop app with Rust backend',
    tooltip: 'Build lightweight, secure desktop apps for Windows, macOS, and Linux. Smaller than Electron (3MB vs 120MB), faster startup, better security. Perfect for: productivity tools, system utilities, media apps, dashboards, local-first apps. Examples: 1Password, Warp, Radicle use Tauri. Uses OS WebView instead of bundling Chromium.',
    icon: null, // Will be set in component
    gradient: 'linear-gradient(90deg, #FFC131 0%, #FFD84D 25%, #ffffff 50%, #FFD84D 75%, #FFC131 100%)',
    command: 'npm create tauri-app@latest',
    commandFlags: {},
    features: [
      {
        id: 'frontend-framework',
        name: 'Frontend Framework',
        description: 'Choose your web framework',
        tooltip: 'Tauri uses web technologies for the UI. Choose a framework you\'re comfortable with. The frontend runs in OS WebView (not Chromium), keeping bundle size tiny.',
        recommended: true,
        configOptions: [
          {
            id: 'framework',
            label: 'Framework',
            type: 'select',
            tooltip: 'Which frontend framework to use for your desktop app UI.',
            options: [
              {
                value: 'react',
                label: 'React',
                tooltip: 'Most popular framework. Best for: Large apps, complex UIs, familiar to most devs. Huge ecosystem.',
                recommended: true
              },
              {
                value: 'vue',
                label: 'Vue',
                tooltip: 'Progressive framework. Best for: Gradual adoption, elegant syntax, great docs. Popular in Europe/Asia.'
              },
              {
                value: 'svelte',
                label: 'Svelte',
                tooltip: 'Compile-time framework. Best for: Smaller bundles, faster runtime, simpler code. No virtual DOM overhead.'
              },
              {
                value: 'solid',
                label: 'SolidJS',
                tooltip: 'Fine-grained reactivity. Best for: Performance-critical apps, reactive UIs. Similar to React but faster.'
              },
              {
                value: 'vanilla',
                label: 'Vanilla (HTML/CSS/JS)',
                tooltip: 'No framework. Best for: Simple apps, learning Tauri, minimal overhead. Lightest option.'
              },
            ],
            defaultValue: 'react',
          },
          {
            id: 'typescript',
            label: 'Use TypeScript',
            type: 'toggle',
            tooltip: 'Add TypeScript for type safety. Highly recommended for Tauri apps (Rust backend is typed, frontend should be too).',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'tauri-features',
        name: 'Tauri Native Features',
        description: 'OS-level integrations',
        tooltip: 'Tauri provides plugins for native OS features. These run in the Rust backend and are exposed to frontend via IPC. Secure by default with permission system.',
        recommended: true,
        configOptions: [
          {
            id: 'includeSystemTray',
            label: 'System Tray Icon',
            type: 'toggle',
            tooltip: 'Add app to system tray (menu bar on macOS, taskbar on Windows). Examples: quick actions, show/hide window, status indicators. Great for background apps.',
            defaultValue: true,
          },
          {
            id: 'includeNotifications',
            label: 'OS Notifications',
            type: 'toggle',
            tooltip: 'Send native desktop notifications. Examples: task reminders, alerts, status updates. Uses OS notification center.',
            defaultValue: true,
          },
          {
            id: 'includeFileSystem',
            label: 'File System Access',
            type: 'toggle',
            tooltip: 'Read/write files with permission dialogs. Examples: save/load documents, config files, exports. Sandboxed for security.',
            defaultValue: true,
          },
          {
            id: 'includeDialog',
            label: 'Native Dialogs',
            type: 'toggle',
            tooltip: 'Open/save file dialogs, message boxes, confirm dialogs. Uses OS-native dialogs (looks native on each platform).',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'window-config',
        name: 'Window Configuration',
        description: 'App window behavior',
        tooltip: 'Configure how your app window behaves. Frameless/transparent windows for custom designs, multi-window support for complex apps.',
        configOptions: [
          {
            id: 'windowType',
            label: 'Window Style',
            type: 'select',
            tooltip: 'How should the app window look?',
            options: [
              {
                value: 'standard',
                label: 'Standard Window',
                tooltip: 'Normal window with OS-native title bar. Best for: Traditional desktop apps, familiar UX. Easiest to use.',
                recommended: true
              },
              {
                value: 'frameless',
                label: 'Frameless (Custom Title Bar)',
                tooltip: 'Remove OS title bar, create custom UI. Best for: Modern apps, custom branding. Examples: VS Code, Spotify. Requires custom close/minimize buttons.'
              },
              {
                value: 'transparent',
                label: 'Transparent Window',
                tooltip: 'Fully transparent window. Best for: Widgets, overlays, creative UIs. Advanced use case.'
              },
            ],
            defaultValue: 'standard',
          },
          {
            id: 'includeMultiWindow',
            label: 'Multi-Window Support',
            type: 'toggle',
            tooltip: 'Enable opening multiple windows. Examples: preferences window, inspector, secondary views. Like opening new browser tabs.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'updater',
        name: 'Auto-Updater',
        description: 'Automatic app updates',
        tooltip: 'Tauri\'s updater downloads and installs new versions automatically. Essential for production apps. Users get updates without visiting your website.',
        configOptions: [
          {
            id: 'enableUpdater',
            label: 'Enable Auto-Updates',
            type: 'toggle',
            tooltip: 'Check for updates on app launch. Downloads and installs silently. Requires hosting update manifest JSON. Best practice for all production apps.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'database',
        name: 'Local Database',
        description: 'Store app data locally',
        tooltip: 'Desktop apps often need local storage. Options range from simple JSON files to full SQL databases. All stored on user\'s machine (offline-first).',
        configOptions: [
          {
            id: 'dbType',
            label: 'Database Type',
            type: 'select',
            tooltip: 'How to store app data locally.',
            options: [
              {
                value: 'none',
                label: 'No Database',
                tooltip: 'No persistent storage (or use browser localStorage). Best for: Simple apps, stateless tools. Data lost when app closes.',
                recommended: true
              },
              {
                value: 'sqlite',
                label: 'SQLite (Rust)',
                tooltip: 'SQL database in Rust backend. Best for: Structured data, complex queries, large datasets. Fast, reliable, offline. Popular choice.'
              },
              {
                value: 'surrealdb',
                label: 'SurrealDB',
                tooltip: 'Modern multi-model DB. Best for: Graph data, real-time sync, flexible schemas. Embedded mode for offline use.'
              },
              {
                value: 'tauri-store',
                label: 'Tauri Store Plugin',
                tooltip: 'Simple key-value store. Best for: App settings, preferences, small data. Easy to use, JSON-based.'
              },
            ],
            defaultValue: 'none',
          },
        ],
        autoBundles: ['env-config'],
      },
      {
        id: 'ipc-patterns',
        name: 'IPC & Backend Logic',
        description: 'Frontend-backend communication',
        tooltip: 'Tauri apps split logic: frontend (UI in WebView) and backend (Rust for performance/security). IPC = how they communicate. Define commands in Rust, call from JS.',
        configOptions: [
          {
            id: 'ipcPattern',
            label: 'IPC Organization',
            type: 'select',
            tooltip: 'How to organize backend Rust commands.',
            options: [
              {
                value: 'modules',
                label: 'Module-Based',
                tooltip: 'Organize commands by feature module. Best for: Medium-large apps, team development. Example: src-tauri/src/commands/file.rs',
                recommended: true
              },
              {
                value: 'single-file',
                label: 'Single File',
                tooltip: 'All commands in main.rs. Best for: Small apps (<10 commands), quick prototypes. Gets messy at scale.'
              },
            ],
            defaultValue: 'modules',
          },
        ],
      },
      {
        id: 'security',
        name: 'Security & Permissions',
        description: 'App security configuration',
        tooltip: 'Tauri is secure by default. Fine-grained permissions control what frontend can access. CSP prevents XSS attacks. Essential for production apps.',
        recommended: true,
        configOptions: [
          {
            id: 'securityLevel',
            label: 'Security Preset',
            type: 'select',
            tooltip: 'How strict should security be?',
            options: [
              {
                value: 'recommended',
                label: 'Recommended',
                tooltip: 'Balanced security. Best for: Most apps. Enables CSP, restricts dangerous APIs, allows common use cases.',
                recommended: true
              },
              {
                value: 'strict',
                label: 'Strict (Paranoid)',
                tooltip: 'Maximum security. Best for: Financial apps, sensitive data. Blocks everything by default, explicit allow-list only.'
              },
              {
                value: 'permissive',
                label: 'Permissive (Dev)',
                tooltip: 'Relaxed for development. Best for: Rapid prototyping, learning. NOT for production. Disables some safety checks.'
              },
            ],
            defaultValue: 'recommended',
          },
        ],
        hidden: true, // Auto-included
      },
      {
        id: 'packaging',
        name: 'Build & Distribution',
        description: 'How to package and distribute',
        tooltip: 'Tauri builds native installers for each platform. Smaller bundles than Electron (3-10MB vs 120MB). Code signing for macOS/Windows trust.',
        configOptions: [
          {
            id: 'platforms',
            label: 'Target Platforms',
            type: 'select',
            tooltip: 'Which operating systems to support.',
            options: [
              {
                value: 'all',
                label: 'All Platforms',
                tooltip: 'Windows, macOS, Linux. Best for: Maximum reach, cross-platform tools. Requires testing on each OS.',
                recommended: true
              },
              {
                value: 'desktop-only',
                label: 'Desktop Only (Win + Mac)',
                tooltip: 'Skip Linux. Best for: Consumer apps, most users are on Win/Mac. Simpler QA.'
              },
              {
                value: 'single-platform',
                label: 'Single Platform',
                tooltip: 'One OS only. Best for: Internal tools, platform-specific features. Easier to develop/test.'
              },
            ],
            defaultValue: 'all',
          },
          {
            id: 'includeCodeSigning',
            label: 'Code Signing Setup',
            type: 'toggle',
            tooltip: 'Configure for macOS notarization and Windows code signing. Prevents "untrusted developer" warnings. Required for production distribution.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'developer-tools',
        name: 'Developer Experience',
        description: 'Development and debugging tools',
        tooltip: 'Tools to make Tauri development easier. Hot reload for fast iteration, devtools for debugging, logging for troubleshooting.',
        configOptions: [
          {
            id: 'includeDevTools',
            label: 'Enable DevTools',
            type: 'toggle',
            tooltip: 'Chrome DevTools in development builds. Inspect UI, debug JS, view network. Automatically disabled in production.',
            defaultValue: true,
          },
          {
            id: 'loggingLib',
            label: 'Logging',
            type: 'select',
            tooltip: 'How to log from Rust backend.',
            options: [
              {
                value: 'env_logger',
                label: 'env_logger (Simple)',
                tooltip: 'Standard Rust logging. Best for: Development, simple apps. Configure via RUST_LOG env var.',
                recommended: true
              },
              {
                value: 'tracing',
                label: 'tracing (Advanced)',
                tooltip: 'Structured logging with spans. Best for: Complex apps, performance profiling, production debugging. More powerful.'
              },
            ],
            defaultValue: 'env_logger',
          },
        ],
      },
      {
        id: 'mobile-support',
        name: 'Mobile Support (Beta)',
        description: 'iOS and Android apps',
        tooltip: 'Tauri 2.0 added mobile support (beta). Same codebase for desktop AND mobile. Still experimental but promising for cross-platform apps.',
        configOptions: [
          {
            id: 'enableMobile',
            label: 'Enable Mobile Targets',
            type: 'toggle',
            tooltip: 'Add iOS and Android support. BETA feature. Best for: Experimenting, cross-platform MVP. Not production-ready yet.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'Linting and formatting',
        tooltip: 'Ensure code quality for both frontend (ESLint/Prettier) and backend (Clippy/rustfmt). Essential for team development.',
        recommended: true,
        hidden: true, // Auto-included
      },
      {
        id: 'env-config',
        name: 'Environment Configuration',
        description: 'Manage secrets and config',
        tooltip: 'Environment variables for API keys, feature flags, etc. Never commit secrets to Git. Uses .env with .env.example template.',
        recommended: true,
        hidden: true, // Auto-included
      },
      {
        id: 'testing',
        name: 'Testing Setup',
        description: 'Test your app',
        tooltip: 'Test both frontend (Vitest/Jest) and backend (Rust tests). E2E testing with WebDriver. Prevents regressions.',
        configOptions: [
          {
            id: 'testFramework',
            label: 'Frontend Test Framework',
            type: 'select',
            tooltip: 'Choose a test runner for frontend code.',
            options: [
              {
                value: 'vitest',
                label: 'Vitest',
                tooltip: 'Fast, modern test runner. Best for: Vite projects, TypeScript, fast feedback. Recommended for Tauri.',
                recommended: true
              },
              {
                value: 'jest',
                label: 'Jest',
                tooltip: 'Popular test framework. Best for: React apps, familiar to most devs. Mature ecosystem.'
              },
              {
                value: 'none',
                label: 'No Testing',
                tooltip: 'Skip testing setup. Best for: Quick prototypes. Not recommended for production apps.'
              },
            ],
            defaultValue: 'vitest',
          },
          {
            id: 'includeE2E',
            label: 'E2E Testing (WebDriver)',
            type: 'toggle',
            tooltip: 'End-to-end testing with WebDriver. Test full app workflows. Examples: opening windows, clicking buttons, verifying results.',
            defaultValue: false,
          },
        ],
      },
    ],
  },
  {
    id: 'backend-api',
    name: 'Backend API (Hono)',
    description: 'Ultra-fast REST API with Hono framework',
    tooltip: 'Build blazing-fast APIs that run anywhere. Smaller & faster than Express. Perfect for: microservices, mobile backends, serverless APIs, webhooks, data pipelines. Works with Bun (fastest!), Cloudflare Workers, Deno, Node.js. Examples: Use Hono for high-performance APIs with minimal overhead.',
    icon: null, // Will be set in component
    gradient: 'linear-gradient(90deg, #FF6600 0%, #FF8833 25%, #ffffff 50%, #FF8833 75%, #FF6600 100%)',
    command: 'npm create hono@latest',
    commandFlags: {},
    features: [
      {
        id: 'runtime',
        name: 'Runtime Environment',
        description: 'Where your API will run',
        tooltip: 'Hono works on any JavaScript runtime. Each has different trade-offs for speed, deployment, and features.',
        recommended: true,
        configOptions: [
          {
            id: 'runtime',
            label: 'Runtime',
            type: 'select',
            tooltip: 'Which JavaScript runtime to use.',
            options: [
              {
                value: 'bun',
                label: 'Bun',
                tooltip: 'FASTEST runtime (3x faster than Node). Best for: New projects, maximum performance, modern APIs. Native TypeScript support. Recommended!',
                recommended: true
              },
              {
                value: 'cloudflare-workers',
                label: 'Cloudflare Workers',
                tooltip: 'Edge serverless (runs globally). Best for: Low-latency APIs, auto-scaling, $5/month. Deploy worldwide instantly. Great for public APIs.'
              },
              {
                value: 'deno',
                label: 'Deno',
                tooltip: 'Secure runtime with built-in TypeScript. Best for: Security-focused apps, no npm needed. Modern alternative to Node.js.'
              },
              {
                value: 'nodejs',
                label: 'Node.js',
                tooltip: 'Traditional runtime. Best for: Existing Node.js infrastructure, team familiarity, npm ecosystem. Most compatible.'
              },
            ],
            defaultValue: 'bun',
          },
        ],
      },
      {
        id: 'routing',
        name: 'API Routes & Structure',
        description: 'Organize your endpoints',
        tooltip: 'How to structure your API routes. Hono supports both file-based routing and programmatic routes.',
        configOptions: [
          {
            id: 'routingPattern',
            label: 'Route Organization',
            type: 'select',
            tooltip: 'How to organize API endpoints.',
            options: [
              {
                value: 'modular',
                label: 'Modular (Recommended)',
                tooltip: 'Organize routes by feature/resource. Best for: Medium-large APIs, team development. Example: src/routes/users.ts, src/routes/posts.ts',
                recommended: true
              },
              {
                value: 'single-file',
                label: 'Single File',
                tooltip: 'All routes in one file. Best for: Simple APIs (<10 endpoints), quick prototypes. Gets messy at scale.'
              },
              {
                value: 'file-based',
                label: 'File-Based Routing',
                tooltip: 'Routes based on file structure (like Next.js). Best for: Convention over configuration. Example: routes/api/users/[id].ts'
              },
            ],
            defaultValue: 'modular',
          },
        ],
      },
      {
        id: 'authentication',
        name: 'Authentication & Authorization',
        description: 'Secure your API endpoints',
        tooltip: 'Control who can access your API. Essential for production APIs. Hono has built-in auth middleware.',
        recommended: true,
        configOptions: [
          {
            id: 'authType',
            label: 'Auth Method',
            type: 'select',
            tooltip: 'How users/services authenticate to your API.',
            options: [
              {
                value: 'jwt',
                label: 'JWT (JSON Web Tokens)',
                tooltip: 'Stateless token-based auth. Best for: Mobile apps, SPAs, microservices. Scalable, no server-side sessions. Industry standard.',
                recommended: true
              },
              {
                value: 'api-key',
                label: 'API Keys',
                tooltip: 'Simple bearer tokens. Best for: Internal services, server-to-server, webhooks. Easy to implement and revoke.'
              },
              {
                value: 'basic',
                label: 'Basic Auth',
                tooltip: 'Username/password in headers. Best for: Admin endpoints, simple auth, development. Not recommended for production (unless HTTPS).'
              },
              {
                value: 'oauth',
                label: 'OAuth 2.0',
                tooltip: 'Third-party login (Google, GitHub). Best for: User-facing APIs, social login, enterprise SSO. More complex setup.'
              },
              {
                value: 'none',
                label: 'No Auth',
                tooltip: 'Public API, no authentication. Best for: Open data APIs, webhooks, development. NOT for production with sensitive data.'
              },
            ],
            defaultValue: 'jwt',
          },
        ],
      },
      {
        id: 'database',
        name: 'Database Integration',
        description: 'Persist your data',
        tooltip: 'Connect to a database for storing API data. Includes ORM/query builder setup.',
        configOptions: [
          {
            id: 'dbType',
            label: 'Database',
            type: 'select',
            tooltip: 'Which database to use.',
            options: [
              {
                value: 'postgresql',
                label: 'PostgreSQL',
                tooltip: 'Most popular SQL database. Best for: Relational data, complex queries, transactions. Free tier: Supabase, Neon, Railway.',
                recommended: true
              },
              {
                value: 'sqlite',
                label: 'SQLite',
                tooltip: 'File-based SQL. Best for: Development, small APIs, serverless (D1 on Cloudflare). Simple, no hosting needed.'
              },
              {
                value: 'mongodb',
                label: 'MongoDB',
                tooltip: 'NoSQL document database. Best for: Flexible schemas, rapid iteration, JSON-like data. Free tier: MongoDB Atlas.'
              },
              {
                value: 'mysql',
                label: 'MySQL',
                tooltip: 'Traditional SQL database. Best for: Existing MySQL infrastructure, shared hosting. Wide support.'
              },
              {
                value: 'none',
                label: 'No Database',
                tooltip: 'Stateless API or external data source. Best for: Proxy APIs, data transformations, simple webhooks.'
              },
            ],
            defaultValue: 'postgresql',
          },
          {
            id: 'orm',
            label: 'ORM/Query Builder',
            type: 'select',
            tooltip: 'Tool for interacting with database.',
            options: [
              {
                value: 'drizzle',
                label: 'Drizzle ORM',
                tooltip: 'TypeScript-first, lightweight. Best for: Type safety, performance, Hono integration. Modern choice for new projects.',
                recommended: true
              },
              {
                value: 'prisma',
                label: 'Prisma',
                tooltip: 'Popular ORM with migrations. Best for: Auto-generated types, database migrations, Prisma Studio. Great DX.'
              },
              {
                value: 'raw-sql',
                label: 'Raw SQL',
                tooltip: 'Write SQL directly. Best for: Maximum control, complex queries, performance tuning. No ORM overhead.'
              },
            ],
            defaultValue: 'drizzle',
          },
        ],
        autoBundles: ['env-config'],
      },
      {
        id: 'validation',
        name: 'Request Validation',
        description: 'Validate incoming data',
        tooltip: 'Validate request body, query params, and headers. Prevents bad data from reaching your handlers. Essential for security.',
        recommended: true,
        configOptions: [
          {
            id: 'validationLib',
            label: 'Validation Library',
            type: 'select',
            tooltip: 'How to validate API requests.',
            options: [
              {
                value: 'zod',
                label: 'Zod',
                tooltip: 'TypeScript-first validation. Best for: Type inference, great error messages, Hono integration. Industry standard. Recommended!',
                recommended: true
              },
              {
                value: 'typebox',
                label: 'TypeBox',
                tooltip: 'JSON Schema validator. Best for: OpenAPI generation, JSON Schema compliance, performance. Faster than Zod.'
              },
              {
                value: 'none',
                label: 'Manual Validation',
                tooltip: 'Write validation yourself. Best for: Simple APIs, custom logic. Not recommended for production.'
              },
            ],
            defaultValue: 'zod',
          },
        ],
      },
      {
        id: 'api-docs',
        name: 'API Documentation',
        description: 'Auto-generate API docs',
        tooltip: 'Generate interactive API documentation. Helps developers understand and test your API. Essential for public/team APIs.',
        configOptions: [
          {
            id: 'docsType',
            label: 'Documentation Format',
            type: 'select',
            tooltip: 'How to document your API.',
            options: [
              {
                value: 'openapi',
                label: 'OpenAPI/Swagger',
                tooltip: 'Industry standard REST API docs. Best for: Public APIs, client generation, interactive testing. Swagger UI included.',
                recommended: true
              },
              {
                value: 'scalar',
                label: 'Scalar',
                tooltip: 'Modern OpenAPI UI. Best for: Beautiful docs, better than Swagger UI, same OpenAPI spec. Great UX.'
              },
              {
                value: 'readme',
                label: 'README.md',
                tooltip: 'Simple markdown docs. Best for: Internal APIs, small teams, minimal overhead. Manual but flexible.'
              },
              {
                value: 'none',
                label: 'No Documentation',
                tooltip: 'Skip docs generation. Best for: Internal prototypes only. Not recommended for team/production APIs.'
              },
            ],
            defaultValue: 'openapi',
          },
        ],
      },
      {
        id: 'middleware',
        name: 'Middleware & Utilities',
        description: 'Cross-cutting concerns',
        tooltip: 'Common middleware for production APIs: CORS, rate limiting, compression, logging, etc.',
        configOptions: [
          {
            id: 'includeCors',
            label: 'CORS Support',
            type: 'toggle',
            tooltip: 'Allow cross-origin requests (frontend calling API from different domain). Essential for browser-based apps.',
            defaultValue: true,
          },
          {
            id: 'includeRateLimit',
            label: 'Rate Limiting',
            type: 'toggle',
            tooltip: 'Prevent API abuse by limiting requests per IP/user. Examples: 100 requests/minute. Essential for production.',
            defaultValue: true,
          },
          {
            id: 'includeCompression',
            label: 'Response Compression',
            type: 'toggle',
            tooltip: 'Compress API responses (gzip/brotli) to reduce bandwidth. Improves performance, especially for large responses.',
            defaultValue: true,
          },
          {
            id: 'includeHelmet',
            label: 'Security Headers',
            type: 'toggle',
            tooltip: 'Add security headers (CSP, X-Frame-Options, etc.). Protects against common attacks. Recommended for production.',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'logging',
        name: 'Logging & Monitoring',
        description: 'Track API usage and errors',
        tooltip: 'Monitor API health, debug issues, track usage. Essential for production APIs.',
        configOptions: [
          {
            id: 'loggingLib',
            label: 'Logging Library',
            type: 'select',
            tooltip: 'How to log API requests and errors.',
            options: [
              {
                value: 'pino',
                label: 'Pino',
                tooltip: 'Fast structured logging. Best for: Production APIs, high traffic, JSON logs. Integrates with Datadog, Logtail. Recommended!',
                recommended: true
              },
              {
                value: 'winston',
                label: 'Winston',
                tooltip: 'Feature-rich logging. Best for: Multiple outputs (file + console + cloud), custom formatting, log levels.'
              },
              {
                value: 'console',
                label: 'Console (Simple)',
                tooltip: 'Basic console.log. Best for: Development, small APIs. Not recommended for production.'
              },
            ],
            defaultValue: 'pino',
          },
          {
            id: 'includeErrorTracking',
            label: 'Error Tracking',
            type: 'toggle',
            tooltip: 'Automatic error reporting to Sentry. Get alerts when API errors occur. Essential for production monitoring.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'testing',
        name: 'Testing Setup',
        description: 'Test your API endpoints',
        tooltip: 'Write tests for routes, middleware, and database logic. Prevents regressions, documents expected behavior.',
        configOptions: [
          {
            id: 'testFramework',
            label: 'Test Framework',
            type: 'select',
            tooltip: 'Choose a test runner for API testing.',
            options: [
              {
                value: 'vitest',
                label: 'Vitest',
                tooltip: 'Fast, modern test runner. Best for: TypeScript, fast feedback, ESM support. Great Hono integration. Recommended!',
                recommended: true
              },
              {
                value: 'jest',
                label: 'Jest',
                tooltip: 'Popular test framework. Best for: Familiar to most devs, mature ecosystem, extensive mocking.'
              },
              {
                value: 'bun-test',
                label: 'Bun Test (Native)',
                tooltip: 'Built into Bun. Best for: Bun runtime only, fastest execution, no extra dependencies. Bun-specific.'
              },
              {
                value: 'none',
                label: 'No Testing',
                tooltip: 'Skip testing setup. Best for: Quick prototypes. Not recommended for production APIs.'
              },
            ],
            defaultValue: 'vitest',
          },
        ],
      },
      {
        id: 'deployment',
        name: 'Deployment Target',
        description: 'Where to host your API',
        tooltip: 'Choose hosting that matches your runtime. Serverless for auto-scaling, containers for control.',
        configOptions: [
          {
            id: 'deployTarget',
            label: 'Hosting Platform',
            type: 'select',
            tooltip: 'Where will your API run in production?',
            options: [
              {
                value: 'cloudflare-workers',
                label: 'Cloudflare Workers',
                tooltip: 'Edge serverless, global deployment. Best for: Low-latency, auto-scaling, $5/month. Pairs perfectly with Hono. Blazing fast!',
                recommended: true
              },
              {
                value: 'railway',
                label: 'Railway',
                tooltip: 'Easy deployment with databases. Best for: Full-stack apps, $5/month, automatic HTTPS. Great for APIs with PostgreSQL.'
              },
              {
                value: 'vercel',
                label: 'Vercel',
                tooltip: 'Serverless functions. Best for: Next.js integration, quick deploy, free tier. Good for moderate traffic.'
              },
              {
                value: 'fly-io',
                label: 'Fly.io',
                tooltip: 'Global edge deployment. Best for: Low-latency, websockets, persistent connections. Deploy worldwide.'
              },
              {
                value: 'docker',
                label: 'Docker Container',
                tooltip: 'Self-hosted or any cloud. Best for: Full control, Kubernetes, on-premise. Most flexible.'
              },
              {
                value: 'aws-lambda',
                label: 'AWS Lambda',
                tooltip: 'AWS serverless. Best for: Enterprise AWS environments, auto-scaling, pay-per-request. More complex setup.'
              },
            ],
            defaultValue: 'cloudflare-workers',
          },
        ],
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'Linting, formatting, and type checking',
        tooltip: 'Ensure code quality with automated tools. Catches bugs early, maintains consistent style. Essential for team development.',
        recommended: true,
        hidden: true, // Auto-included
      },
      {
        id: 'env-config',
        name: 'Environment Configuration',
        description: 'Manage secrets and config',
        tooltip: 'Environment variables for API keys, database URLs, secrets. Never commit secrets to Git. Uses .env with .env.example template.',
        recommended: true,
        hidden: true, // Auto-included
      },
    ],
  },
  {
    id: 'expo-mobile',
    name: 'Mobile App (Expo)',
    description: 'Cross-platform iOS/Android app with React Native',
    tooltip: 'Build native mobile apps for iOS and Android from one codebase. Easier than React Native CLI, includes web support. Perfect for: social apps, e-commerce, productivity tools, utilities, games. Examples: Coinbase, Microsoft, Siemens use Expo. No Mac needed for iOS builds (EAS Build)!',
    icon: null, // Will be set in component
    gradient: 'linear-gradient(90deg, #4630EB 0%, #7C65FF 25%, #ffffff 50%, #7C65FF 75%, #4630EB 100%)',
    command: 'npx create-expo-app@latest',
    commandFlags: {
      template: (value) => `--template ${value}`,
    },
    features: [
      {
        id: 'template-type',
        name: 'Starting Template',
        description: 'Base template to start from',
        tooltip: 'Expo provides templates with different starting points. Choose based on your app complexity.',
        recommended: true,
        configOptions: [
          {
            id: 'templateChoice',
            label: 'Template',
            type: 'select',
            tooltip: 'Which Expo template to use.',
            options: [
              {
                value: 'blank-typescript',
                label: 'Blank (TypeScript)',
                tooltip: 'Minimal app with TypeScript. Best for: Most apps, custom setup, TypeScript recommended. Clean starting point.',
                recommended: true
              },
              {
                value: 'tabs',
                label: 'Tabs (TypeScript)',
                tooltip: 'Pre-configured tab navigation. Best for: Apps with bottom tabs (like Instagram, Twitter). Saves setup time.'
              },
              {
                value: 'blank',
                label: 'Blank (JavaScript)',
                tooltip: 'Minimal app with JavaScript. Best for: Quick prototypes, no TypeScript needed. Not recommended for production.'
              },
            ],
            defaultValue: 'blank-typescript',
          },
        ],
      },
      {
        id: 'navigation',
        name: 'Navigation',
        description: 'How users move between screens',
        tooltip: 'Navigation is essential for multi-screen apps. Expo Router is modern (file-based like Next.js), React Navigation is traditional.',
        recommended: true,
        configOptions: [
          {
            id: 'navType',
            label: 'Navigation Library',
            type: 'select',
            tooltip: 'Which navigation system to use.',
            options: [
              {
                value: 'expo-router',
                label: 'Expo Router (File-Based)',
                tooltip: 'Next.js-style file-based routing. Best for: Modern apps, deep linking, web support. Routes defined by file structure. Recommended!',
                recommended: true
              },
              {
                value: 'react-navigation',
                label: 'React Navigation',
                tooltip: 'Traditional navigation library. Best for: Custom navigation, complex flows, existing RN apps. More flexible but manual setup.'
              },
              {
                value: 'none',
                label: 'No Navigation',
                tooltip: 'Single screen app. Best for: Simple utilities, demos, learning. Add navigation later if needed.'
              },
            ],
            defaultValue: 'expo-router',
          },
          {
            id: 'navPatterns',
            label: 'Navigation Patterns',
            type: 'select',
            tooltip: 'Common navigation UI patterns to include.',
            options: [
              {
                value: 'tabs-stack',
                label: 'Tabs + Stack',
                tooltip: 'Bottom tabs with stacks. Best for: Most apps (Instagram, Twitter style). Each tab has its own stack of screens.',
                recommended: true
              },
              {
                value: 'drawer',
                label: 'Drawer (Sidebar)',
                tooltip: 'Slide-out sidebar menu. Best for: Content-heavy apps, many sections. Common in news/productivity apps.'
              },
              {
                value: 'stack-only',
                label: 'Stack Only',
                tooltip: 'Simple push/pop navigation. Best for: Linear flows, wizards, onboarding. Simpler than tabs.'
              },
            ],
            defaultValue: 'tabs-stack',
          },
        ],
      },
      {
        id: 'ui-styling',
        name: 'UI & Styling',
        description: 'How to style your app',
        tooltip: 'Choose a styling approach. NativeWind (Tailwind for mobile) is modern and familiar to web devs.',
        configOptions: [
          {
            id: 'stylingLib',
            label: 'Styling Library',
            type: 'select',
            tooltip: 'How to style components.',
            options: [
              {
                value: 'nativewind',
                label: 'NativeWind (Tailwind)',
                tooltip: 'Tailwind CSS for React Native. Best for: Web developers, rapid styling, utility-first. Familiar API. Recommended!',
                recommended: true
              },
              {
                value: 'rn-paper',
                label: 'React Native Paper',
                tooltip: 'Material Design components. Best for: Material design apps, pre-built components, Android-first apps.'
              },
              {
                value: 'tamagui',
                label: 'Tamagui',
                tooltip: 'Universal UI kit (web + native). Best for: Cross-platform design systems, performance-critical apps. Advanced.'
              },
              {
                value: 'stylesheet',
                label: 'StyleSheet (Native)',
                tooltip: 'React Native\'s built-in styling. Best for: Learning RN, no dependencies, full control. Manual but flexible.'
              },
            ],
            defaultValue: 'nativewind',
          },
        ],
      },
      {
        id: 'authentication',
        name: 'Authentication',
        description: 'User login and signup',
        tooltip: 'Let users create accounts and sign in. Essential for most apps with user-specific data.',
        configOptions: [
          {
            id: 'authProvider',
            label: 'Auth Provider',
            type: 'select',
            tooltip: 'Which authentication service to use.',
            options: [
              {
                value: 'supabase',
                label: 'Supabase',
                tooltip: 'Open-source Firebase alternative. Best for: Full backend (auth + database + storage), generous free tier. Includes RLS security.',
                recommended: true
              },
              {
                value: 'clerk',
                label: 'Clerk',
                tooltip: 'Modern auth platform. Best for: Beautiful UI components, passwordless auth, webhooks. Great DX, paid service.'
              },
              {
                value: 'firebase',
                label: 'Firebase Auth',
                tooltip: 'Google\'s auth service. Best for: Google ecosystem, social logins, phone auth. Mature, free tier available.'
              },
              {
                value: 'expo-auth-session',
                label: 'Expo Auth Session',
                tooltip: 'OAuth helper for custom providers. Best for: Custom backend, OAuth flows, SSO. More manual setup.'
              },
              {
                value: 'none',
                label: 'No Authentication',
                tooltip: 'No user accounts. Best for: Utilities, demos, public apps. Add later if needed.'
              },
            ],
            defaultValue: 'supabase',
          },
        ],
        autoBundles: ['env-config'],
      },
      {
        id: 'state-management',
        name: 'State Management',
        description: 'Manage app-wide state',
        tooltip: 'Share data between screens (user info, cart, preferences). Zustand is simplest, Redux is most powerful.',
        configOptions: [
          {
            id: 'stateLib',
            label: 'State Library',
            type: 'select',
            tooltip: 'How to manage global app state.',
            options: [
              {
                value: 'zustand',
                label: 'Zustand',
                tooltip: 'Simple hooks-based state. Best for: Most apps, easy to learn, minimal boilerplate. Recommended for Expo!',
                recommended: true
              },
              {
                value: 'redux',
                label: 'Redux Toolkit',
                tooltip: 'Powerful state management. Best for: Complex apps, time-travel debugging, large teams. More boilerplate.'
              },
              {
                value: 'jotai',
                label: 'Jotai',
                tooltip: 'Atomic state management. Best for: Fine-grained updates, React Suspense integration. Modern approach.'
              },
              {
                value: 'context',
                label: 'React Context',
                tooltip: 'Built-in React state. Best for: Simple apps, learning, no extra dependencies. Can cause re-renders.'
              },
            ],
            defaultValue: 'zustand',
          },
        ],
      },
      {
        id: 'data-storage',
        name: 'Data Storage',
        description: 'Store data locally on device',
        tooltip: 'Save data offline. AsyncStorage for simple data, SQLite for complex queries, Realm for offline-first.',
        configOptions: [
          {
            id: 'storageType',
            label: 'Storage Type',
            type: 'select',
            tooltip: 'How to store data on device.',
            options: [
              {
                value: 'async-storage',
                label: 'AsyncStorage',
                tooltip: 'Simple key-value storage. Best for: Settings, preferences, small data. Easy to use, 6MB limit. Recommended for most apps.',
                recommended: true
              },
              {
                value: 'sqlite',
                label: 'SQLite (expo-sqlite)',
                tooltip: 'SQL database on device. Best for: Large datasets, complex queries, offline-first apps. More powerful than AsyncStorage.'
              },
              {
                value: 'watermelondb',
                label: 'WatermelonDB',
                tooltip: 'Offline-first database. Best for: Sync with backend, reactive queries, large datasets. Advanced use case.'
              },
              {
                value: 'secure-store',
                label: 'SecureStore (Credentials)',
                tooltip: 'Encrypted storage for secrets. Best for: API keys, tokens, passwords. Uses Keychain (iOS) / Keystore (Android).'
              },
            ],
            defaultValue: 'async-storage',
          },
        ],
      },
      {
        id: 'native-features',
        name: 'Native Features',
        description: 'Device capabilities',
        tooltip: 'Access native device features. Expo provides easy-to-use modules for camera, location, notifications, etc.',
        configOptions: [
          {
            id: 'includeCamera',
            label: 'Camera & Media',
            type: 'toggle',
            tooltip: 'Take photos, record video, pick from library. Examples: profile pictures, photo sharing, QR scanner.',
            defaultValue: false,
          },
          {
            id: 'includeLocation',
            label: 'Location Services',
            type: 'toggle',
            tooltip: 'Get GPS location, geofencing, maps. Examples: delivery apps, social check-ins, location-based features.',
            defaultValue: false,
          },
          {
            id: 'includePushNotifications',
            label: 'Push Notifications',
            type: 'toggle',
            tooltip: 'Send notifications to users. Examples: chat messages, reminders, alerts. Requires Expo push service or Firebase.',
            defaultValue: false,
          },
          {
            id: 'includeBiometrics',
            label: 'Biometric Auth',
            type: 'toggle',
            tooltip: 'Face ID / Touch ID / Fingerprint. Examples: secure login, payment confirmation. iOS/Android native auth.',
            defaultValue: false,
          },
          {
            id: 'includeInAppPurchases',
            label: 'In-App Purchases',
            type: 'toggle',
            tooltip: 'Sell subscriptions, consumables, premium features. Examples: subscriptions, coins, pro upgrades. App Store integration.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'backend-integration',
        name: 'Backend & API',
        description: 'Connect to backend services',
        tooltip: 'Most apps need a backend for data, auth, storage. Choose based on features needed.',
        configOptions: [
          {
            id: 'backendType',
            label: 'Backend Service',
            type: 'select',
            tooltip: 'Which backend to use.',
            options: [
              {
                value: 'supabase',
                label: 'Supabase',
                tooltip: 'PostgreSQL database + auth + storage + realtime. Best for: Full-stack apps, SQL, open-source. Generous free tier.',
                recommended: true
              },
              {
                value: 'firebase',
                label: 'Firebase',
                tooltip: 'Google BaaS (database, auth, storage, functions). Best for: Google ecosystem, NoSQL, real-time. Free tier available.'
              },
              {
                value: 'custom-api',
                label: 'Custom API (REST)',
                tooltip: 'Your own backend API. Best for: Existing backend, custom logic, full control. Use fetch/axios.'
              },
              {
                value: 'graphql',
                label: 'GraphQL (Apollo)',
                tooltip: 'GraphQL API with Apollo Client. Best for: GraphQL backends, efficient queries, type safety.'
              },
              {
                value: 'none',
                label: 'No Backend',
                tooltip: 'Local-only app. Best for: Utilities, games, calculators. No server needed.'
              },
            ],
            defaultValue: 'supabase',
          },
        ],
      },
      {
        id: 'analytics',
        name: 'Analytics & Monitoring',
        description: 'Track usage and errors',
        tooltip: 'Understand how users use your app, catch crashes. Essential for production apps.',
        configOptions: [
          {
            id: 'analyticsProvider',
            label: 'Analytics',
            type: 'select',
            tooltip: 'Track user behavior and app usage.',
            options: [
              {
                value: 'expo-analytics',
                label: 'Expo Analytics',
                tooltip: 'Built-in Expo analytics. Best for: Simple tracking, Expo integration. Basic but easy.',
                recommended: true
              },
              {
                value: 'posthog',
                label: 'PostHog',
                tooltip: 'Product analytics. Best for: Feature flags, session replay, funnels. Open-source, free tier.'
              },
              {
                value: 'mixpanel',
                label: 'Mixpanel',
                tooltip: 'Advanced product analytics. Best for: Detailed user tracking, retention, cohorts. Paid service.'
              },
              {
                value: 'none',
                label: 'No Analytics',
                tooltip: 'Skip analytics. Best for: Internal apps, prototypes. Add later if needed.'
              },
            ],
            defaultValue: 'expo-analytics',
          },
          {
            id: 'includeErrorTracking',
            label: 'Error Tracking (Sentry)',
            type: 'toggle',
            tooltip: 'Automatic crash reporting and error alerts. See stack traces, user context. Essential for production apps.',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'testing',
        name: 'Testing',
        description: 'Test your mobile app',
        tooltip: 'Write tests to prevent bugs. Unit tests for logic, component tests for UI, E2E for full flows.',
        configOptions: [
          {
            id: 'testFramework',
            label: 'Test Framework',
            type: 'select',
            tooltip: 'Choose test tools for your app.',
            options: [
              {
                value: 'jest-testing-library',
                label: 'Jest + Testing Library',
                tooltip: 'Unit and component tests. Best for: Logic testing, component behavior. Standard for React Native. Recommended!',
                recommended: true
              },
              {
                value: 'detox',
                label: 'Detox (E2E)',
                tooltip: 'End-to-end testing on simulators. Best for: Testing full user flows, critical paths. Slower but thorough.'
              },
              {
                value: 'maestro',
                label: 'Maestro (E2E)',
                tooltip: 'Simple E2E testing. Best for: Easy setup, fast tests, readable syntax. Modern Detox alternative.'
              },
              {
                value: 'none',
                label: 'No Testing',
                tooltip: 'Skip testing setup. Best for: Quick prototypes. Not recommended for production apps.'
              },
            ],
            defaultValue: 'jest-testing-library',
          },
        ],
      },
      {
        id: 'deployment',
        name: 'Build & Deployment',
        description: 'Deploy to app stores',
        tooltip: 'Build your app for iOS and Android. EAS Build lets you build iOS without a Mac! OTA updates let you push updates instantly.',
        recommended: true,
        configOptions: [
          {
            id: 'useasBuild',
            label: 'Use EAS Build',
            type: 'toggle',
            tooltip: 'Cloud builds (build iOS on Windows/Linux!). Best for: No Mac, team builds, CI/CD. Highly recommended! Free tier: 30 builds/month.',
            defaultValue: true,
          },
          {
            id: 'useEasUpdates',
            label: 'EAS Updates (OTA)',
            type: 'toggle',
            tooltip: 'Push JavaScript updates without app store review. Examples: bug fixes, content updates. Updates download on app start.',
            defaultValue: true,
          },
          {
            id: 'includeAppConfig',
            label: 'App Store Config',
            type: 'toggle',
            tooltip: 'Generate app.json with store metadata (name, icons, splash, version). Required for store submission.',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'Linting, formatting, and type checking',
        tooltip: 'Ensure code quality with automated tools. Catches bugs early, maintains consistent style.',
        recommended: true,
        hidden: true, // Auto-included
      },
      {
        id: 'env-config',
        name: 'Environment Configuration',
        description: 'Manage API keys and secrets',
        tooltip: 'Store API keys, backend URLs, secrets safely. Never commit secrets to Git. Uses .env with .env.example.',
        recommended: true,
        hidden: true, // Auto-included
      },
    ],
  },
];

/**
 * Generate prompt for LLM based on wizard selections
 */
export function generateBuildPrompt(
  template: ProjectTemplate,
  projectName: string,
  selectedFeatures: Set<string>,
  configurations: Record<string, string | boolean | number>
): string {
  // AUTO-BUNDLING LOGIC: Expand selected features with auto-bundled dependencies
  const expandedFeatures = new Set(selectedFeatures);

  selectedFeatures.forEach(fId => {
    const feature = template.features.find(f => f.id === fId);
    if (feature?.autoBundles) {
      feature.autoBundles.forEach(bundledId => {
        expandedFeatures.add(bundledId);
      });
    }
  });

  // Always include hidden features that should be in every project
  template.features.forEach(f => {
    if (f.hidden && !f.autoBundles) {
      expandedFeatures.add(f.id);
    }
  });

  const featuresList = Array.from(expandedFeatures)
    .map(fId => {
      const feature = template.features.find(f => f.id === fId);
      if (!feature || feature.hidden) return null; // Don't list hidden features

      const configs = feature.configOptions
        ?.map(opt => {
          const value = configurations[opt.id];
          if (value) {
            return `  - ${opt.label}: ${typeof value === 'string' ? value : (value ? 'Yes' : 'No')}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');

      return `- ${feature.name}${configs ? '\n' + configs : ''}`;
    })
    .filter(Boolean)
    .join('\n');

  // Build the scaffolding command
  let command = `${template.command} ${projectName}`;
  if (template.commandFlags) {
    Object.entries(template.commandFlags).forEach(([flag, buildFlag]) => {
      const value = configurations[flag];
      if (value !== undefined && value !== false) {
        command += ` ${buildFlag(value as string | boolean | number)}`;
      }
    });
  }

  // Build research tasks for parallel agent spawning (use expandedFeatures to include auto-bundled deps)
  const researchTasks = Array.from(expandedFeatures).map(fId => {
    const feature = template.features.find(f => f.id === fId);
    if (!feature || feature.hidden) return null; // Skip hidden features from research

    // Map features to research queries based on feature ID
    const getResearchQuery = (featureId: string): string => {
      // Common features shared across templates
      const commonMap: Record<string, string> = {
        'auth': `Latest ${configurations['authProvider'] || 'NextAuth.js'} setup with ${template.name}`,
        'styling': `Current ${configurations['uiLibrary'] || 'shadcn/ui'} installation for ${template.name}`,
        'api': `Latest ${configurations['apiType'] || 'tRPC'} setup with ${template.name}`,
        'code-quality': 'Latest ESLint flat config + Prettier + Husky v9 setup',
        'env-validation': 'Current @t3-oss/env-nextjs or Zod env validation pattern',
        'framework': `Latest ${configurations['uiFramework'] || 'React'} setup with WXT`,
        'routing': 'Current React Router v6 setup patterns',
        'state': `Latest ${configurations['stateLibrary'] || 'Zustand'} integration patterns`,
        'ai-integration': `Latest ${configurations['aiProvider'] || 'Vercel AI SDK'} setup with ${template.name} and best practices`,
        'payments': `Latest ${configurations['paymentProvider'] || 'Stripe'} integration with ${template.name} (webhooks, subscriptions, checkout)`,
        'email': `Latest ${configurations['emailProvider'] || 'Resend'} setup with ${template.name} and React Email templates`,
        'file-storage': `Latest ${configurations['storageProvider'] || 'UploadThing'} integration with ${template.name}`,
        'error-tracking': `Latest Sentry integration for ${template.name}`,
        'ui-library': `Latest ${configurations['componentLib'] || 'shadcn/ui'} installation for ${template.name}`,
      };

      // Template-specific features
      const specificMap: Record<string, string> = {
        // Database varies by template
        'database': template.id === 'discord-bot'
          ? (configurations['dbType'] !== 'none' ? `Current ${configurations['dbType'] || 'SQLite'} integration patterns for Discord bots with connection pooling` : '')
          : template.id === 'slack-bot'
          ? (configurations['dbType'] !== 'none' ? `Current ${configurations['dbType'] || 'SQLite'} integration patterns for Slack bots` : '')
          : template.id === 'tauri-desktop'
          ? (configurations['dbType'] !== 'none' ? `Current ${configurations['dbType'] || 'SQLite'} integration patterns for Tauri with rusqlite` : '')
          : template.id === 'backend-api'
          ? (configurations['dbType'] !== 'none' ? `Current ${configurations['dbType'] || 'PostgreSQL'} integration with ${configurations['orm'] || 'Drizzle'} ORM for Hono` : '')
          : `Latest ${configurations['orm'] || 'Prisma'} + ${configurations['dbType'] || 'PostgreSQL'} setup`,

        // Testing varies by template
        'testing': template.id === 'mcp-server'
          ? (configurations['testFramework'] !== 'none' ? `Current ${configurations['testFramework'] || 'Vitest'} setup for testing MCP server tools and resources` : '')
          : template.id === 'tauri-desktop'
          ? (configurations['testFramework'] !== 'none' ? `Current ${configurations['testFramework'] || 'Vitest'} setup for testing Tauri apps` : '')
          : template.id === 'backend-api'
          ? (configurations['testFramework'] !== 'none' ? `Current ${configurations['testFramework'] || 'Vitest'} setup for testing Hono APIs` : '')
          : template.id === 'expo-mobile'
          ? (configurations['testFramework'] !== 'none' ? `Latest ${configurations['testFramework'] === 'jest-testing-library' ? 'Jest + React Native Testing Library' : configurations['testFramework'] === 'detox' ? 'Detox E2E testing' : 'Maestro UI testing'} setup for Expo` : '')
          : `Current ${configurations['testingTools'] || 'Vitest + Playwright'} configuration`,

        // Deployment varies by template
        'deployment': template.id === 'mcp-server'
          ? (configurations['deployTarget'] !== 'local' ? `Latest ${configurations['deployTarget'] || 'Cloudflare Workers'} deployment setup for MCP HTTP servers` : '')
          : template.id === 'discord-bot'
          ? (configurations['deployTarget'] !== 'local' ? `Latest ${configurations['deployTarget'] || 'Railway'} deployment setup for Discord bots with process management` : '')
          : template.id === 'slack-bot'
          ? (configurations['deployTarget'] !== 'local' ? `Latest ${configurations['deployTarget'] || 'Railway'} deployment setup for Slack bots` : '')
          : template.id === 'backend-api'
          ? `Latest ${configurations['deployTarget'] || 'Cloudflare Workers'} deployment config for Hono APIs`
          : template.id === 'expo-mobile'
          ? `Current EAS Build and EAS Update setup with ${configurations['platforms'] || 'both'} platform configuration, app.json config, and ${configurations['easUpdates'] ? 'OTA updates' : 'manual updates'}`
          : `Latest ${configurations['deployTarget'] || 'Vercel'} deployment config`,

        // MCP Server
        'transport': `Latest MCP ${configurations['transportType'] || 'STDIO'} transport implementation patterns and best practices`,
        'capabilities': 'Current MCP SDK patterns for registering tools, resources, and prompts with proper schemas',
        'tool-examples': `Best practices for implementing ${configurations['toolType'] || 'API'} tools in MCP servers with error handling`,
        'authentication': template.id === 'mcp-server'
          ? (configurations['authMethod'] !== 'none' ? `Latest ${configurations['authMethod'] === 'api-key' ? 'API Key' : 'OAuth 2.0'} authentication for MCP HTTP servers` : '')
          : template.id === 'slack-bot'
          ? `Latest ${configurations['distributionType'] || 'single-workspace'} Slack OAuth patterns and workspace token storage`
          : template.id === 'backend-api'
          ? `Latest ${configurations['authType'] || 'JWT'} authentication patterns for Hono APIs`
          : '',
        'validation': template.id === 'mcp-server'
          ? (configurations['validationLib'] === 'zod' ? 'Current Zod schema patterns for MCP tool input validation and auto-schema generation' : '')
          : template.id === 'backend-api'
          ? `Latest ${configurations['validationLib'] || 'Zod'} validation patterns for Hono with @hono/zod-validator`
          : '',
        'error-handling': `Latest ${configurations['loggingLib'] || 'console'} logging and error handling patterns for MCP servers`,
        'documentation': configurations['docGen'] !== 'none' ? `Best practices for documenting MCP servers with ${configurations['docGen'] === 'typedoc' ? 'TypeDoc' : 'README.md'}` : '',

        // Discord Bot
        'slash-commands': template.id === 'discord-bot'
          ? `Latest Discord.js v14 slash command patterns with ${configurations['commandHandler'] || 'category folders'} organization`
          : template.id === 'slack-bot'
          ? `Latest Slack Bolt slash command patterns with proper acknowledgment and response flow`
          : '',
        'interactions': 'Current Discord.js button, select menu, and modal implementation patterns with proper interaction handlers',
        'events': template.id === 'discord-bot'
          ? `Best practices for Discord.js v14 ${configurations['eventTypes'] || 'essential'} event handlers and event organization`
          : template.id === 'slack-bot'
          ? `Current Slack Bolt event subscription patterns for ${configurations['eventTypes'] || 'essential'} events`
          : '',
        'permissions': `Latest ${configurations['permissionType'] || 'Discord native'} permission checking patterns for Discord bots`,
        'logging': template.id === 'discord-bot'
          ? `Latest ${configurations['logLevel'] || 'console'} logging setup for Discord bots with error tracking`
          : template.id === 'slack-bot'
          ? `Latest ${configurations['logLevel'] || 'console'} logging setup for Slack bots with error tracking`
          : template.id === 'backend-api'
          ? `Latest ${configurations['loggingLib'] || 'Pino'} logging setup for Hono APIs`
          : '',
        'features': 'Best practices for implementing Discord bot features (economy/leveling/moderation/music) with latest libraries',

        // Slack Bot
        'shortcuts': 'Latest Slack Bolt patterns for message shortcuts and global shortcuts with proper handler registration',
        'block-kit': 'Current Slack Block Kit patterns for buttons, select menus, and modals with Block Kit Builder examples',
        'app-home': 'Best practices for Slack App Home tab and Messages tab implementation with Block Kit UI',
        'workflows': 'Latest Slack Workflow Step patterns for custom workflow builder integration',

        // Tauri Desktop
        'frontend-framework': `Latest Tauri 2.0 setup with ${configurations['framework'] || 'React'} and ${configurations['typescript'] ? 'TypeScript' : 'JavaScript'}`,
        'tauri-features': 'Current Tauri plugin patterns for system tray, notifications, file system, and native dialogs',
        'window-config': `Best practices for ${configurations['windowType'] || 'standard'} window configuration and multi-window management in Tauri`,
        'updater': 'Latest Tauri updater plugin setup with update manifest hosting and silent installation',
        'ipc-patterns': `Current Tauri IPC patterns with ${configurations['ipcPattern'] || 'module-based'} organization and frontend-backend communication`,
        'security': `Latest Tauri ${configurations['securityLevel'] || 'recommended'} security configuration with CSP and permission system`,
        'packaging': `Current Tauri build configuration for ${configurations['platforms'] || 'all platforms'} with native installers`,
        'developer-tools': `Latest Tauri development setup with ${configurations['loggingLib'] || 'env_logger'} logging and hot reload`,
        'mobile-support': 'Current Tauri 2.0 mobile support patterns for iOS and Android (beta)',

        // Backend API (Hono)
        'runtime': `Latest Hono setup for ${configurations['runtime'] || 'Bun'} runtime with optimal configuration`,
        'routing': `Current Hono ${configurations['routingPattern'] || 'modular'} routing patterns and best practices for API organization`,
        'api-docs': configurations['docsType'] !== 'none' ? `Latest ${configurations['docsType'] === 'openapi' ? 'OpenAPI/Swagger' : configurations['docsType'] === 'scalar' ? 'Scalar' : 'README.md'} documentation setup for Hono APIs` : '',
        'middleware': 'Current Hono middleware patterns for CORS, rate limiting, compression, and security headers',

        // Expo Mobile
        'template-type': `Latest Expo ${configurations['templateType'] || 'blank-typescript'} template setup with best practices for ${configurations['templateType'] === 'tabs' ? 'tab navigation' : configurations['templateType'] === 'blank' ? 'minimal JavaScript' : 'TypeScript'}`,
        'navigation': configurations['navigation'] !== 'none' ? `Current ${configurations['navigation'] === 'expo-router' ? 'Expo Router (file-based)' : 'React Navigation'} setup patterns for ${configurations['navPattern'] || 'tabs-stack'} navigation` : '',
        'ui-styling': `Latest ${configurations['uiLibrary'] || 'NativeWind'} setup for Expo with ${configurations['uiLibrary'] === 'nativewind' ? 'Tailwind CSS' : configurations['uiLibrary'] === 'paper' ? 'Material Design' : configurations['uiLibrary'] === 'tamagui' ? 'performance-optimized' : 'StyleSheet'} styling`,
        'state-management': `Current ${configurations['stateLibrary'] || 'Zustand'} integration patterns for React Native and Expo`,
        'storage': `Latest ${configurations['storageType'] || 'AsyncStorage'} setup for Expo with ${configurations['storageType'] === 'sqlite' ? 'expo-sqlite' : configurations['storageType'] === 'watermelon' ? 'WatermelonDB sync' : configurations['storageType'] === 'secure' ? 'SecureStore encryption' : 'AsyncStorage'} implementation`,
        'native-features': `Best practices for implementing ${configurations['camera'] ? 'expo-camera' : ''}${configurations['location'] ? ', expo-location' : ''}${configurations['notifications'] ? ', expo-notifications' : ''}${configurations['biometrics'] ? ', expo-local-authentication' : ''}${configurations['iap'] ? ', expo-in-app-purchases' : ''} with proper permissions`,
        'backend-integration': configurations['backendType'] !== 'none' ? `Latest ${configurations['backendType'] || 'Supabase'} integration for Expo with ${configurations['backendType'] === 'graphql' ? 'Apollo Client' : 'REST API'} patterns` : '',
        'analytics': template.id === 'expo-mobile'
          ? (configurations['analyticsProvider'] !== 'none' ? `Current ${configurations['analyticsProvider'] || 'Expo Analytics'} setup for Expo with ${configurations['errorTracking'] ? 'Sentry error tracking' : 'basic event tracking'}` : '')
          : `Latest ${configurations['analyticsProvider'] || 'PostHog'} setup for ${template.name}`,
      };

      return specificMap[featureId] || commonMap[featureId] || '';
    };

    return getResearchQuery(fId);
  }).filter(Boolean);

  return `I want to create a ${template.name} project with the following specifications:

PROJECT NAME: ${projectName}

SELECTED FEATURES:
${featuresList || '(None selected)'}

IMPORTANT: Follow these steps in order:

STEP 1: RESEARCH PHASE (Spawn Parallel build-researcher Agents)
Before building anything, spawn multiple 'build-researcher' agents in parallel to verify the latest setup instructions. These agents are optimized for fast, focused technical research - they only read official docs and return exact commands and configs.

Spawn these build-researcher agents in parallel using the Task tool with subagent_type='build-researcher':

${researchTasks.map((task, i) => `build-researcher Agent ${i + 1}: "${task}" - Get exact setup commands, current stable version, and any breaking changes.`).join('\n')}

build-researcher Agent ${researchTasks.length + 1}: "latest ${template.command} CLI flags and options" - Verify exact command syntax from official docs.

build-researcher Agent ${researchTasks.length + 2}: "professional folder structure for ${template.name} production projects" - Get industry-standard project organization patterns.

CRITICAL: Wait for ALL build-researcher agents to complete before proceeding. Use ONLY the information they provide - do not rely on outdated knowledge.

STEP 2: PROJECT STRUCTURE PLANNING
Based on the research findings, design a professional, scalable folder structure that follows these principles:
- Clear separation of concerns (features, components, utils, config)
- Logical grouping (group by feature, not by type)
- Easy to navigate and maintain
- Follows ${template.name} conventions and best practices
- Ready for production scaling

Create a detailed structure plan showing where each file type belongs (components, hooks, utils, types, tests, config, etc.).

STEP 3: INITIALIZE PROJECT
Run the verified command from research:
\`\`\`bash
${command}
cd ${projectName}
\`\`\`

STEP 4: INSTALL AND CONFIGURE FEATURES
Using the research findings, set up each selected feature with the LATEST verified setup.

IMPORTANT: Some features have been AUTO-BUNDLED because they are required dependencies:
${Array.from(expandedFeatures).filter(fId => {
  const feature = template.features.find(f => f.id === fId);
  return feature && !selectedFeatures.has(fId) && !feature.hidden;
}).map(fId => {
  const feature = template.features.find(f => f.id === fId);
  return `- ${feature?.name} (auto-included for security/functionality)`;
}).filter(Boolean).join('\n') || '(None)'}

Features to implement:
${Array.from(expandedFeatures).map(fId => {
  const feature = template.features.find(f => f.id === fId);
  if (!feature || feature.hidden) return '';
  return `- ${feature.name}: ${feature.description}`;
}).filter(Boolean).join('\n')}

For each feature:
- Use the exact package versions and commands from research
- Follow the latest configuration patterns found
- Apply the professional folder structure from Step 2
- Place files in their proper locations (no random placement)

STEP 5: CONFIGURATION FILES (Spawn Parallel config-writer Agents)
Spawn config-writer agents in parallel to write modern configuration files. These agents are optimized for writing minimal, production-ready configs using the latest formats.

Spawn these config-writer agents in parallel using Task tool with subagent_type='config-writer':

config-writer Agent 1: "Write tsconfig.json with strict mode and modern compiler options, following project structure from Step 2"
config-writer Agent 2: "Write ESLint flat config (eslint.config.js) with latest format and essential rules only"
config-writer Agent 3: "Write .prettierrc with minimal project-appropriate rules"
config-writer Agent 4: "Write .env.example documenting all required environment variables based on selected features"

These agents will write files directly - no lengthy explanations, just correct modern configs in the right locations.

STEP 6: GIT & HOOKS SETUP
- Set up .gitignore with comprehensive ignores for ${template.name}
- Configure Husky git hooks if code-quality feature selected (use v9 syntax)
- Initialize git repository if not already initialized

STEP 7: VERIFICATION & ERROR FIXING
- Ensure all dependencies installed successfully
- Run type checking (tsc --noEmit)
- Run linting
- Verify dev server starts
- Check that folder structure matches the plan from Step 2

IMPORTANT: If ANY errors occur during setup, immediately spawn a quick-fixer agent:
- Use Task tool with subagent_type='quick-fixer'
- Provide the error message to the agent
- The agent will fix the issue and verify - no lengthy diagnosis needed

STEP 8: SUMMARY
Provide:
1. What was created (with actual version numbers used)
2. The final folder structure (tree view)
3. How to run the project (dev, build, test commands)
4. Next steps for development
5. Any important notes or gotchas discovered during research

CRITICAL: Use ONLY the information from the research agents - do not rely on outdated knowledge. If research finds breaking changes or deprecations, adapt accordingly.`;
}
