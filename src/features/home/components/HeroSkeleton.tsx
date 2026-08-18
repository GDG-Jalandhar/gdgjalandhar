export function HeroSkeleton() {
  return (
    <div className="max-w-xl animate-pulse rounded-card border border-hairline bg-surface p-6 md:rounded-card-lg md:p-8">
      <div className="h-10 w-3/4 rounded bg-surface-2" />
      <div className="mt-4 h-4 w-1/2 rounded bg-surface-2" />
      <div className="mt-8 h-12 w-40 rounded-pill bg-surface-2" />
    </div>
  );
}
