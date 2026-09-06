import { PersonGrid } from "@/components/people/PersonGrid";

// Mirrors the real card's geometry — same grid, same border and padding, an
// 80/96px avatar and two short text lines — so the "Get involved" block below
// doesn't jump when the team resolves.
export function TeamGridSkeleton() {
  return (
    <div aria-hidden="true">
      <PersonGrid>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col items-center gap-3 rounded-card border border-hairline bg-surface p-4"
          >
            <div className="h-20 w-20 rounded-2xl bg-surface-2 sm:h-24 sm:w-24" />
            <div className="h-3.5 w-24 rounded bg-surface-2" />
            <div className="h-3 w-16 rounded bg-surface-2" />
          </div>
        ))}
      </PersonGrid>
    </div>
  );
}
