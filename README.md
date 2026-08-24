# GDG Jalandhar

The website for the GDG Jalandhar developer community — a mobile-first Progressive Web App that shows who the chapter is, what's coming up, and one clear way to join. There's no CMS and no database: all event content is fetched live and rendered through React Server Components, with the site installable and readable offline as a PWA.

## Stack

- **Next.js 16** (App Router) — React Server Components, streaming, and ISR for all data fetching
- **TypeScript**, strict mode
- **Tailwind CSS v4**, themed from brand design tokens, with a handful of CSS Modules for geometry (the notch container, the agenda rail) that utilities can't express
- **Serwist** for the service worker — install prompt, offline fallback page, update-available flow
- **Zod** for API response validation, **isomorphic-dompurify** for sanitizing organizer-authored HTML (server-side only)
- **Vitest** + React Testing Library for unit tests, **Playwright** for e2e (smoke, accessibility, offline navigation)
- **msw** for an opt-in offline dev mode (`pnpm dev:mock`) — plain `pnpm dev` runs against the live Bevy API

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server runs against the **live Bevy API**, the same source `pnpm build` uses.

If you need to work offline, or want a fixed data set that exercises edge cases the live chapter doesn't currently expose (a cohosted foreign-chapter event, a malformed agenda, attendees over capacity), run `pnpm dev:mock` instead — that serves the fixtures in `src/mocks/`. The two modes use separate build directories (`.next` and `.next-mock`), so switching between them never needs a cache wipe.

## Commands

```bash
pnpm dev              # dev server, live Bevy API
pnpm dev:mock          # dev server, msw fixtures (offline-friendly)
pnpm build             # production build
pnpm start             # serve the production build
pnpm lint               # eslint
pnpm typecheck          # tsc --noEmit
pnpm test                # unit tests (vitest)
pnpm test:watch
pnpm test:e2e            # e2e smoke + accessibility tests (playwright, against `pnpm dev:mock`)
pnpm test:e2e:offline    # offline-navigation e2e test (needs a production build)
```

## Project structure

```
src/
  app/            # routes (App Router) — pages, layouts, loading/error states, manifest, sw entry
  components/     # cross-feature UI: the notch primitive, brand/logo, glyphs, layout shell, pwa, social, ui
  features/       # route-specific composition (home, events, about)
  lib/            # data normalization, formatting, fonts, SEO helpers
  data/           # hand-authored chapter/team content not available from any API
  mocks/          # msw handlers + fixtures used by `pnpm dev:mock`, the e2e suite, and the unit tests
public/
  brand/          # logo lockups used at runtime
  icons/          # PWA install icons
brand-kit/        # source design assets (full-size fonts, glyph library) — not served, kept for reference
e2e/              # Playwright specs
```

Routes: `/` (home), `/events` (upcoming/past listing), `/events/[slug]` (event detail), `/about`.

## Design system

The visual language centers on a "notch" container as the structural primitive, per-route accent colors, and a Google Sans / Google Sans Mono type system.

## PWA

The site installs on Android and iOS, precaches its app shell, and works offline for previously visited pages — including client-side navigation between them, not just a reload. An update toast appears when a new version is available. See `src/app/sw.ts` for how the caching strategy is put together.
