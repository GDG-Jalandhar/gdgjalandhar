import "server-only";
import { CHAPTER_ID, CHAPTER_SLUG, GDG_API_BASE } from "./constants";
import {
  eventListEnvelopeSchema,
  eventPersonEnvelopeSchema,
  eventSponsorEnvelopeSchema,
  rawChapterSchema,
  rawEventDetailSchema,
  rawTeamSchema,
} from "./schema";
import {
  normalizeChapter,
  normalizeEventDetail,
  normalizeEventListItem,
  normalizeEventPeople,
  normalizeEventSponsors,
  normalizeTeam,
} from "./normalize";
import type { GdgChapter, GdgEvent, GdgPerson, GdgSponsor, GdgTeamMember } from "./types";

export class GdgApiError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "GdgApiError";
  }
}

// PRD §6.3 — `slug` is added (the sample query omits it, and it's the field
// routing depends on); `description` is dropped (full HTML body, the detail
// endpoint supplies it — dead payload across a whole list on a phone).
const LIST_FIELDS = [
  "slug", "title", "start_date", "end_date", "event_timezone", "event_type_title",
  "audience_type", "venue_name", "venue_city", "cropped_picture_url",
  "cropped_banner_url", "url", "cohost_registration_url", "description_short",
  "tags", "is_hidden", "chapter_id", "chapter_title",
].join(",");

type ListStatus = "Live" | "Completed";

async function fetchAllPages(status: ListStatus, revalidate: number): Promise<unknown[]> {
  const order = status === "Live" ? "start_date" : "-start_date";
  const params = new URLSearchParams({
    status,
    order,
    include_cohosted_events: "true",
    visible_on_parent_chapter_only: "true",
    page_size: "100",
    fields: LIST_FIELDS,
  });

  const results: unknown[] = [];
  let url: string | null = `${GDG_API_BASE}/event_slim/for_chapter/${CHAPTER_ID}/?${params.toString()}`;

  while (url) {
    const res: Response = await fetch(url, { next: { revalidate } });
    if (!res.ok) throw new GdgApiError(`event_slim list request failed: ${res.status}`);
    const json = await res.json();
    const envelope = eventListEnvelopeSchema.safeParse(json);
    if (!envelope.success) throw new GdgApiError("event_slim list response failed validation", envelope.error);

    // D-9: filter hidden events at the boundary, on both lists.
    results.push(...envelope.data.results.filter((r) => !r.is_hidden));

    // `pagination.page_size` echoes a server default, not the requested
    // value — paginate using `links.next` / `count` instead (PRD §6.2).
    url = envelope.data.links.next;
  }

  return results;
}

export async function fetchEventList(status: ListStatus): Promise<GdgEvent[]> {
  const revalidate = 300; // ISR: lists refresh every 5 minutes (PRD §7.2)
  const raw = await fetchAllPages(status, revalidate);
  return raw.map((item) => normalizeEventListItem(item as Parameters<typeof normalizeEventListItem>[0]));
}

export async function fetchEventDetail(slug: string): Promise<GdgEvent | null> {
  const res = await fetch(`${GDG_API_BASE}/event_slim/${slug}/`, { next: { revalidate: 3600 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new GdgApiError(`event_slim detail request failed: ${res.status}`);

  const json = await res.json();
  const parsed = rawEventDetailSchema.safeParse(json);
  if (!parsed.success) throw new GdgApiError(`event_slim detail response failed validation for "${slug}"`, parsed.error);

  // D-9: a hidden event is a 404 from the site's perspective.
  if (parsed.data.is_hidden) return null;

  return normalizeEventDetail(parsed.data);
}

/**
 * The chapter profile — member count and the organizer-authored description.
 *
 * Deliberately does NOT follow the throw-on-failure convention the two event
 * fetches above use. Nothing here is load-bearing: the member count is a
 * decorative stat and the description has a hardcoded fallback, so a Bevy
 * outage must not be able to take down the home page or About over it. Returns
 * null on ANY failure — network, non-200, or schema drift — and callers fall
 * back to `src/data/chapter.ts`. Same never-throw contract as `parseAgenda`.
 *
 * Note the endpoint is keyed by SLUG: `/api/chapter_slim/781/` 404s, and
 * `/api/chapter/781/` is 403. See constants.ts.
 */
export async function fetchChapter(): Promise<GdgChapter | null> {
  try {
    const res = await fetch(`${GDG_API_BASE}/chapter_slim/${CHAPTER_SLUG}/`, {
      next: { revalidate: 3600 }, // a member count and a chapter blurb both move slowly
    });
    if (!res.ok) return null;

    const parsed = rawChapterSchema.safeParse(await res.json());
    return parsed.success ? normalizeChapter(parsed.data) : null;
  } catch {
    return null;
  }
}

/*
 * Enrichment fetches — speakers/judges/mentors, sponsors, and the chapter team.
 *
 * All three follow `fetchChapter`'s never-throw contract rather than the
 * throw-on-failure convention the event fetches use, and for the same reason:
 * none of this is load-bearing. An event page whose speaker list failed to load
 * is still a complete, correct event page, so a Bevy outage must not be able to
 * turn one into a 500. Failures return an empty list (or null for the team,
 * which has a static fallback) and the section simply doesn't render.
 *
 * All three revalidate hourly — a speaker roster moves at least as slowly as
 * the event detail it hangs off.
 */

/**
 * The people attached to an event: speakers, judges, mentors, panelists,
 * moderators, hosts — the `role` vocabulary is open, see schema.ts.
 *
 * Keyed by SLUG. Passing the numeric event id returns `count: 0` with a 200,
 * so a mistake here looks exactly like an event with no speakers and nothing
 * in the logs explains it. Note this is the OPPOSITE key from
 * `fetchEventSponsors` below.
 */
export async function fetchEventPeople(slug: string): Promise<GdgPerson[]> {
  try {
    const params = new URLSearchParams({ event: slug });
    const res = await fetch(`${GDG_API_BASE}/event_person/?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const parsed = eventPersonEnvelopeSchema.safeParse(await res.json());
    return parsed.success ? normalizeEventPeople(parsed.data.results) : [];
  } catch {
    return [];
  }
}

/**
 * An event's sponsors and partners.
 *
 * Keyed by NUMERIC ID — the opposite of `fetchEventPeople`. Passing a slug is a
 * hard HTTP 400. Since only `normalizeEventDetail` carries a real id
 * (`normalizeEventListItem` defaults it to 0), the guard below keeps a
 * list-derived event from issuing a request that can only fail.
 */
export async function fetchEventSponsors(eventId: number): Promise<GdgSponsor[]> {
  if (!eventId) return [];

  try {
    const params = new URLSearchParams({ event_id: String(eventId), order_by: "sponsor_type" });
    const res = await fetch(`${GDG_API_BASE}/event_sponsor/?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const parsed = eventSponsorEnvelopeSchema.safeParse(await res.json());
    return parsed.success ? normalizeEventSponsors(parsed.data.results) : [];
  } catch {
    return [];
  }
}

/**
 * The chapter's organizers. Keyed by slug, like the chapter profile.
 *
 * Returns a BARE ARRAY upstream — no `links`/`count`/`results` envelope, unlike
 * every other list endpoint here.
 *
 * Returns `null` rather than `[]` on failure so the caller can tell "Bevy is
 * unreachable, use the static roster in `src/data/team.ts`" apart from "the
 * chapter genuinely lists nobody" — which for this chapter would itself be a
 * bug worth showing the fallback for.
 */
export async function fetchTeam(): Promise<GdgTeamMember[] | null> {
  try {
    const res = await fetch(`${GDG_API_BASE}/chapter_slim/${CHAPTER_SLUG}/team/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const parsed = rawTeamSchema.safeParse(await res.json());
    if (!parsed.success || parsed.data.length === 0) return null;

    return normalizeTeam(parsed.data);
  } catch {
    return null;
  }
}
