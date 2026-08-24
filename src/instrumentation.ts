export async function register() {
  // Opt-in only: `pnpm dev:mock` serves the fixtures in `src/mocks/`. Plain
  // `pnpm dev` hits the real Bevy API, same as `next build` does. The runtime
  // guard stops a second registration in the edge runtime.
  if (process.env.USE_MOCKS === "1" && process.env.NEXT_RUNTIME === "nodejs") {
    const { server } = await import("./mocks/server");
    server.listen({ onUnhandledRequest: "bypass" });
  }
}
