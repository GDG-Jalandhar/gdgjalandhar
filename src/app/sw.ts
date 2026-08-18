/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { CacheFirst, ExpirationPlugin, NetworkFirst, NetworkOnly, Serwist, StaleWhileRevalidate } from "serwist";
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const DAY = 24 * 60 * 60;

// PRD §7.7 — the RSC/service-worker sharp edge: App Router serves both full
// HTML (hard navigation) and an RSC payload (client navigation) per route.
// Matching on the `RSC` request header (set by Next on every RSC fetch) is
// more robust than keying on the `_rsc` query param PRD's prose suggests,
// and is what Next's own Serwist integration does internally.
const productionRuntimeCaching: RuntimeCaching[] = [
  // Navigations: NetworkFirst, offline page as fallback (P-5) — never
  // CacheFirst on HTML, that's the classic post-deploy white screen.
  {
    matcher: ({ request, sameOrigin }) => sameOrigin && request.mode === "navigate",
    handler: new NetworkFirst({
      cacheName: "pages",
      plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 30 * DAY })],
      networkTimeoutSeconds: 10,
    }),
  },
  // RSC payloads: StaleWhileRevalidate — a stale payload just re-hydrates
  // an already-valid shell, unlike stale HTML.
  {
    matcher: ({ request, sameOrigin }) => sameOrigin && request.headers.get("RSC") === "1",
    handler: new StaleWhileRevalidate({
      cacheName: "pages-rsc",
      plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 30 * DAY })],
    }),
  },
  // Hashed build assets: CacheFirst, immutable.
  {
    matcher: /\/_next\/static\/.+/i,
    handler: new CacheFirst({
      cacheName: "next-static",
      plugins: [new ExpirationPlugin({ maxEntries: 128, maxAgeSeconds: 365 * DAY })],
    }),
  },
  // Bevy Cloudinary event images: CacheFirst, 30 days, 60 entries (P-4).
  {
    matcher: /^https:\/\/res\.cloudinary\.com\/.*/i,
    handler: new CacheFirst({
      cacheName: "bevy-images",
      plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * DAY })],
    }),
  },
  // Self-hosted fonts: CacheFirst, 1 year (P-4).
  {
    matcher: /\.(?:woff2?|ttf|otf)$/i,
    handler: new CacheFirst({
      cacheName: "fonts",
      plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 365 * DAY })],
    }),
  },
  // Same-origin API GETs: StaleWhileRevalidate, 24h, 50 entries (P-4). In
  // this app's RSC-first architecture the Bevy API is fetched server-side,
  // so the browser rarely if ever hits a matching same-origin `/api/` GET —
  // kept for completeness/future API routes, not currently load-bearing.
  {
    matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/api/"),
    method: "GET",
    handler: new StaleWhileRevalidate({
      cacheName: "api",
      plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: DAY })],
    }),
  },
];

// Dev builds run against msw fixtures the SW shouldn't cache over — matches
// @serwist/turbopack's own defaultCache convention of NetworkOnly outside
// production, so a stale SW cache never masks a fixture change during dev.
const runtimeCaching: RuntimeCaching[] =
  process.env.NODE_ENV !== "production" ? [{ matcher: /.*/i, handler: new NetworkOnly() }] : productionRuntimeCaching;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
