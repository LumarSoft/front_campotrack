# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server (Turbopack, http://localhost:3000)
npm run build     # Production build (also Turbopack by default)
npm run start     # Start production server
npm run lint      # Run ESLint (next build no longer runs the linter)
```

To use Webpack instead of Turbopack: append `--webpack` to the dev/build command.

## Architecture

- **Framework**: Next.js 16 with App Router (`app/` directory)
- **Styling**: Tailwind CSS v4 — uses `@import "tailwindcss"` in `globals.css`, **not** `@tailwind base/components/utilities`
- **Bundler**: Turbopack (default for both `dev` and `build`); Turbopack config goes at top-level `turbopack:` in `next.config.ts`, not `experimental.turbopack`
- **TypeScript**: strict mode; path alias `@/*` → project root
- **ESLint**: flat config (`eslint.config.mjs`), ESLint 9

## Next.js 16 Breaking Changes

These differ significantly from Next.js 15 and prior training data:

**Async Request APIs (fully removed sync compat)**
`cookies()`, `headers()`, `draftMode()`, route `params`, and page `searchParams` are Promises — always `await` them. Use `npx next typegen` to generate `PageProps`/`LayoutProps`/`RouteContext` type helpers.

**Routing**
- `middleware.ts` → renamed to `proxy.ts`; export `proxy` function instead of `middleware`
- All parallel route slots require an explicit `default.js`; builds fail without it
- `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`

**Caching**
- `revalidateTag(tag)` now requires a second `cacheLife` profile argument: `revalidateTag('posts', 'max')`
- Use `updateTag` (Server Actions only) for read-your-writes / immediate invalidation
- `unstable_cacheLife` / `unstable_cacheTag` → stable: `cacheLife` / `cacheTag`
- PPR: replace `experimental.ppr` / `experimental.useCache` / `experimental.dynamicIO` with top-level `cacheComponents: true`

**Removed**
- `next lint` CLI command — run `eslint` directly
- `serverRuntimeConfig` / `publicRuntimeConfig` — use `process.env` / `NEXT_PUBLIC_*` vars
- `next/legacy/image` — use `next/image`
- `images.domains` — use `images.remotePatterns`
- AMP support entirely removed
- `devIndicators.appIsrStatus`, `buildActivity`, `buildActivityPosition`

**Other**
- `next build` no longer runs the linter automatically
- Dev output goes to `.next/dev`; production output to `.next`
- `scroll-behavior: smooth` is no longer overridden during navigation (add `data-scroll-behavior="smooth"` to `<html>` to restore old behavior)
- Local images with query strings require `images.localPatterns.search` config
- `images.minimumCacheTTL` default changed from 60s → 14400s (4 hours)



## Development rules

@docs/rules/code-style.md
@docs/rules/components.md
@docs/rules/state-management.md
@docs/rules/data-fetching.md
@docs/rules/error-handling.md
@docs/rules/performance.md
@docs/rules/git.md

