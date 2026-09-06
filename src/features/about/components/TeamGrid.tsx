import { TeamCard } from "./TeamCard";
import { PersonGrid } from "@/components/people/PersonGrid";
import { fetchTeam } from "@/lib/gdg/client";
import { team as teamFallback } from "@/data/team";

/**
 * The team, live from Bevy so the site and the chapter page can't drift apart —
 * the same reasoning (and the same static-fallback shape) as `ChapterIntro`.
 *
 * `fetchTeam` returns null rather than an empty array on any failure, which is
 * what makes the fallback unambiguous here.
 */
export async function TeamGrid() {
  const members = (await fetchTeam()) ?? teamFallback;

  return (
    <PersonGrid>
      {members.map((member) => (
        <TeamCard key={member.name} member={member} />
      ))}
    </PersonGrid>
  );
}
