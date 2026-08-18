"use client";

import { useState } from "react";
import { EventCard } from "@/features/events/components/EventCard";
import { Button } from "@/components/ui/Button";
import { strings } from "@/lib/strings";
import type { GdgEvent } from "@/lib/gdg/types";

const PAGE_SIZE = 12;

type Props = {
  events: GdgEvent[];
  tab: "upcoming" | "past";
};

// E-4: fetched once server-side (page_size=100), paginated client-side via
// an explicit "Load more" button, 12 at a time.
export function EventList({ events, tab }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (events.length === 0) {
    return (
      <div className="rounded-card border border-hairline bg-surface p-8 text-center text-body text-text-muted md:rounded-card-lg">
        {tab === "upcoming" ? strings.events.emptyUpcoming : strings.events.emptyPast}
      </div>
    );
  }

  const visible = events.slice(0, visibleCount);
  const hasMore = visibleCount < events.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((event, i) => (
          <EventCard key={event.slug} event={event} priority={i === 0} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            {strings.events.loadMore}
          </Button>
        </div>
      )}
    </div>
  );
}
