import type { ReactNode } from "react";

/**
 * The layout every person grid uses — event speakers, event judges, the About
 * team, and the team's own loading skeleton. Shared so those four can't drift
 * into four slightly different column counts and gutters.
 *
 * Container queries, not viewport breakpoints, because the two surfaces give
 * this grid very different widths at the same viewport: the event detail column
 * is capped at `max-w-3xl` (~752px of content) while About runs to ~1076px. A
 * viewport-based `lg:grid-cols-4` puts four cards in the event page's 752px on
 * any desktop screen, which is ~170px per card — narrow enough that a two-word
 * name wraps. Sizing off the container gives the event page three and About
 * four, which is what each actually has room for.
 */
export function PersonGrid({ children }: { children: ReactNode }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 gap-4 @md:grid-cols-3 @md:gap-5 @4xl:grid-cols-4">
        {children}
      </div>
    </div>
  );
}
