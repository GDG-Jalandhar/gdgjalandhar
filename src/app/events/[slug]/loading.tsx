export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl animate-pulse flex-col gap-10 px-5 py-16 md:px-8 md:py-24">
      <div className="flex flex-col gap-3">
        <div className="h-4 w-20 rounded bg-surface" />
        <div className="h-10 w-3/4 rounded bg-surface" />
        <div className="h-4 w-1/2 rounded bg-surface" />
      </div>
      <div className="aspect-video rounded-lg bg-surface" />
      <div className="h-24 rounded bg-surface" />
    </div>
  );
}
