# Current Feature

<!-- Describe the feature/fix being worked on. -->

## Status

<!-- Not started | in Progress | Completed -->

## Goals

<!-- What this feature needs to accomplish. -->

## Notes

<!-- Constraints, references, decisions, and gotchas. -->

## History

<!-- Keep this updated. Earliest to latest -->

- Initial Next.js and Tailwind CSS v4 setup — scaffolded project, base layout/styles, and context files.
- Dashboard UI Phase 1 — initialized shadcn/ui (Nova preset, neutral base, `button`/`input`), added `/dashboard` route with shell layout (Sidebar + Topbar + main), dark mode by default, and display-only top bar (search + New Collection/New Item). Sidebar and main are placeholders.
- Dashboard UI Phase 2 — built out the sidebar: collapsible Types group (links to `/items/<type>`), collapsible Collections group (Favorites + Recent sub-lists), and a user footer (avatar/name/email/settings). Added `SidebarProvider` context + `useIsMobile` hook for sidebar open/close state; desktop collapses via the Topbar `PanelLeft` toggle, mobile always uses an overlay drawer. Mock data imported directly (no DB yet). Note: `MockCollection` has no timestamps, so "Recent" shows non-favorite collections rather than a true date sort.
- Dashboard UI Phase 3 — built out the main content area (all server components, display-only): header, 4 stats cards (`StatsCards`: items, collections, favorite items, favorite collections), a "Collections" grid (`CollectionCard` with colored left accent, star, item count, description, and type icons derived from assigned items) with a "View all" link, a "Pinned" section, and a "Recent Items" list (up to 10, sorted by `updatedAt` desc). Added shared `src/lib/item-types.ts` (`TYPE_ICONS` map + `getItemType`) and a reusable `ItemRow` used by both Pinned and Recent. Notes: Collections shows insertion order (mock has no timestamps); used direct map-lookup for icons (not a helper call) to satisfy the React Compiler `static-components` lint rule.
- Prisma + Neon PostgreSQL Setup — set up Prisma 7 (Rust-free `prisma-client` generator + `@prisma/adapter-pg` driver adapter) against a serverless Neon database. Added the initial schema (User, Item, ItemType, Collection, Tag, ItemTag + NextAuth Account/Session/VerificationToken) with indexes and cascade/restrict/set-null deletes, a singleton client in `src/lib/prisma.ts`, and env config via `prisma.config.ts` (Prisma 7 no longer auto-loads env, so `dotenv/config` + `env()` helper). Added `scripts/test-db.ts` to verify the connection and row counts, and `prisma/seed.ts` (idempotent upsert by fixed id) seeding the 7 built-in system item types (`isSystem: true`, `userId: null`); registered under `migrations.seed` in `prisma.config.ts` (runs via `npx prisma db seed`). Notes: seed uses `npx tsx` (bare `tsx` isn't on the spawned PATH); system type names use the plural mock-data labels (Snippets, Prompts, …) so the DB is a drop-in replacement for the current mock-driven UI; harmless `pg` deprecation warning about `sslmode=require` being treated as `verify-full`.