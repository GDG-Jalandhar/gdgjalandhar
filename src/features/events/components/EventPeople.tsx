import { PersonCard } from "@/components/people/PersonCard";
import { PersonGrid } from "@/components/people/PersonGrid";
import type { GdgPersonGroup } from "@/lib/gdg/types";

/**
 * Speakers, judges, mentors, panelists — whoever Bevy has attached to this
 * event, one section per role.
 *
 * Grouping by role rather than mixing everyone into one list is the point: on
 * this chapter a hackathon's three judges and a DevFest's seven speakers are
 * different kinds of information, and the eyebrow heading is what says which is
 * which. Group ordering and labels (including the fallback for a role Bevy adds
 * later) live in `lib/gdg/format-people.ts`.
 *
 * Returns null when there's nobody — the same self-suppressing contract every
 * other detail section follows, so the page needs no conditional wrapper.
 */
export function EventPeople({ groups }: { groups: GdgPersonGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group.role} className="flex flex-col gap-6">
          <h2 className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">
            {`// ${group.label}`}
          </h2>
          <PersonGrid>
            {group.people.map((person) => (
              <PersonCard
                key={person.id}
                name={person.name}
                photo={person.photo}
                // Title and company get their own lines rather than being joined
                // with a comma. Real titles are long — "Senior Technical Content
                // Writer" at Mem0 — and one joined string wraps to four ragged
                // centered lines in a card this wide. Either half can be blank.
                title={person.title}
                secondaryTitle={person.company}
                bioHtml={person.bioHtml}
                twitter={person.twitter}
                linkedin={person.linkedin}
              />
            ))}
          </PersonGrid>
        </section>
      ))}
    </div>
  );
}
