export type JoinPlacement = "hero" | "navbar" | "footer" | "about";

type AnalyticsEvent =
  | { name: "join_click"; placement: JoinPlacement }
  | { name: "rsvp_click"; slug: string }
  | { name: "pwa_install_prompted" }
  | { name: "pwa_install_accepted" }
  | { name: "pwa_install_dismissed" };

/**
 * Thin tracking stub — swap the body for a real provider later without
 * touching call sites. Every Join button fires this with its placement (G-3)
 * from day one so that wiring never has to be redone per call site.
 */
export function trackEvent(event: AnalyticsEvent) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event);
  }
}
