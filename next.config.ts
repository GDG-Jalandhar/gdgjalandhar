import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
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
      // Dev-only placeholder images for the msw fixtures — remove once
      // Phase 2 wires the real API and this is no longer exercised.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

// @serwist/turbopack, not @serwist/next — Next 16 defaults to Turbopack for
// both dev and build, and Turbopack doesn't run webpack plugins, which is
// how @serwist/next injects its precache manifest. This serves the compiled
// worker through a Route Handler instead (src/app/serwist/[path]/route.ts).
export default withSerwist(nextConfig);
