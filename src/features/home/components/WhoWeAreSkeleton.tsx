// Sized to the real block (eyebrow, three body lines, stat row) so nothing
// shifts once the chapter fetch lands.
export function WhoWeAreSkeleton() {
  return (
    <section className="flex animate-pulse flex-col gap-6">
      <div className="h-3 w-32 rounded bg-surface" />
      <div className="flex max-w-2xl flex-col gap-2">
        <div className="h-4 rounded bg-surface" />
        <div className="h-4 rounded bg-surface" />
        <div className="h-4 w-2/3 rounded bg-surface" />
      </div>
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="h-7 w-20 rounded bg-surface" />
            <div className="h-3 w-16 rounded bg-surface" />
          </div>
        ))}
      </div>
    </section>
  );
}
