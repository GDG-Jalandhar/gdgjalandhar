import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // offline-navigation.spec.ts needs a production build for real SW caching
  // (see playwright.offline.config.ts) — dev mode's SW is a NetworkOnly
  // no-op on purpose, so that spec would just fail here for the wrong reason.
  testIgnore: "offline-navigation.spec.ts",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { ...devices["Pixel 7"] } },
  ],
});
