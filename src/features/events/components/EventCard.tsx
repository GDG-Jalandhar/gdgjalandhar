import Link from "next/link";
import { Notch } from "@/components/notch/Notch";
import { EventThumbnail } from "@/features/events/components/EventBanner";
import { formatEventDateTimeRange, venueOrOnline } from "@/lib/gdg/format-event";
import type { GdgEvent } from "@/lib/gdg/types";

type Props = {
  event: GdgEvent;
  /** Set on the first card in a list — it's likely the LCP element, and
   * next/image otherwise lazy-loads it (§7.6's LCP budget). */
  priority?: boolean;
};

// Design-Philosophy.md §8 "Event card": notched, eyebrow = status, title →
// Mono date line → Mono venue/mode line, cover in an accent-stroked inner
// frame. The cover is the SQUARE poster (`cropped_picture_url`, 1000x1000),
// not the wide banner: a 2560px banner squeezed into a ~300px card is an 8.5x
// downscale that visibly softens the artwork's type. The detail page, where
// the banner gets real width, still uses it.
// Whole card is one link — no nested anchor for a CTA.
export function EventCard({ event, priority }: Props) {
  const eyebrow = event.status === "upcoming" ? "UPCOMING" : "PAST";

  return (
    <Link href={`/events/${event.slug}`} className="block h-full">
      <Notch eyebrow={eyebrow} size="compact" className="h-full">
        <div className="flex h-full flex-col gap-4">
          <EventThumbnail media={event.media} sizes="(min-width: 768px) 33vw, 90vw" priority={priority} />
          <h3 className="line-clamp-2 text-h3 text-text">{event.title}</h3>
          <div className="mt-auto flex flex-col gap-1 font-mono text-meta text-text-muted">
            <span>{formatEventDateTimeRange(event)}</span>
            <span>{venueOrOnline(event)}</span>
          </div>
        </div>
      </Notch>
    </Link>
  );
}
