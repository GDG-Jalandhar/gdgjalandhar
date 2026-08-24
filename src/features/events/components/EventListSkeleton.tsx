// E-5: sized to the real card so nothing shifts once data lands. Built from
// the same primitives EventCard uses (square poster box, then title and meta
// lines) rather than a magic height, so it stays correct if the ratio moves.
export function EventListSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-card border border-hairline bg-surface px-6 pb-6 pt-16 md:rounded-card-lg md:px-8 md:pb-8 md:pt-20"
        >
          <div className="aspect-square rounded-lg bg-surface-2" />
          <div className="h-5 rounded bg-surface-2" />
          <div className="h-5 w-2/3 rounded bg-surface-2" />
          <div className="mt-auto flex flex-col gap-1">
            <div className="h-3 w-1/2 rounded bg-surface-2" />
            <div className="h-3 w-1/3 rounded bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
