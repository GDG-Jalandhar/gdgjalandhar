export type AgendaRow = {
  time: string; // display string in event-local time, e.g. "1:40 PM" — never parsed, never sorted
  activity: string;
  description: string;
  audienceType: "IN_PERSON" | "VIRTUAL" | "HYBRID";
};

export type AgendaDay = {
  title: string;
  rows: AgendaRow[];
};

export type Agenda = {
  multiday: boolean;
  days: AgendaDay[];
};

// The normalized shape every component works with — nothing raw from Bevy
// escapes `normalize.ts` (PRD §6.6 D-12).
export type GdgEvent = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  descriptionHtml: string; // sanitized
  startAt: Date;
  endAt: Date | null;
  timezone: string; // IANA, from event_timezone
  tzAbbr: string;
  status: "upcoming" | "past";
  audience: "IN_PERSON" | "VIRTUAL" | "HYBRID";
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    showMap: boolean;
  } | null;
  virtualUrl: string | null;
  registration: {
    label: string;
    required: boolean;
    rsvpOnly: boolean;
    guestAllowed: boolean;
    url: string;
  };
  attendees: number | null;
  tags: string[];
  agenda: Agenda | null; // null when absent, hidden, empty, or unparseable
  media: {
    banner: string; // 4:1 (2560x640) — detail page
    thumbnail: string; // 1:1 (1000x1000) — cards
    // Two separate flags because Bevy uses two DIFFERENT placeholder markers
    // (`GDG_Bevy_DefaultEventBanner` vs `GDG_Bevy_DefaultEventThumbnail`), and
    // they don't agree: some events ship a placeholder banner but real poster art.
    isDefaultBanner: boolean;
    isDefaultThumbnail: boolean;
    videoUrl: string | null;
    slidesUrl: string | null;
  };
  share: { enabled: boolean; url: string };
  cohost: {
    chapterId: number;
    chapterTitle: string;
    chapterUrl: string;
    isOurs: boolean;
  };
  bevyUrl: string; // the canonical Bevy event page — D-13
};

// The chapter profile, from Bevy's `chapter_slim` endpoint. Same rule as
// GdgEvent: nothing raw from Bevy escapes normalize.ts.
export type GdgChapter = {
  id: number;
  title: string;
  membersCount: number;
  descriptionHtml: string; // sanitized, self-referential contact block stripped
};

/**
 * A speaker, judge, mentor, panelist, moderator, host — whoever Bevy's
 * `event_person` endpoint returns for an event. `role` stays the raw Bevy slug:
 * the vocabulary is open (see schema.ts), so the display label is derived at
 * render time by `format-people.ts` rather than baked in here.
 */
export type GdgPerson = {
  id: number;
  name: string;
  role: string;
  title: string; // job title, "" when absent
  company: string; // "" when absent
  photo: string | null;
};

export type GdgSponsor = {
  id: number;
  company: string;
  logo: string | null;
  type: string; // raw Bevy slug, e.g. "media_partner"
  url: string | null; // parsed but not rendered yet
};

/**
 * A chapter organizer. Bevy carries two title fields that disagree with each
 * other per person — the chapter-team role and the person's own job title —
 * so `normalizeTeam` reconciles them into a primary line, an optional second
 * line, and the Organizer badge flag.
 */
export type GdgTeamMember = {
  name: string;
  title: string;
  secondaryTitle: string; // "" once deduped against `title` and the badge
  photo: string | null;
  isOrganizer: boolean;
};

// Grouping wrappers for the two event-detail sections. `label` is the display
// heading; `role`/`type` stay the raw slug so a group is still identifiable.
export type GdgPersonGroup = { role: string; label: string; people: GdgPerson[] };
export type GdgSponsorGroup = { type: string; label: string; sponsors: GdgSponsor[] };
