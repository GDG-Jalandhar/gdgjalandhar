export function StripSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 md:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-64 rounded-card border border-hairline bg-surface md:rounded-card-lg" />
      ))}
    </div>
  );
}
