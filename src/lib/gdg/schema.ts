import { z } from "zod";

// Raw Bevy `event_slim` shapes — field names match the API exactly (snake_case).
// A parse failure here is the one place API drift surfaces as a typed error
// (PRD §10) instead of silently breaking a page.

export const rawEventDetailSchema = z.object({
  id: z.number(),
  slug: z.string(),
  url: z.string(),
  static_url: z.string(),
  title: z.string(),
  description_short: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  agenda: z.string().nullable().optional(),
  hide_agenda_on_event_page: z.boolean().optional().default(false),
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  event_timezone: z.string(),
  timezone_abbreviation: z.string(),
  event_type_title: z.string(),
  audience_type: z.enum(["IN_PERSON", "VIRTUAL", "HYBRID"]),
  is_virtual_event: z.boolean().optional().default(false),
  join_virtual_event_url: z.string().nullable().optional(),
  virtual_venue_link: z.string().nullable().optional(),
  venue_name: z.string().nullable().optional(),
  venue_address: z.string().nullable().optional(),
  venue_city: z.string().nullable().optional(),
  venue_state: z.string().nullable().optional(),
  venue_zip_code: z.string().nullable().optional(),
  show_map: z.boolean().optional().default(true),
  banner: z.string().nullable().optional(),
  cropped_banner_url: z.string().nullable().optional(),
  cropped_picture_url: z.string().nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
  video_url: z.string().nullable().optional(),
  slideshare_url: z.string().nullable().optional(),
  registration_required: z.boolean().optional().default(false),
  rsvp_only: z.boolean().optional().default(false),
  allow_registration_as_a_guest: z.boolean().optional().default(true),
  total_attendees: z.number().nullable().optional(),
  total_capacity: z.number().nullable().optional(),
  use_external_ticketing: z.boolean().optional().default(false),
  custom_tickets_url: z.string().nullable().optional(),
  is_hidden: z.boolean().optional().default(false),
  sharing_disabled: z.boolean().optional().default(false),
  completed: z.boolean().optional().default(false),
  chapter_id: z.number(),
  chapter_title: z.string(),
  chapter_url: z.string(),
  cohost_registration_url: z.string().nullable().optional(),
});

export type RawEventDetail = z.infer<typeof rawEventDetailSchema>;

export const rawEventListItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  event_timezone: z.string(),
  event_type_title: z.string(),
  audience_type: z.enum(["IN_PERSON", "VIRTUAL", "HYBRID"]),
  venue_name: z.string().nullable().optional(),
  venue_city: z.string().nullable().optional(),
  cropped_picture_url: z.string().nullable().optional(),
  cropped_banner_url: z.string().nullable().optional(),
  url: z.string(),
  cohost_registration_url: z.string().nullable().optional(),
  description_short: z.string().nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
  is_hidden: z.boolean().optional().default(false),
  chapter_id: z.number(),
  chapter_title: z.string(),
});

export type RawEventListItem = z.infer<typeof rawEventListItemSchema>;

// Every paginated Bevy endpoint wraps its rows in the same envelope. Note that
// `pagination.page_size` is deliberately NOT modelled: it echoes a server
// default rather than the requested value, so `links.next` is the only
// trustworthy way to page (PRD §6.2).
const listEnvelope = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    links: z.object({ next: z.string().nullable(), previous: z.string().nullable() }),
    count: z.number(),
    results: z.array(item),
  });

export const eventListEnvelopeSchema = listEnvelope(rawEventListItemSchema);

// Raw Bevy `chapter_slim` shape. Deliberately narrow: only the fields the site
// actually consumes are validated, so an unrelated field changing upstream
// can't fail the parse. `description` is optional — a chapter with an empty
// profile is a legitimate state, not drift.
export const rawChapterSchema = z.object({
  id: z.number(),
  title: z.string(),
  members_count: z.number(),
  member_count_is_at_limit: z.boolean().optional().default(false),
  description: z.string().nullable().optional(),
});

export type RawChapter = z.infer<typeof rawChapterSchema>;

/*
 * Speakers / judges / mentors (`event_person`), sponsors (`event_sponsor`) and
 * the chapter team (`chapter_slim/<slug>/team/`). All three are enrichment
 * endpoints: nothing on a page depends on them, so their schemas are even
 * narrower than the ones above and their fetches never throw (see client.ts).
 */

// Bevy's image sub-object. EVERY field is optional because the API sends a bare
// `{}` for a person with no photo — measured on the live chapter, 4 of 159
// people across 35 events — and a required field would fail the whole parse.
const rawImageSchema = z
  .object({
    url: z.string().optional(),
    thumbnail_url: z.string().optional(),
  })
  .nullable()
  .optional();

export const rawEventPersonSchema = z.object({
  id: z.number(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  // NOT an enum. Six values are observed on this chapter (speaker, mentor,
  // judge, panelist, moderator, host) and Bevy's own term settings define more
  // (facilitator, organizer, partner). An enum here would turn an organizer
  // picking an unused role into a hard parse failure for the whole event.
  role: z.string(),
  order: z.number().optional().default(0),
  picture: rawImageSchema,
  // Organizer-authored HTML — but only mostly. 7 of the 132 non-empty bios on
  // this chapter are plain text with no tags at all, which is why nothing here
  // may assume markup; `bio.ts` decides per value.
  bio: z.string().nullable().optional(),
  // Bare handles, never URLs, on every value measured (e.g. "AashiDutt",
  // "aashi-dutt"). LinkedIn is rare — 3 of 159.
  personal_twitter: z.string().nullable().optional(),
  personal_linkedin_page: z.string().nullable().optional(),
});

export type RawEventPerson = z.infer<typeof rawEventPersonSchema>;

export const eventPersonEnvelopeSchema = listEnvelope(rawEventPersonSchema);

export const rawEventSponsorSchema = z.object({
  id: z.number(),
  company: z.string(),
  // Same open-vocabulary reasoning as `role` above. Only `media_partner` has
  // ever appeared on this chapter; Bevy also defines sponsor, partner, and
  // global/local sponsor.
  sponsor_type: z.string(),
  order: z.number().optional().default(0),
  visible: z.boolean().optional().default(true),
  logo: rawImageSchema,
  url: z.string().nullable().optional(),
});

export type RawEventSponsor = z.infer<typeof rawEventSponsorSchema>;

export const eventSponsorEnvelopeSchema = listEnvelope(rawEventSponsorSchema);

// The team endpoint is the odd one out: it returns a BARE ARRAY, with no
// links/count/results envelope around it. `title` here is the chapter-team role
// and `user.title` is the person's own job title; the two contradict each other
// per person on the live chapter, which `normalizeTeam` reconciles.
export const rawTeamMemberSchema = z.object({
  title: z.string().nullable().optional(),
  user: z.object({
    full_name: z.string(),
    title: z.string().nullable().optional(),
    company: z.string().nullable().optional(),
    cropped_avatar_url: z.string().nullable().optional(),
    avatar: rawImageSchema,
    // PLAIN TEXT with newlines here, unlike the event person's `bio` above,
    // which is HTML. Same field name, different format — see `bio.ts`.
    bio: z.string().nullable().optional(),
    twitter: z.string().nullable().optional(),
  }),
});

export type RawTeamMember = z.infer<typeof rawTeamMemberSchema>;

export const rawTeamSchema = z.array(rawTeamMemberSchema);
