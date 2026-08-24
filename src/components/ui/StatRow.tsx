import { strings } from "@/lib/strings";

type Props = {
  members: number;
  eventsHosted: number;
  yearsRunning: number;
};

/**
 * Design-Philosophy.md §8 "Stat row" — numbers large in Sans 700, labels small
 * in Mono. Shared between the home page's "who we are" block and About, which
 * §8 names as the two places these belong.
 *
 * Explicit "en-IN" locale, matching format-event.ts — a bare `.toLocaleString()`
 * would follow the server's ambient ICU default, which is not guaranteed to be
 * the same as the client's.
 */
const numberFormat = new Intl.NumberFormat("en-IN");

export function StatRow({ members, eventsHosted, yearsRunning }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
      <Stat value={numberFormat.format(members)} label={strings.stats.members} />
      <Stat value={numberFormat.format(eventsHosted)} label={strings.stats.eventsHosted} />
      <Stat value={numberFormat.format(yearsRunning)} label={strings.stats.yearsRunning} />
    </div>
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
