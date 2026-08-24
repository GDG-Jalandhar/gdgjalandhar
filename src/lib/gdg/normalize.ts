import "server-only";
import { CHAPTER_ID } from "./constants";
import { parseAgenda } from "./agenda-parser";
import { sanitizeEventHtml } from "./sanitize";
import { stripContactParagraphs } from "./chapter-description";
import type { RawChapter, RawEventDetail, RawEventListItem } from "./schema";
import type { GdgChapter, GdgEvent } from "./types";

// Bevy ships TWO different placeholder markers, and they don't agree with each
// other: measured against the live chapter, 7 of the first 100 completed events
// have a placeholder banner but real poster art in `cropped_picture_url`. Cards
// render the thumbnail, detail renders the banner, so each needs its own check.
const DEFAULT_BANNER_MARKER = "GDG_Bevy_DefaultEventBanner";
const DEFAULT_THUMBNAIL_MARKER = "GDG_Bevy_DefaultEventThumbnail";

/** D-7: custom_tickets_url → cohost_registration_url → url. */
function registrationUrl(event: Pick<RawEventDetail, "custom_tickets_url" | "cohost_registration_url" | "url" | "use_external_ticketing">): string {
  if (event.use_external_ticketing && event.custom_tickets_url) return event.custom_tickets_url;
  if (event.cohost_registration_url) return event.cohost_registration_url;
  return event.url;
}

function status(startDate: Date, completed: boolean): "upcoming" | "past" {
  return completed || startDate.getTime() < Date.now() ? "past" : "upcoming";
}

/**
 * Maps a raw Bevy `event_slim` detail object to the normalized `GdgEvent`
 * shape (PRD §6.6 D-12) — nothing raw escapes this module. Also applies:
 * D-6 default-banner detection, D-8 attendee-alone-never-a-ratio, D-9 hidden
 * filtering (the caller's job — see `fetchEventList`/`fetchEventDetail`),
 * D-10 cohost detection.
 */
export function normalizeEventDetail(raw: RawEventDetail): GdgEvent {
  const startAt = new Date(raw.start_date);
  const endAt = raw.end_date ? new Date(raw.end_date) : null;
  const banner = raw.cropped_banner_url ?? raw.banner ?? "";
  const thumbnail = raw.cropped_picture_url ?? banner;
  const isDefaultBanner = banner.includes(DEFAULT_BANNER_MARKER);

  const agenda = raw.hide_agenda_on_event_page ? null : parseAgenda(raw.agenda);

  const venue =
    raw.venue_name || raw.venue_address
      ? {
          name: raw.venue_name ?? "",
          address: raw.venue_address ?? "",
          city: raw.venue_city ?? "",
          state: raw.venue_state ?? "",
          zip: raw.venue_zip_code ?? "",
          showMap: raw.show_map,
        }
      : null;

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.description_short ?? "",
    descriptionHtml: sanitizeEventHtml(raw.description),
    startAt,
    endAt,
    timezone: raw.event_timezone,
    tzAbbr: raw.timezone_abbreviation,
    status: status(startAt, raw.completed),
    audience: raw.audience_type,
    venue,
    virtualUrl: raw.join_virtual_event_url ?? raw.virtual_venue_link ?? null,
    registration: {
      label: raw.event_type_title,
      required: raw.registration_required,
      rsvpOnly: raw.rsvp_only,
      guestAllowed: raw.allow_registration_as_a_guest,
      url: registrationUrl(raw),
    },
    // D-8: never a ratio against capacity — shown alone, and only when > 0.
    attendees: raw.total_attendees && raw.total_attendees > 0 ? raw.total_attendees : null,
    tags: raw.tags,
    agenda,
    media: {
      banner,
      thumbnail,
      isDefaultBanner,
      isDefaultThumbnail: thumbnail.includes(DEFAULT_THUMBNAIL_MARKER),
      videoUrl: raw.video_url ?? null,
      slidesUrl: raw.slideshare_url ?? null,
    },
    share: {
      enabled: !raw.sharing_disabled,
      url: raw.static_url,
    },
    cohost: {
      chapterId: raw.chapter_id,
      chapterTitle: raw.chapter_title,
      chapterUrl: raw.chapter_url,
      isOurs: raw.chapter_id === CHAPTER_ID,
    },
    bevyUrl: raw.url,
  };
}

/**
 * The list endpoint's slimmer field set doesn't carry everything a detail
 * page needs — this seeds a detail page's first paint from the already-
 * fetched list item (D-2) with the fields the list actually has, defaulting
 * the rest to something safe.
 */
export function normalizeEventListItem(raw: RawEventListItem): GdgEvent {
  const startAt = new Date(raw.start_date);
  const endAt = raw.end_date ? new Date(raw.end_date) : null;
  const banner = raw.cropped_banner_url ?? "";
  const thumbnail = raw.cropped_picture_url ?? banner;

  const venue =
    raw.venue_name
      ? { name: raw.venue_name, address: "", city: raw.venue_city ?? "", state: "", zip: "", showMap: true }
      : null;

  return {
    id: 0,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.description_short ?? "",
    descriptionHtml: "",
    startAt,
    endAt,
    timezone: raw.event_timezone,
    tzAbbr: "",
    status: startAt.getTime() < Date.now() ? "past" : "upcoming",
    audience: raw.audience_type,
    venue,
    virtualUrl: null,
    registration: {
      label: raw.event_type_title,
      required: true,
      rsvpOnly: false,
      guestAllowed: true,
      url: raw.cohost_registration_url ?? raw.url,
    },
    attendees: null,
    tags: raw.tags,
    agenda: null,
    media: {
      banner,
      thumbnail,
      isDefaultBanner: banner.includes(DEFAULT_BANNER_MARKER),
      isDefaultThumbnail: thumbnail.includes(DEFAULT_THUMBNAIL_MARKER),
      videoUrl: null,
      slidesUrl: null,
    },
    share: { enabled: true, url: raw.url },
    cohost: {
      chapterId: raw.chapter_id,
      chapterTitle: raw.chapter_title,
      chapterUrl: "",
      isOurs: raw.chapter_id === CHAPTER_ID,
    },
    bevyUrl: raw.url,
  };
}

/**
 * Maps Bevy's `chapter_slim` object to `GdgChapter`. The description is
 * organizer-authored HTML with the same hazards as an event description, so it
 * goes through the same sanitizer, then `stripContactParagraphs` removes the
 * self-referential contact block (see that module for why).
 */
export function normalizeChapter(raw: RawChapter): GdgChapter {
  return {
    id: raw.id,
    title: raw.title,
    membersCount: raw.members_count,
    descriptionHtml: stripContactParagraphs(sanitizeEventHtml(raw.description)),
  };
}
