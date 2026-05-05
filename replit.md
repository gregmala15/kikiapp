# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- **`artifacts/reliq`** — Reliq fashion mobile app (Expo/React Native, expo-router, preview path `/`)
- **`artifacts/api-server`** — Express API server (preview path `/api`)
- **`artifacts/mockup-sandbox`** — Design/mockup sandbox (preview path `/__mockup`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Reliq App Structure

The Reliq app (`artifacts/reliq/`) uses expo-router with file-based routing. Key directories:
- `app/` — All screens and routing (expo-router file-based)
- `components/` — Shared UI components
- `contexts/` — React context providers (AuthContext, AppContext)
- `constants/` — Design tokens (colors, seed-data)
- `lib/` — Shared utilities (query-client)
- `assets/` — Images and static assets
- `patches/` — patch-package patches

Fonts: Inter (400/500/600/700) + Playfair Display (400/700/400-Italic)

### Save / Collections invariants
- `savedProductIds` is the master list ("All Saved"). `collections` are named subsets — every `productId` inside a `Collection` MUST also be in `savedProductIds`.
- `toggleSaved` (unsave path) strips the product from every collection. `addProductToCollection` / `createCollection(name, productId)` add to `savedProductIds` if missing. Membership checks live INSIDE the `setSavedProductIds` updater to avoid stale-closure dupes from rapid taps.
- `loadAll` prunes collection IDs against the loaded saved set on hydrate (and re-persists if it cleaned anything), so any drift from older builds self-heals on next launch.
- AsyncStorage key: `kiki_collections_<userId>` (kept the `kiki_` prefix from the pre-rename for back-compat).

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
