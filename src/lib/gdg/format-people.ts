import { strings } from "@/lib/strings";
import type { GdgPerson, GdgPersonGroup, GdgSponsor, GdgSponsorGroup } from "./types";

/**
 * Display helpers for `event_person` / `event_sponsor` data — kept out of
 * `normalize.ts` for the same reason `format-event.ts` is: normalization maps
 * the wire shape, presentation decides what a reader sees.
 *
 * Both Bevy fields these operate on are OPEN vocabularies. Six `role` values
 * have been observed on this chapter and Bevy's own settings define more, so
 * nothing here may assume a closed set: an unrecognised slug is titleized and
 * shown, never dropped.
 */

const roleLabels: Record<string, string> = strings.eventDetail.roleLabels;
const sponsorTypeLabels: Record<string, string> = strings.eventDetail.sponsorTypeLabels;

/** `"guest_emcee"` → `"Guest Emcee"`. The fallback for an unmapped slug. */
function titleize(slug: string): string {
  return slug
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function roleLabel(role: string): string {
  return roleLabels[role] ?? titleize(role);
}

export function sponsorTypeLabel(type: string): string {
  return sponsorTypeLabels[type] ?? titleize(type);
}

// Reading order for the sections, most-prominent first. Every label in the
// vocabulary pluralizes with a plain "s", which is what the headings do.
const ROLE_ORDER = [
  "speaker",
  "host",
  "moderator",
  "panelist",
  "judge",
  "mentor",
  "facilitator",
  "organizer",
  "partner",
];

const SPONSOR_TYPE_ORDER = ["global_sponsor", "sponsor", "local_sponsor", "partner", "media_partner"];

/**
 * Orders group keys by an explicit precedence list, appending anything
 * unrecognised alphabetically after it — so a role Bevy adds tomorrow lands at
 * the end of the page instead of silently jumping to the top.
 */
function orderKeys(keys: string[], precedence: string[]): string[] {
  const known = precedence.filter((key) => keys.includes(key));
  const unknown = keys.filter((key) => !precedence.includes(key)).sort();
  return [...known, ...unknown];
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const bucket = groups.get(key(item));
    if (bucket) bucket.push(item);
    else groups.set(key(item), [item]);
  }
  return groups;
}

/**
 * One group per role present. Within a group the input order is preserved,
 * which `normalizeEventPeople` has already sorted by Bevy's `order` field.
 */
export function groupPeopleByRole(people: GdgPerson[]): GdgPersonGroup[] {
  const groups = groupBy(people, (person) => person.role);
  return orderKeys([...groups.keys()], ROLE_ORDER).map((role) => ({
    role,
    label: `${roleLabel(role)}s`,
    people: groups.get(role) ?? [],
  }));
}

/**
 * One group per sponsor type. The request sends `order_by=sponsor_type`, but
 * the grouping is redone here rather than trusted — the same stance `client.ts`
 * takes toward the server-side `order` param on the event lists.
 */
export function groupSponsorsByType(sponsors: GdgSponsor[]): GdgSponsorGroup[] {
  const groups = groupBy(sponsors, (sponsor) => sponsor.type);
  return orderKeys([...groups.keys()], SPONSOR_TYPE_ORDER).map((type) => ({
    type,
    label: `${sponsorTypeLabel(type)}s`,
    sponsors: groups.get(type) ?? [],
  }));
}
