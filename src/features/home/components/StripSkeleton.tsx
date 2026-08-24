// Mirrors EventCard's own box (notch padding, square poster, title, meta) so the
// home strips don't shift when the real cards land.
export function StripSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 md:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-card border border-hairline bg-surface px-6 pb-6 pt-16 md:rounded-card-lg md:px-8 md:pb-8 md:pt-20"
        >
          <div className="aspect-square rounded-lg bg-surface-2" />
          <div className="h-5 rounded bg-surface-2" />
          <div className="h-5 w-2/3 rounded bg-surface-2" />
          <div className="mt-auto h-3 w-1/2 rounded bg-surface-2" />
        </div>
      ))}
    </div>
  );
}
