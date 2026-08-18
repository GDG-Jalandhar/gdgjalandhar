export async function register() {
  // Dev-only: intercepts server-side `fetch` calls to the Bevy API with msw
  // so `next dev` runs against the fixtures in `src/mocks/` without a live
  // network dependency. Never runs in production or during `next build`.
  if (process.env.NODE_ENV === "development" && process.env.NEXT_RUNTIME === "nodejs") {
    const { server } = await import("./mocks/server");
    server.listen({ onUnhandledRequest: "bypass" });
  }
}
