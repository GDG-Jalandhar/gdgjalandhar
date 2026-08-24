import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  // Mock mode gets its own build directory. Next's on-disk fetch cache is
  // keyed by request URL+options and knows nothing about which handler
  // produced a response, so a shared `.next` lets a `pnpm dev` run against
  // the real Bevy API poison a later `pnpm dev:mock` (and `pnpm test:e2e`,
  // which boots the mock server) with real-API responses — silently, with
  // nothing in the logs to explain the wrong data. Separate directories
  // make the two caches physically incapable of crossing over.
  distDir: process.env.USE_MOCKS === "1" ? ".next-mock" : ".next",
  // Firebase App Hosting (Cloud Run under the hood) expects a self-contained
  // server it can start directly — `.next/standalone/server.js` — rather
  // than running `next start` against the full project. Without this, the
  // platform's runtime container has nothing to launch, fails to bind the
  // port it's given, and the health check times out.
  output: "standalone",
  // Next's standalone-output file tracer misses `@swc/helpers`' ESM/CJS
  // interop entry points under pnpm's virtual store — confirmed locally:
  // the built `.next/standalone/server.js` crashed with `MODULE_NOT_FOUND`
  // for `@swc/helpers/esm/_interop_require_default.js`, a file that exists
  // in the source `node_modules` but wasn't copied into the traced output.
  // Forcing the whole package in sidesteps the tracer's static analysis gap.
  outputFileTracingIncludes: {
    "/*": ["node_modules/@swc/helpers/**/*"],
  },
  images: {
    remotePatterns: [
      // Real Bevy event banners/thumbnails (PRD §6.6 D-6).
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Placeholder images for the msw fixtures, which are opt-in via
      // `pnpm dev:mock` (USE_MOCKS=1). Plain `pnpm dev` and `next build` hit
      // the real API and never request this host.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

// @serwist/turbopack, not @serwist/next — Next 16 defaults to Turbopack for
// both dev and build, and Turbopack doesn't run webpack plugins, which is
// how @serwist/next injects its precache manifest. This serves the compiled
// worker through a Route Handler instead (src/app/serwist/[path]/route.ts).
export default withSerwist(nextConfig);
