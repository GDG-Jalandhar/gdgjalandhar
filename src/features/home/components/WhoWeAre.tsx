import { StatRow } from "@/components/ui/StatRow";
import { chapter } from "@/data/chapter";
import { fetchChapter, fetchEventList } from "@/lib/gdg/client";
import { yearsSince } from "@/lib/format";
import { strings } from "@/lib/strings";

// H-4/H-4a/H-4b: 2–3 sentences plus the three chapter stats. All three are now
// live: members from Bevy's chapter profile, events hosted from the event list
// itself, years running derived from the founding date.
//
// H-4a originally forbade deriving "events hosted" from the API, on the grounds
// that the filtered list undercounts the stated 122 and two contradictory
// numbers read as a bug. That predates /events rendering every past event — a
// visitor can now count them, so a stated figure is the thing that looks wrong.
// Reversal recorded in the PRD.
//
// The three list fetches below are the same URLs Hero/WhatsNext/Recently
// already request, so Next's per-render dedup plus ISR makes them free here.
export async function WhoWeAre() {
  const [live, upcoming, past] = await Promise.all([
    fetchChapter(),
    fetchEventList("Live"),
    fetchEventList("Completed"),
  ]);

  return (
    <section className="flex flex-col gap-6">
      <p className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">
        {strings.home.whoWeAreEyebrow}
      </p>
      <p className="max-w-2xl text-body text-text-muted">
        {chapter.fullName} is a local community of developers, designers, and students in Punjab —
        beginners explicitly welcome. We run talks, workshops, and hands-on sessions on everything
        from Android to AI, for anyone curious enough to show up.
      </p>
      <StatRow
        // `fetchChapter` returns null rather than throwing, so a Bevy outage
        // shows a stale count instead of taking down the page.
        members={live?.membersCount ?? chapter.memberCountFallback}
        eventsHosted={upcoming.length + past.length}
        yearsRunning={yearsSince()}
      />
    </section>
  );
}
