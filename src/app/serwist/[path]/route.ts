import { createSerwistRoute } from "@serwist/turbopack";

// A revision string versions the precached offline page so stale cached
// responses don't stick around across deploys. This route is force-static
// (see createSerwistRoute below), so its module — and this constant — only
// evaluates once, during `next build`; a fresh UUID per build is all "changed
// this deploy" needs. Deliberately not shelling out to `git rev-parse HEAD`
// here: production container images commonly ship without the `git` binary
// or a `.git` directory, and there's no reason to risk a subprocess call
// (even a defensively-handled one) in a route module loaded at server boot.
const revision = crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  swSrc: "src/app/sw.ts",
  useNativeEsbuild: true,
});
