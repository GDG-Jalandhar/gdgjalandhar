import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
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
