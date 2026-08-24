import { Prose } from "@/components/ui/Prose";
import { StatRow } from "@/components/ui/StatRow";
import { chapter } from "@/data/chapter";
import { fetchChapter, fetchEventList } from "@/lib/gdg/client";
import { yearsSince } from "@/lib/format";

/**
 * The chapter's own description straight from its Bevy profile, plus the stat
 * row (Design-Philosophy §8 puts these above the fold on About).
 *
 * The description is organizer-authored rich text — `normalizeChapter` has
 * already sanitized it and dropped the self-referential "Mail / Website / Our
 * Team" block, so `Prose` only has to render it.
 *
 * `fetchChapter` never throws, so a Bevy outage falls back to the hardcoded
 * copy rather than leaving About with a heading and nothing under it.
 */
export async function ChapterIntro() {
  const [live, upcoming, past] = await Promise.all([
    fetchChapter(),
    fetchEventList("Live"),
    fetchEventList("Completed"),
  ]);

  const descriptionHtml = live?.descriptionHtml || chapter.descriptionFallbackHtml;

  return (
    <div className="flex flex-col gap-8">
      <Prose html={descriptionHtml} />
      <StatRow
        members={live?.membersCount ?? chapter.memberCountFallback}
        eventsHosted={upcoming.length + past.length}
        yearsRunning={yearsSince()}
      />
    </div>
  );
}
