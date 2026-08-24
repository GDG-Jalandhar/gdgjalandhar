// Sized to the real block (a few prose paragraphs, then the stat row) so the
// team grid below doesn't jump when the chapter fetch lands.
export function ChapterIntroSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8">
      <div className="flex max-w-[68ch] flex-col gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-4 rounded bg-surface ${i % 3 === 2 ? "w-2/3" : ""}`} />
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="h-7 w-20 rounded bg-surface" />
            <div className="h-3 w-16 rounded bg-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
