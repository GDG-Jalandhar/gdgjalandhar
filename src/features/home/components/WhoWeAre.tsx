import { chapter } from "@/data/chapter";
import { yearsSince } from "@/lib/format";
import { strings } from "@/lib/strings";

// H-4/H-4a/H-4b: 2–3 sentences plus the three chapter stats, held in
// chapter.ts since the API exposes no chapter profile. "Events hosted" is
// the stated 122, never derived from the API's `count`; "years running" is
// derived at render time from the founding date.
export function WhoWeAre() {
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
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
        <Stat value={chapter.memberCount.toLocaleString()} label="Members" />
        <Stat value={String(chapter.eventsHostedStat)} label="Events hosted" />
        <Stat value={String(yearsSince())} label="Years running" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-h2 font-bold text-text">{value}</span>
      <span className="font-mono text-meta uppercase text-text-muted">{label}</span>
    </div>
  );
}
