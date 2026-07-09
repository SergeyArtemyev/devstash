# Current Feature

<!-- Feature name and short description -->

## Status

<!-- Not Started | In Progress | Completed -->

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Ane extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- Initial Next.js and Tailwind CSS v4 setup — scaffolded project, base layout/styles, and context files.
- Dashboard UI Phase 1 — initialized shadcn/ui (Nova preset, neutral base, `button`/`input`), added `/dashboard` route with shell layout (Sidebar + Topbar + main), dark mode by default, and display-only top bar (search + New Collection/New Item). Sidebar and main are placeholders.
- Dashboard UI Phase 2 — built out the sidebar: collapsible Types group (links to `/items/<type>`), collapsible Collections group (Favorites + Recent sub-lists), and a user footer (avatar/name/email/settings). Added `SidebarProvider` context + `useIsMobile` hook for sidebar open/close state; desktop collapses via the Topbar `PanelLeft` toggle, mobile always uses an overlay drawer. Mock data imported directly (no DB yet). Note: `MockCollection` has no timestamps, so "Recent" shows non-favorite collections rather than a true date sort.
- Dashboard UI Phase 3 — built out the main content area (all server components, display-only): header, 4 stats cards (`StatsCards`: items, collections, favorite items, favorite collections), a "Collections" grid (`CollectionCard` with colored left accent, star, item count, description, and type icons derived from assigned items) with a "View all" link, a "Pinned" section, and a "Recent Items" list (up to 10, sorted by `updatedAt` desc). Added shared `src/lib/item-types.ts` (`TYPE_ICONS` map + `getItemType`) and a reusable `ItemRow` used by both Pinned and Recent. Notes: Collections shows insertion order (mock has no timestamps); used direct map-lookup for icons (not a helper call) to satisfy the React Compiler `static-components` lint rule.