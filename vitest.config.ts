import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Next.js resolves this to a no-op via its own "react-server" export
      // condition at build time; Vite/Vitest don't know that condition and
      // always hit the throwing branch, so tests get the no-op directly.
      "server-only": "/src/test/server-only-stub.ts",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    exclude: ["node_modules", "e2e", ".next"],
  },
});
