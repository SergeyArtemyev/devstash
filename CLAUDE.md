# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images and custom types

## Context Files

Read the following to get the full context of the project:
 - @context/project-overview.md
 - @context/coding-standards.md
 - @context/ai-interaction.md
 - @context/current-feature.md

## Commands

- `npm run dev` — start the dev server at http://localhost:3000 (hot reload)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint (flat config in `eslint.config.mjs`, extends `next/core-web-vitals` + `next/typescript`)

There is no test runner configured yet.

**IMPORTANT:** Do not add Claude to any commit messages

### Styling

Tailwind CSS v4 via the PostCSS plugin (`@tailwindcss/postcss`, configured in `postcss.config.mjs`). There is no `tailwind.config` file — v4 is configured through CSS. Any Tailwind theme customization (`@theme`) goes in `globals.css`.

### React Compiler

The React Compiler is enabled (`reactCompiler: true` in `next.config.ts`, `babel-plugin-react-compiler`). Avoid manual `useMemo`/`useCallback`/`memo` for optimization — the compiler handles memoization automatically.

## Neon MCP Usage

When using the Neon MCP for this project, ALWAYS target the DevStash project and its
**development** branch by default. Never touch production unless I explicitly say so.

- **Project:** `devstash` (`projectId: curly-block-55226637`)
- **Default branch:** `development` (`branchId: br-bitter-brook-at6obg54`)
- **Production branch:** `production` (`branchId: br-shy-block-at5t2wqb`) — **OFF LIMITS**

### Rules

- Every Neon MCP call (`run_sql`, `run_sql_transaction`, schema/migration tools, etc.)
  MUST pass `projectId: curly-block-55226637` and `branchId: br-bitter-brook-at6obg54`
  unless I explicitly name a different branch.
- NEVER run any operation — read or write — against the `production` branch
  (`br-shy-block-at5t2wqb`) unless I explicitly say "production" in that request.
  Do not infer it from context; require an explicit instruction each time.
- Never run destructive SQL (`DROP`, `DELETE`, `TRUNCATE`, `UPDATE`/`INSERT` without
  my go-ahead) or destructive branch/project tools without asking first — even on
  development.
- If I ask for something ambiguous about which branch, default to development and
  say which branch you used.
