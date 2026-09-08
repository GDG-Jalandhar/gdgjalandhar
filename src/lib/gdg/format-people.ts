import { strings } from "@/lib/strings";
import type { GdgPerson, GdgPersonGroup } from "./types";

/**
 * Display helpers for `event_person` data — kept out of `normalize.ts` for the
 * same reason `format-event.ts` is: normalization maps the wire shape,
 * presentation decides what a reader sees.
 *
 * `role` is an OPEN vocabulary. Six values have been observed on this chapter
 * and Bevy's own settings define more, so nothing here may assume a closed set:
 * an unrecognised slug is titleized and shown, never dropped.
 *
 * `sponsor_type` had the same treatment until partners were flattened into one
 * list — see `EventSponsors`.
 */

const roleLabels: Record<string, string> = strings.eventDetail.roleLabels;

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

// Bevy stores socials as bare handles, so the URL is built here. `normalize.ts`
// has already rejected anything that isn't a plain handle, but these stay
// defensive: a bad value should drop the link, never render a broken one.
const HANDLE = /^[A-Za-z0-9_.-]+$/;

function cleanHandle(raw: string | null | undefined): string | null {
  const value = raw?.trim().replace(/^@/, "") ?? "";
  return value && HANDLE.test(value) ? value : null;
}

/** x.com, not twitter.com — it redirects, and the icon set already calls it `x`. */
export function twitterUrl(raw: string | null | undefined): string | null {
  const value = cleanHandle(raw);
  return value && `https://x.com/${value}`;
}

export function linkedinUrl(raw: string | null | undefined): string | null {
  const value = cleanHandle(raw);
  return value && `https://www.linkedin.com/in/${value}`;
}
