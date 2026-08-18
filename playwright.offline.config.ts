import { defineConfig, devices } from "@playwright/test";

// Offline/service-worker behavior only activates in production builds —
// src/app/sw.ts deliberately runs NetworkOnly (no caching at all) under
// `next dev` so a stale SW cache can never mask an msw fixture change while
// developing. This config builds and serves the real production bundle so
// e2e/offline-navigation.spec.ts exercises real caching, not the dev no-op.
// Run with `pnpm test:e2e:offline` — kept separate from playwright.config.ts
// (which runs against `pnpm dev`) rather than slowing down every e2e run
// with a production build.
export default defineConfig({
  testDir: "./e2e",
  testMatch: "offline-navigation.spec.ts",
  fullyParallel: false,
  retries: 0,
  // sw.ts's NetworkFirst navigation handler waits up to 10s for the network
  // before falling back to cache; individual assertions here wait up to 20s
  // to give that real margin, so the overall per-test budget needs headroom
  // above Playwright's 30s default too.
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 180_000,
  },
  // Desktop viewport, not Pixel 7 — this spec is testing SW caching
  // behavior, not the mobile drawer, and the desktop nav being directly
  // clickable (vs. behind the hamburger) keeps the test focused on that.
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
