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
