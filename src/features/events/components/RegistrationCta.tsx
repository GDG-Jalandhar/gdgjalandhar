import { Button } from "@/components/ui/Button";
import { strings } from "@/lib/strings";
import type { GdgEvent } from "@/lib/gdg/types";

type Props = {
  event: GdgEvent;
};

// D-6/D-7/D-8: upcoming events get the registration CTA (target already
// resolved by normalize.ts's D-7 precedence); past events get "View on GDG
// Community" plus recap links when present. Attendee count shown alone,
// never as a ratio against capacity.
export function RegistrationCta({ event }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-meta uppercase text-text-muted">{event.registration.label}</p>
      <div className="flex flex-wrap gap-4">
        {event.status === "upcoming" ? (
          <Button href={event.registration.url} external analyticsEvent={{ name: "rsvp_click", slug: event.slug }}>
            {strings.hero.rsvp}
          </Button>
        ) : (
          <Button href={event.bevyUrl} external variant="secondary">
            {strings.eventDetail.viewOnGdgCommunity}
          </Button>
        )}
        {event.media.videoUrl && (
          <Button href={event.media.videoUrl} external variant="ghost">
            Watch recording
          </Button>
        )}
        {event.media.slidesUrl && (
          <Button href={event.media.slidesUrl} external variant="ghost">
            View slides
          </Button>
        )}
      </div>
      {event.attendees !== null && (
        <p className="font-mono text-meta text-text-muted">{event.attendees} attending</p>
      )}
    </div>
  );
}
