import type { TeamMember } from "@/data/team";

// A-2c: chevron-wedge placeholder avatar for anyone whose photo isn't ready
// — not a launch blocker. A-2b: the Organizer badge applies to organizers
// only; other roles render as plain Mono text, no invented badge tiers.
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-[1.5px] border-accent bg-surface">
        <div className="absolute -left-3 -top-3 h-10 w-10 rotate-45 bg-accent-soft" />
        <span className="text-h2 font-bold text-accent-text">{member.name.charAt(0)}</span>
      </div>
      <div>
        <p className="text-body font-bold text-text">{member.name}</p>
        {member.badge === "organizer" ? (
          <span className="mt-1 inline-block rounded-full border border-accent px-2.5 py-0.5 font-mono text-meta uppercase text-accent-text">
            {member.title}
          </span>
        ) : (
          <p className="font-mono text-meta uppercase text-text-muted">{member.title}</p>
        )}
      </div>
    </div>
  );
}
