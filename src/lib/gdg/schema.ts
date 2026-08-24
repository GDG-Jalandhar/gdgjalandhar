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

export const eventListEnvelopeSchema = z.object({
  links: z.object({ next: z.string().nullable(), previous: z.string().nullable() }),
  count: z.number(),
  results: z.array(rawEventListItemSchema),
});

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
