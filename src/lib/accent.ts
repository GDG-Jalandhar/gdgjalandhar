import type { AccentColor } from "@/components/brand/Logo";

/**
 * Route → accent mapping per Design-Philosophy.md §4.2. The header lockup
 * (root layout, can't read a per-page prop) uses this pathname-based
 * approximation; each page's own <RouteAccent> sets the real, potentially
 * data-dependent value (e.g. event detail is green if upcoming, yellow if
 * past) for everything it wraps. The two can differ for event detail pages —
 * an accepted, narrow simplification: the header's decorative wordmark color
 * isn't worth a client fetch to get exactly right.
 */
export function routeAccentFromPathname(pathname: string): AccentColor {
  if (pathname === "/" ) return "blue";
  if (pathname.startsWith("/events")) return "green";
  if (pathname.startsWith("/about")) return "yellow";
  return "red";
}
