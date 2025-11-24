# Agent Guidelines for sv-to-effect-ex

## Build & Development Commands

ALWAYS USE BUN AS THE PACKAGE MANAGER 

- **Type check**: `bun run check` - Run svelte-check with TypeScript
- **Format code**: `bun run format` - Auto-format with Prettier
- **Lint**: `bun run lint` - Check formatting with Prettier (no modifications)

## Code Style Guidelines

**Formatting**: Tabs (not spaces), single quotes, print width 100, no trailing commas. Use `bun run format` before commits.

**TypeScript**: Strict mode enabled. Use explicit types, avoid `any`. Relative imports automatically rewritten to extensions by tsconfig.

**Imports**: Use ES modules only. Prefer `import` over `require`. Import order: external packages, then $lib aliases, then relative paths.

**Svelte Components**: Use `<script lang="ts">` for type safety. Async components enabled via `compilerOptions.experimental.async`. Follow Prettier's svelte plugin formatting.

**Naming Conventions**:

- Files: kebab-case (e.g., `+page.svelte`, `my-component.svelte`)
- Variables/functions: camelCase
- Components/classes: PascalCase
- Constants: UPPER_SNAKE_CASE

**Error Handling**: Use TypeScript strict null checks. Prefer explicit error types over generic Error. Use Effect library for error handling in async code.

**Dependencies**: Effect.js is available for functional programming patterns. Tailwind CSS v4 via @tailwindcss/vite plugin.

**Remote Functions**: Enabled via `experimental.remoteFunctions` in kit config for cross-environment functions.
