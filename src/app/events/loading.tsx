import { EventListSkeleton } from "@/features/events/components/EventListSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-8 px-5 py-16 md:px-8 md:py-24">
      <div className="h-9 w-32 animate-pulse rounded bg-surface" />
      <div className="h-11 w-56 animate-pulse rounded-pill bg-surface" />
      <EventListSkeleton />
    </div>
  );
}
