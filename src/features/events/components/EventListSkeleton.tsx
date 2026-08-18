// E-5: sized to the real card so nothing shifts once data lands.
export function EventListSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-80 rounded-card border border-hairline bg-surface md:rounded-card-lg" />
      ))}
    </div>
  );
}
