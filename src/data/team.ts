import type { GdgTeamMember } from "@/lib/gdg/types";

/**
 * FALLBACKS ONLY — not the displayed values. The team renders live from Bevy's
 * `chapter_slim/<slug>/team/` endpoint (`fetchTeam`); this is what shows if that
 * call fails, so an outage degrades to a stale roster rather than an empty
 * section. Refresh it when the team changes, but don't rely on it.
 *
 * A-2 / A-2a / A-2b — "GDG Organizer" (never "GDG Lead"); the badge is for the
 * two Organizers only, Graphics Designer and Event Manager render as plain Mono
 * role text. Photos are null here because Bevy is the only place they live.
 */
export const team: GdgTeamMember[] = [
  { name: "Simar Preet Singh", title: "", secondaryTitle: "", photo: null, isOrganizer: true },
  { name: "Amanpreet Kaur", title: "", secondaryTitle: "", photo: null, isOrganizer: true },
  { name: "Qazi Zaid", title: "Graphics Designer", secondaryTitle: "", photo: null, isOrganizer: false },
  { name: "Veer Pratap Singh", title: "Event Manager", secondaryTitle: "", photo: null, isOrganizer: false },
];
