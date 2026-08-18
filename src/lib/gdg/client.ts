import "server-only";
import { CHAPTER_ID, GDG_API_BASE } from "./constants";
import { eventListEnvelopeSchema, rawEventDetailSchema } from "./schema";
import { normalizeEventDetail, normalizeEventListItem } from "./normalize";
import type { GdgEvent } from "./types";

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
