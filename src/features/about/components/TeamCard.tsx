import { PersonCard } from "@/components/people/PersonCard";
import type { GdgTeamMember } from "@/lib/gdg/types";

/**
 * A chapter organizer, on About.
 *
 * A-2b: the Organizer badge applies to organizers only — everyone else renders
 * as plain Mono role text, no invented badge tiers. The badge is its own pill
 * rather than a styling of the title line, because Bevy's two title fields
 * disagree about which one holds the role (see `normalizeTeam`), and a pill
 * wrapping whatever happened to land first would read "ANDROID DEVELOPER" as
 * though it were a badge tier.
 */
export function TeamCard({ member }: { member: GdgTeamMember }) {
  return (
    <PersonCard
      name={member.name}
      photo={member.photo}
      title={member.title}
      secondaryTitle={member.secondaryTitle}
      badge={member.isOrganizer ? "Organizer" : undefined}
      bioHtml={member.bioHtml}
      twitter={member.twitter}
    />
  );
}
