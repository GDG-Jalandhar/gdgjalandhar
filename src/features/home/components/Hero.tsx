import { Notch } from "@/components/notch/Notch";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/glyphs/Glyph";
import { fetchEventList } from "@/lib/gdg/client";
import { formatEventDateTimeRange, venueOrOnline } from "@/lib/gdg/format-event";
import { chapter } from "@/data/chapter";
import { strings } from "@/lib/strings";

// H-1/H-2: the hero is the next upcoming event, never an empty shell. If
// there's no upcoming event, fall back to the community pitch + Join CTA.
export async function Hero() {
  const upcoming = await fetchEventList("Live");
  const nextEvent = upcoming[0] ?? null;

  if (!nextEvent) {
    return (
      <Notch eyebrow={strings.hero.announcingSoonEyebrow} className="max-w-3xl">
        <h1 className="text-hero text-text">
          Local developers. <span className="font-bold text-accent-text">Building together.</span>
        </h1>
        <p className="mt-4 max-w-md text-body text-text-muted">
          GDG Jalandhar has been running since 2011 — talks, workshops, and a community that shows up.
        </p>
        <div className="mt-8">
          <Button href={chapter.joinUrl} external analyticsEvent={{ name: "join_click", placement: "hero" }}>
            {strings.hero.joinCommunity}
          </Button>
        </div>
        <Glyph name="globe" className="mt-8 h-8 w-8 text-accent" />
      </Notch>
    );
  }

  return (
    <Notch eyebrow={strings.hero.upcomingEyebrow} className="max-w-3xl">
      <h1 className="text-hero text-text">{nextEvent.title}</h1>
      <div className="mt-4 flex flex-col gap-1 font-mono text-meta text-text-muted">
        <span>{formatEventDateTimeRange(nextEvent)}</span>
        <span>{venueOrOnline(nextEvent)}</span>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href={nextEvent.registration.url} external analyticsEvent={{ name: "rsvp_click", slug: nextEvent.slug }}>
          {strings.hero.rsvp}
        </Button>
        <Button href={`/events/${nextEvent.slug}`} variant="secondary">
          {strings.hero.details}
        </Button>
      </div>
    </Notch>
  );
}
