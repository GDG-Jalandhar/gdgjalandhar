# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

All PRD v1 functional scope is built: Home/About/Events/Event-detail routes wired to the real Bevy API (via `src/lib/gdg/`, which `pnpm dev` and `pnpm build` both hit; `msw` fixtures in `src/mocks/` are opt-in via `pnpm dev:mock`), PWA (Serwist service worker, manifest, install prompt, update flow), and SEO (JSON-LD, sitemap, robots, canonical URLs). Speakers/judges/mentors and sponsors now render on event detail, and the About team is live — three endpoints the PRD wrote off as missing have since turned up (`event_person`, `event_sponsor`, `chapter_slim/<slug>/team/`), so PRD §6.7 and A-2 are stale on those three points; the API section below is authoritative. Unit tests (Vitest), e2e smoke + accessibility tests (Playwright), and an offline-navigation e2e spec all exist — see Testing below. Remaining work is real-device verification (PRD §11's own carve-outs: iOS install behavior, the Cloudinary `srcset`/image-domain check once real API images are live) and a Lighthouse CI pass, not new features. The two root-level docs are still the source of truth for anything not covered here:

- `GDG-Jalandhar-PRD.md` — functional requirements, the Bevy API contract, and all technical/architecture decisions (§7).
- `GDG-Jalandhar-Design-Philosophy.md` — visual system: color tokens, the "notch" container primitive, typography, spacing.

## Commands

```bash
pnpm dev        # dev server — hits the REAL Bevy API, same as build (builds into .next)
pnpm dev:mock   # dev server — msw fixtures (src/mocks/), offline-friendly (builds into .next-mock)
pnpm build      # production build — REAL Bevy API; prerenders every event (~18s for 131 pages)
pnpm start
pnpm lint       # eslint (flat config, eslint.config.mjs)
pnpm typecheck  # tsc --noEmit
pnpm test       # vitest run
pnpm test:watch
pnpm test:e2e   # playwright test — smoke + accessibility, runs against `pnpm dev:mock`
pnpm test:e2e:offline  # offline-navigation.spec.ts only — builds + runs `pnpm start` (needs a real prod build; see Testing below)
```

## The `.next` cache gotcha — mostly defused, but know why

Next's on-disk fetch/data cache in `<distDir>/cache/` is keyed by request URL+options, **not** by which command populated it. Since real and mock modes hit the identical URL, a shared cache lets one silently serve the other's responses — with nothing in the logs to explain the wrong data.

**This is now structurally prevented**: `next.config.ts` sets `distDir` to `.next-mock` when `USE_MOCKS=1`, so mock mode has a physically separate cache. Confirmed by reproduction — before the split, running `pnpm test:e2e` (mock-backed) after a plain `pnpm dev` failed 4 specs on real-API data bleeding through; after it, the same sequence passes 8/8 with the real-API `.next` still on disk. Don't collapse the two directories back together.

What the split does **not** cover: editing `src/mocks/handlers.ts` or fixture data still leaves the previous response cached under that URL in `.next-mock/`. **Fix: `rm -rf .next-mock`** after changing anything under `src/mocks/`.

## Deployment (Firebase App Hosting / Cloud Run)

`next.config.ts` sets `output: "standalone"` — platforms like Firebase App Hosting run `.next/standalone/server.js` directly rather than `next start`; without it, the container has nothing to launch and fails its startup health check (confirmed: this is exactly what happened on first deploy). If you ever see a Cloud Run "container failed to start and listen on the port" error here, `output: "standalone"` being absent is the first thing to check.

With `output: "standalone"` on **pnpm**, Next's file tracer misses `@swc/helpers`' ESM/CJS interop files when copying into the standalone bundle — confirmed locally by running `node .next/standalone/server.js`, which crashed with `MODULE_NOT_FOUND` for `@swc/helpers/esm/_interop_require_default.js` even though the file exists in the real `node_modules`. Fixed via `outputFileTracingIncludes` in `next.config.ts` forcing the whole package in. If a similar `MODULE_NOT_FOUND` shows up for a *different* package after a dependency change, the fix is the same shape: add it to `outputFileTracingIncludes`, don't just add the dependency.

**Local verification before trusting a deploy**, since this is the closest approximation to what Cloud Run actually runs:
```bash
rm -rf .next && pnpm build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
PORT=8080 HOSTNAME=0.0.0.0 node .next/standalone/server.js
```
`next start` alone does **not** exercise this path — it ignores `output: "standalone"` and runs the full project directly, so it won't catch standalone-specific tracing gaps like the one above.

## Architecture

- **`src/lib/gdg/`** — the whole Bevy integration layer, in dependency order: `constants.ts` (chapter ID, API base) → `schema.ts` (Zod) → `client.ts` (`fetchEventList`, `fetchEventDetail`, ISR revalidate: 300s lists / 3600s detail) → `normalize.ts` (raw → `GdgEvent`, the only place raw Bevy field names should ever appear) → `agenda-parser.ts` / `sanitize.ts` (defensive parsing, both have dedicated unit tests) → `types.ts` (`GdgEvent` shape) → `format-event.ts` (`Intl.DateTimeFormat`-based display helpers). Nothing outside this folder should import raw Bevy shapes — always go through `normalize.ts`'s `GdgEvent`.
- **`src/mocks/`** — `msw` handlers + fixtures (`fixtures/events.ts`, `fixtures/agenda.ts`, `fixtures/chapter.ts`), opt-in via `USE_MOCKS=1` (`src/instrumentation.ts` gates on it; `pnpm dev:mock` and the Playwright `webServer` set it). `fixtures/agenda.ts` is also imported directly by `agenda-parser.test.ts`, so it must survive any mock cleanup even if the handlers don't. The fixtures mirror real edge cases: a cohosted foreign-chapter event (`chapter_id: 887`, the PRD's own "tripwire" for mock data leaking into prod), a 13-row agenda, attendees exceeding capacity, a default-banner placeholder, and a malformed-agenda string with the exact invalid escapes real Bevy data contains.
- **`src/components/`** — cross-feature UI: `notch/Notch.tsx` (the structural primitive — `clip-path` + coordinate-locked SVG stroke overlay, both using percentage units so they stay locked at any card size), `brand/Logo.tsx` (picks the correct pre-colored SVG file per route accent — see below), `glyphs/` (codegen'd from `brand-kit/assets/glyphs/Thin/*.svg`, see `Glyph.tsx`'s header comment), `layout/` (Header/Footer/MobileDrawer/RouteAccent), `pwa/` (InstallPrompt, InstallAppButton, UpdateToast), `social/`, `ui/Button.tsx`.
- **`src/features/{events,home,about}/components/`** — route-specific composition.
- **Route accent** (`data-accent` → `--accent`/`--accent-text`): each page wraps its content in `<RouteAccent value="...">`, not a route group — a single root layout is what keeps offline client-side navigation working (PRD §7.7). The header's own logo can't read a page's accent via props (it lives in the root layout), so `src/lib/accent.ts` derives an approximate value from the pathname instead; this can legitimately differ from the real page accent on event detail (which is data-dependent: green if upcoming, yellow if past) — an accepted simplification, not a bug.
- **Logo color selection**: `public/brand/logos/` ships two lockups (`GDG-Jalandhar-Logo-*` horizontal, `GDGLogo-top-bottom-*` stacked) × 4 accent colors × a `-Light`/no-suffix pair. Verified by rendering both against `#1e1e1e`: the **`-Light` suffix is the dark-canvas variant** (white wordmark) — always used, since this site is dark-first/single-mode. The color name (Blue/Green/Yellow/Red) controls only the "Jalandhar" location-line color; the chevron mark itself is always full 4-color regardless (the one sanctioned exception to "never mix accent families," per Design-Philosophy.md §4.2).
- **Fonts**: real Google Sans / Google Sans Mono TTFs were subset to `latin`+`latin-ext` and converted to WOFF2 via `pyftsubset` (~2.2MB → ~35KB per weight) — see `src/lib/fonts.ts` and `src/fonts/`. The 2.2MB originals live in `brand-kit/fonts/` (repo root, **not** `public/`) — Serwist's precache-manifest generation globs `public/` for cacheable assets, and 28MB of unused raw TTFs sitting there produced build warnings for files nothing ever requests. Same reasoning moved the raw glyph SVGs to `brand-kit/assets/`. Only assets actually fetched at runtime belong under `public/` (`public/brand/logos/`, `public/icons/`).
- **Images**: two different assets for two different surfaces, and they are not interchangeable.
  - **Detail page** uses `cropped_banner_url` — a **2560x640 (exactly 4:1)** Cloudinary crop, verified by decoding a downloaded banner's JPEG header. `--aspect-banner` in `globals.css`'s `@theme inline` is the single place that ratio lives.
  - **Cards** use `cropped_picture_url` — a **1000x1000** square poster, rendered uncropped at `aspect-square`. Cards previously used the banner; squeezing 2560px into a ~300px card is an 8.5x downscale that visibly softens the artwork's type. Don't "simplify" this back to one asset.
  - Bevy ships **two different placeholder markers** and they disagree: `GDG_Bevy_DefaultEventBanner` and `GDG_Bevy_DefaultEventThumbnail`. Measured on the live chapter, 7 of the first 100 completed events have a placeholder banner but real poster art, so `normalize.ts` carries `isDefaultBanner` **and** `isDefaultThumbnail`. Using one for both surfaces silently shows Bevy stock art.
  - Poster backgrounds vary (white, grey, near-black) because organizers author them. That is deliberate and unfixed — a tint or blend to normalise them would distort the artwork.
- **`notFound()` on `/events/[slug]`** returns a "soft 404": correct content, a `noindex` meta tag Next injects automatically, but an HTTP 200 rather than a literal 404 — because `/events/loading.tsx` wraps the segment in an implicit Suspense boundary, and the response has already started streaming 200 by the time the not-found check resolves. This is documented Next 16 behavior (see `notFound()`'s own docs on the streaming/status-code trade-off), not an oversight; a true 404 status would require a `proxy` (edge middleware) existence check ahead of the stream.
- **PWA (Phase 3)**: `@serwist/turbopack`, not `@serwist/next` — Turbopack doesn't run webpack plugins, which is how the `next` package injects its precache manifest; the Turbopack package serves the compiled worker through `src/app/serwist/[path]/route.ts` instead. `src/app/sw.ts` disables all runtime caching (`NetworkOnly`) outside production so a stale SW cache never masks an `msw` fixture change during dev — same convention the package's own `defaultCache` uses. `useSerwist()`'s `serwist` instance can't have `.update()` called on it until its `.active` promise resolves (calling earlier races `SerwistProvider`'s own registration and throws) — see `UpdateToast.tsx`.

## The Bevy API (external, read-only, undocumented)

Chapter `781`, no CMS, no local database (PRD §6). Landmines already handled in `src/lib/gdg/`, don't rediscover them:

- List responses need `fields=` including `slug` explicitly, or routing breaks.
- `pagination.page_size` echoes a server default, not the requested value — paginate using `count`/`links.next`.
- `agenda` is a **double-encoded JSON string** with invalid escape sequences in real data (e.g. `\’`) — `agenda-parser.ts` handles this with a strict-parse-then-cleanup-pass fallback, tested against the exact malformed string in `agenda-parser.test.ts`.
- `total_attendees` can exceed `total_capacity` — never a ratio, count shown alone (`normalize.ts`).
- **The chapter profile lives at `/api/chapter_slim/<slug>/`** — keyed by SLUG, not ID. `/api/chapter_slim/781/` 404s and `/api/chapter/781/` is 403. It is the only public source of `members_count` and the chapter `description` (3.3 KB). The *list* form `/api/chapter_slim/` ignores every filter tried (`id`, `slug`, `search`, `city`, `fields`), returns 1.1 MB for 500 chapters, and puts 781 at an unstable index — don't use it. The chapter page's `__NEXT_DATA__` blob carries the identical object and was deliberately **rejected**: 27x larger and coupled to Bevy's own framework internals. Don't re-derive the scrape.
- The chapter `description` is organizer-authored HTML with the same hazards as an event description (`<b>` not `<strong>`, inline `style`, `<p><b><br></b></p>` spacers) plus a self-referential `Mail:`/`Website:`/`Our Team:` block that points back at this site. `chapter-description.ts` strips that block; the GDG disclaimer is kept deliberately. About renders it live.
- `fetchChapter()` is the one client function that **never throws** — it returns `null` on any failure and callers fall back to `src/data/chapter.ts`. A decorative stat must not be able to 500 the home page. Don't "make it consistent" with the event fetches.
- Sort order (`order=start_date` / `order=-start_date`) is a server-side param the client trusts, not re-sorted client-side — `src/mocks/handlers.ts` replicates that sort so fixture behavior matches reality.
- **`event_person` and `event_sponsor` are keyed OPPOSITELY, and nothing in either payload hints at it.** People are keyed by SLUG (`/api/event_person/?event=<slug>`); passing the numeric id returns `count: 0` with a **200**, so the mistake looks exactly like an event with no speakers. Sponsors are keyed by NUMERIC ID (`/api/event_sponsor/?event_id=<id>`); passing a slug is a hard 400. This is why `fetchEventSponsors` guards on a falsy id — `normalizeEventListItem` defaults `id` to 0, so a list-derived event must never reach it.
- **`role` and `sponsor_type` are OPEN vocabularies — never enum them.** Six roles are observed on this chapter (`speaker` ×136, `mentor`, `judge`, `panelist`, `moderator`, `host`) and Bevy's own term settings define more (`facilitator`, `organizer`, `partner`). An enum would turn an organizer picking an unused role into a parse failure for the whole event. Unmapped slugs are titleized in `format-people.ts` and still render.
- **`event_person` returns junk placeholder rows** — `first_name`/`last_name` of `"-"` with `picture: {}` (an empty OBJECT, not null). Four exist across the first 35 events. `normalizeEventPeople` drops them; the empty-object picture is also why every field on the image schema is optional.
- **The chapter team lives at `/api/chapter_slim/<slug>/team/`** and returns a **bare array** — no `links`/`count`/`results` envelope, the only list endpoint shaped this way. Its two title fields contradict each other per person: the outer `title` is the chapter-team role and `user.title` is the day job, but organizers fill them in either order (one organizer has the role in `user.title`, another in the outer `title`). `normalizeTeam` reconciles both into a primary line, an optional second line, and the Organizer badge flag. `fetchTeam` returns `null` (not `[]`) on failure so About can tell an outage apart from an empty roster.
- **A person's `bio` arrives in two incompatible formats under one field name.** `event_person.bio` is organizer-authored HTML (`<p>`, `<br>`, `<span>`, `<a>`) — except 7 of the 132 non-empty values on this chapter, which are plain text. `chapter_slim/<slug>/team/` → `user.bio` is ALWAYS plain text, with `\n\n` carrying the paragraphs. Rendering either as the other is silently wrong in both directions. `bio.ts`'s `toBioHtml` is the single funnel; its HTML detection matches only the tags Bevy actually emits, so prose mentioning `<canvas>` stays visible text instead of being eaten by the sanitizer.
- **Socials are bare handles, never URLs** — `personal_twitter: "AashiDutt"`, `personal_linkedin_page: "aashi-dutt"`, team `user.twitter`. `format-people.ts` builds the URLs. LinkedIn is rare: 3 of 159 people, none on the team.
- **Partners render as one flat list, not grouped by `sponsor_type`.** That field is Bevy's own taxonomy (media_partner / local_sponsor / global_sponsor) and every sponsor this chapter has ever had is a `media_partner`, so grouping produced a single section headed with an implementation detail. `EventSponsors` takes a flat `GdgSponsor[]`; `normalizeEventSponsors` still honours `visible` and `order`.
- **Sponsor logos are wide, transparent PNGs.** Measured on the live chapter: palette PNGs with a `tRNS` chunk at 480x240 and 762x376. Use `logo.url` on a light plate — `logo.thumbnail_url` is a 200x200 `c_fill` crop that cuts a wordmark in half, and a transparent dark-ink logo dropped straight onto `#1e1e1e` is invisible.

## Testing

- **Unit** (`src/**/*.test.ts`, Vitest): `agenda-parser.test.ts` and `sanitize.test.ts` are the two PRD-mandated non-optional tests (§7.9) — both guard against third-party data silently breaking the site. `server-only` is aliased to a no-op stub in `vitest.config.ts` since Vite doesn't know Next's `react-server` export condition that makes the real package a no-op at build time.
- **E2E** (`e2e/*.spec.ts`, Playwright, `playwright.config.ts`, against `pnpm dev`): `smoke.spec.ts` (home → events → detail → Join click, plus the 404 path) and `accessibility.spec.ts` (axe, zero critical/serious violations across all routes + the mobile drawer's keyboard operation). The axe scan retries once on `Execution context was destroyed`: every route registers the service worker on first visit and the reload can land mid-scan. That is a navigation, not a violation — confirmed by reproducing it against a *production* build on `/events` and `/events?tab=past`, routes with no Suspense boundary and no recent change. Don't "simplify" the retry away.
- **`e2e/offline-navigation.spec.ts`** needs a real production build (`playwright.offline.config.ts`, `pnpm test:e2e:offline`) since `sw.ts` is `NetworkOnly` outside production. Has a documented, reproducible flake: `context.setOffline(true)` racing a *fresh top-level navigation* can throw a raw `net::ERR_INTERNET_DISCONNECTED` that never reaches the SW's `fetch` handler — a Chromium/CDP-level limitation of simulated offline mode, confirmed via direct reproduction outside the test, not a defect in the app (manual verification and the suite's own passing runs show the real fallback/caching behavior working). Prefer real-device verification for this specific behavior over trusting a red/green result from this one spec.

## Design system essentials

- One accent color family per route — never mix accent families in one composition (Design Philosophy §4.2).
- The **notch** is the structural primitive, not decoration.
- Halftone colors carry text/links on the dark canvas; Core colors are strokes/shapes/large type only.
- Never write "GDG Lead" — the correct title is "GDG Organizer."
- **`text-text-faint` is only safe on the `--gdg-bg` canvas.** globals.css documents #8a8a8a as the faintest value clearing 4.5:1, but that was measured against #1e1e1e (4.83:1). On a `bg-surface` card (#262626) it drops to 4.38:1 and fails AA. Inside a filled card the faintest usable tier is `text-text-muted` (6.36:1) — see `PersonCard.tsx`.
- **A dialog rendered from page content must NOT be portaled to `document.body`.** `RouteAccent` sets `data-accent` on a `display: contents` wrapper around the route's content, and `--accent` cascades from it — a portal lands outside that wrapper and the dialog reverts to the `:root` blue on a green event page or yellow About. `MobileDrawer` portals only because it sits inside the `backdrop-blur` header, whose `backdrop-filter` becomes the containing block for `position: fixed`. `PersonDetails` renders inline for exactly this reason.
- **A dialog inside `PersonCard` needs its own `text-left`** — the card is `text-center`, and that inherits into the modal, where a centered bio is unreadable.
- **Person and sponsor grids size off their container, not the viewport** (`@container` + `@md:`/`@4xl:` in `PersonGrid.tsx`). The two surfaces give the same grid very different widths at the same viewport — the event detail column is capped at `max-w-3xl` while About runs to 1140px — so a viewport breakpoint puts four cards in the event page's 752px on any desktop and wraps the names.

## Commits & PRs

Write them the way a senior engineer does: short, factual, no padding.

- **Subject:** imperative mood, under ~70 chars, no trailing period. "Group event people by role", not "This commit adds the ability to group...".
- **Body:** usually none. Add one only for the *why* a reader can't get from the diff — a non-obvious constraint, a rejected alternative, an upstream landmine. A few lines, not a report.
- **PR description:** a sentence or two on what changed and why, plus how it was verified. Bullets over prose.
- No emoji, no marketing adjectives, no "comprehensive"/"robust"/"seamless", no restating the diff file by file, no summarizing what the tests already assert.
- Don't pad a small change to look bigger. A one-line fix gets a one-line message.
- **No AI attribution anywhere.** No `Co-Authored-By: Claude`, no `Claude-Session:` trailer, no "Generated with Claude Code" footer — not in commit messages, not in PR descriptions. The commit history is the author's.
