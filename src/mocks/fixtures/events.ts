import { bangkokAgendaString } from "./agenda";

/**
 * Raw Bevy `event_slim` shaped fixtures — field names match the real API
 * (snake_case, unnormalized) per PRD §6. `src/lib/gdg/normalize.ts` (Phase 2)
 * is the only place that should ever see this shape; everything downstream
 * of it works with the mapped `GdgEvent` type instead.
 *
 * `chapter_id: 887` on the Bangkok event is deliberate — PRD §6 calls this
 * out as "a handy tripwire for mock data leaking into a production build."
 */

// Real Bevy banners live on Cloudinary (PRD §6.6 D-6); these fixture URLs use
// a placeholder image service instead so `pnpm dev:mock` renders an actual
// image rather than a 404. The dimensions are not arbitrary: every real
// `cropped_banner_url` is a 2560x640 Cloudinary crop, so the fixtures match
// that 4:1 ratio and mock mode lays out exactly like production.
const banner = (seed: string) => `https://picsum.photos/seed/${seed}/2560/640`;
// 1000x1000: what Cloudinary actually delivers for `cropped_picture_url`
// (declared 500x500, doubled by the `dpr_2.0` in the chain). Cards render
// this square, uncropped.
const thumb = (seed: string) => `https://picsum.photos/seed/${seed}/1000/1000`;
const DEFAULT_BANNER = banner("GDG_Bevy_DefaultEventBanner");
// Bevy uses a SEPARATE marker for placeholder thumbnails, and the two do not
// agree in real data — some events have a placeholder banner but real poster
// art. `flutter-forward-extended-2025` below reproduces exactly that case.
const DEFAULT_THUMBNAIL = thumb("GDG_Bevy_DefaultEventThumbnail");

export const rawEvents = {
  buildWithAiBootcamp: {
    id: 10001,
    slug: "build-with-ai-bootcamp",
    url: "https://gdg.community.dev/events/details/google-gdg-jalandhar-presents-build-with-ai-bootcamp/",
    relative_url: "/events/details/google-gdg-jalandhar-presents-build-with-ai-bootcamp/",
    static_url: "https://gdg.community.dev/e/bwaib1/",
    title: "Build with AI Bootcamp",
    description_short: "A hands-on day building with Gemini, Firebase, and Android — beginners welcome.",
    description:
      "<p>Join us for a full day of <strong>hands-on workshops</strong> building real apps with Google AI tooling.</p><h2>What to bring</h2><p>Just a laptop — no experience required. See the <a href=\"https://gdg.community.dev/gdg-jalandhar/\">chapter page</a> for updates.</p>",
    agenda: null,
    hide_agenda_on_event_page: false,
    start_date: "2026-09-14T04:30:00Z",
    end_date: "2026-09-14T10:30:00Z",
    start_date_iso: "2026-09-14T10:00:00+05:30",
    end_date_iso: "2026-09-14T16:00:00+05:30",
    event_timezone: "Asia/Kolkata",
    timezone_abbreviation: "IST",
    minutes_until_start: 41472,
    event_type_title: "In-person event",
    audience_type: "IN_PERSON",
    is_virtual_event: false,
    join_virtual_event_url: null,
    virtual_venue_link: null,
    venue_name: "Lovely Professional University",
    venue_address: "Jalandhar - Delhi G.T. Road",
    venue_city: "Phagwara",
    venue_state: "Punjab",
    venue_zip_code: "144411",
    show_map: true,
    banner: banner("build-with-ai-bootcamp"),
    event_banner: banner("build-with-ai-bootcamp"),
    cropped_banner_url: banner("build-with-ai-bootcamp"),
    picture: thumb("build-with-ai-bootcamp"),
    cropped_picture_url: thumb("build-with-ai-bootcamp"),
    tags: ["AI", "Android", "Firebase"],
    video_url: null,
    slideshare_url: null,
    registration_required: true,
    rsvp_only: false,
    allow_registration_as_a_guest: true,
    total_attendees: 118,
    total_capacity: 200,
    use_external_ticketing: false,
    custom_tickets_url: null,
    currency: "INR",
    is_hidden: false,
    sharing_disabled: false,
    completed: false,
    chapter_id: 781,
    chapter_slug: "gdg-jalandhar",
    chapter_title: "GDG Jalandhar",
    chapter_url: "https://gdg.community.dev/gdg-jalandhar/",
    cohost_registration_url: null,
  },

  devfestJalandhar2026: {
    id: 10002,
    slug: "devfest-jalandhar-2026",
    url: "https://gdg.community.dev/events/details/google-gdg-jalandhar-presents-devfest-jalandhar-2026/",
    relative_url: "/events/details/google-gdg-jalandhar-presents-devfest-jalandhar-2026/",
    static_url: "https://gdg.community.dev/e/dfj26/",
    title: "DevFest Jalandhar 2026",
    description_short: "The chapter's flagship annual event — talks, workshops, and the whole community in one room.",
    description:
      "<p>DevFest is back. <em>Details are still being finalised</em> — check back soon for the full schedule.</p>",
    agenda: null,
    hide_agenda_on_event_page: false,
    start_date: "2026-11-16T04:00:00Z",
    end_date: "2026-11-16T11:00:00Z",
    start_date_iso: "2026-11-16T09:30:00+05:30",
    end_date_iso: "2026-11-16T16:30:00+05:30",
    event_timezone: "Asia/Kolkata",
    timezone_abbreviation: "IST",
    minutes_until_start: 129600,
    event_type_title: "In-person event",
    audience_type: "HYBRID",
    is_virtual_event: false,
    join_virtual_event_url: "https://youtube.com/live/gdg-jalandhar-devfest-2026",
    virtual_venue_link: null,
    venue_name: "DAV Institute of Engineering & Technology",
    venue_address: "Kabir Nagar",
    venue_city: "Jalandhar",
    venue_state: "Punjab",
    venue_zip_code: "144008",
    show_map: true,
    banner: DEFAULT_BANNER,
    event_banner: DEFAULT_BANNER,
    cropped_banner_url: DEFAULT_BANNER,
    picture: DEFAULT_THUMBNAIL,
    cropped_picture_url: DEFAULT_THUMBNAIL,
    tags: ["DevFest", "Community"],
    video_url: null,
    slideshare_url: null,
    registration_required: true,
    rsvp_only: true,
    allow_registration_as_a_guest: false,
    total_attendees: 0,
    total_capacity: 400,
    use_external_ticketing: false,
    custom_tickets_url: null,
    currency: "INR",
    is_hidden: false,
    sharing_disabled: false,
    completed: false,
    chapter_id: 781,
    chapter_slug: "gdg-jalandhar",
    chapter_title: "GDG Jalandhar",
    chapter_url: "https://gdg.community.dev/gdg-jalandhar/",
    cohost_registration_url: null,
  },

  flutterForwardExtended2025: {
    id: 9001,
    slug: "flutter-forward-extended-2025",
    url: "https://gdg.community.dev/events/details/google-gdg-jalandhar-presents-flutter-forward-extended-2025/",
    relative_url: "/events/details/google-gdg-jalandhar-presents-flutter-forward-extended-2025/",
    static_url: "https://gdg.community.dev/e/ffe25/",
    title: "Flutter Forward Extended 2025",
    description_short: "A local recap of Flutter Forward with live-coding and a Q&A panel.",
    description:
      "<p>We watched the keynote together and followed it with two live-coding sessions on the latest Flutter release.</p>",
    agenda: null,
    hide_agenda_on_event_page: true,
    start_date: "2025-03-08T05:00:00Z",
    end_date: "2025-03-08T09:00:00Z",
    start_date_iso: "2025-03-08T10:30:00+05:30",
    end_date_iso: "2025-03-08T14:30:00+05:30",
    event_timezone: "Asia/Kolkata",
    timezone_abbreviation: "IST",
    minutes_until_start: -750384,
    event_type_title: "In-person event",
    audience_type: "IN_PERSON",
    is_virtual_event: false,
    join_virtual_event_url: null,
    virtual_venue_link: null,
    venue_name: "CT Institute of Engineering, Management & Technology",
    venue_address: "Jalandhar-Amritsar GT Road",
    venue_city: "Jalandhar",
    venue_state: "Punjab",
    venue_zip_code: "144020",
    show_map: true,
    // Placeholder banner but REAL poster art — 7 of the chapter's first 100
    // completed events look exactly like this, and it's the case that breaks
    // if anything reuses `isDefaultBanner` to decide what a card renders.
    banner: DEFAULT_BANNER,
    event_banner: DEFAULT_BANNER,
    cropped_banner_url: DEFAULT_BANNER,
    picture: thumb("flutter-forward-extended-2025"),
    cropped_picture_url: thumb("flutter-forward-extended-2025"),
    tags: ["Flutter", "Mobile"],
    video_url: "https://youtube.com/watch?v=flutter-forward-jal-2025",
    slideshare_url: "https://slideshare.net/gdgjalandhar/flutter-forward-2025",
    registration_required: true,
    rsvp_only: false,
    allow_registration_as_a_guest: true,
    total_attendees: 86,
    total_capacity: 100,
    use_external_ticketing: false,
    custom_tickets_url: null,
    currency: "INR",
    is_hidden: false,
    sharing_disabled: false,
    completed: true,
    chapter_id: 781,
    chapter_slug: "gdg-jalandhar",
    chapter_title: "GDG Jalandhar",
    chapter_url: "https://gdg.community.dev/gdg-jalandhar/",
    cohost_registration_url: null,
  },

  womenTechmakers2025: {
    id: 9002,
    slug: "women-techmakers-jalandhar-2025",
    url: "https://gdg.community.dev/events/details/google-gdg-jalandhar-presents-women-techmakers-jalandhar-2025/",
    relative_url: "/events/details/google-gdg-jalandhar-presents-women-techmakers-jalandhar-2025/",
    static_url: "https://gdg.community.dev/e/wtmj25/",
    title: "Women Techmakers Jalandhar 2025",
    description_short: "An online evening of talks celebrating women building in tech across Punjab.",
    description: "<p>A virtual celebration with speakers from across the region.</p>",
    agenda: null,
    hide_agenda_on_event_page: false,
    start_date: "2025-06-14T13:00:00Z",
    end_date: "2025-06-14T15:30:00Z",
    start_date_iso: "2025-06-14T18:30:00+05:30",
    end_date_iso: "2025-06-14T21:00:00+05:30",
    event_timezone: "Asia/Kolkata",
    timezone_abbreviation: "IST",
    minutes_until_start: -1024704,
    event_type_title: "Virtual event",
    audience_type: "VIRTUAL",
    is_virtual_event: true,
    join_virtual_event_url: "https://youtube.com/live/gdg-jalandhar-wtm-2025",
    virtual_venue_link: "https://youtube.com/live/gdg-jalandhar-wtm-2025",
    venue_name: null,
    venue_address: null,
    venue_city: null,
    venue_state: null,
    venue_zip_code: null,
    show_map: false,
    banner: banner("women-techmakers-jalandhar-2025"),
    event_banner: banner("women-techmakers-jalandhar-2025"),
    cropped_banner_url: banner("women-techmakers-jalandhar-2025"),
    picture: thumb("women-techmakers-jalandhar-2025"),
    cropped_picture_url: thumb("women-techmakers-jalandhar-2025"),
    tags: ["WTM", "Community"],
    video_url: "https://youtube.com/watch?v=wtm-jal-2025",
    slideshare_url: null,
    registration_required: true,
    rsvp_only: false,
    allow_registration_as_a_guest: true,
    total_attendees: 240,
    total_capacity: 500,
    use_external_ticketing: false,
    custom_tickets_url: null,
    currency: "INR",
    is_hidden: false,
    sharing_disabled: false,
    completed: true,
    chapter_id: 781,
    chapter_slug: "gdg-jalandhar",
    chapter_title: "GDG Jalandhar",
    chapter_url: "https://gdg.community.dev/gdg-jalandhar/",
    cohost_registration_url: null,
  },

  // Cohosted, foreign chapter — the "Bangkok sample" the PRD's own §6.5/§6.8
  // describe: chapter_id 887, a 13-item agenda, and attendees (343)
  // exceeding capacity (200), which D-8 says must never render as a ratio.
  googleIoExtendedBangkok2026: {
    id: 8001,
    slug: "google-io-extended-bangkok-2026",
    url: "https://gdg.community.dev/events/details/google-io-extended-bangkok-2026/",
    relative_url: "/events/details/google-io-extended-bangkok-2026/",
    static_url: "https://gdg.community.dev/e/m4gmgs/",
    title: "Google I/O Extended Bangkok 2026",
    description_short: "A full-day recap of Google I/O 2026, cohosted with GDG Jalandhar.",
    description:
      "<p>GDG Bangkok's annual Google I/O Extended, cohosted with a handful of regional chapters including GDG Jalandhar.</p><h2>Recap</h2><p>Recording and slides are linked below.</p>",
    agenda: bangkokAgendaString,
    hide_agenda_on_event_page: false,
    start_date: "2026-05-30T02:00:00Z",
    end_date: "2026-05-30T10:00:00Z",
    start_date_iso: "2026-05-30T09:00:00+07:00",
    end_date_iso: "2026-05-30T17:00:00+07:00",
    event_timezone: "Asia/Bangkok",
    timezone_abbreviation: "ICT",
    minutes_until_start: -3628800,
    event_type_title: "In-person event",
    audience_type: "IN_PERSON",
    is_virtual_event: false,
    join_virtual_event_url: null,
    virtual_venue_link: null,
    venue_name: "True Digital Park",
    venue_address: "101 Sukhumvit Rd",
    venue_city: "Bangkok",
    venue_state: "Bangkok",
    venue_zip_code: "10260",
    show_map: true,
    banner: banner("google-io-extended-bangkok-2026"),
    event_banner: banner("google-io-extended-bangkok-2026"),
    cropped_banner_url: banner("google-io-extended-bangkok-2026"),
    picture: thumb("google-io-extended-bangkok-2026"),
    cropped_picture_url: thumb("google-io-extended-bangkok-2026"),
    tags: ["Google I/O", "Cohosted"],
    video_url: "https://youtube.com/watch?v=io-extended-bkk-2026",
    slideshare_url: "https://slideshare.net/gdgbangkok/io-extended-2026",
    registration_required: true,
    rsvp_only: false,
    allow_registration_as_a_guest: true,
    total_attendees: 343,
    total_capacity: 200,
    use_external_ticketing: false,
    custom_tickets_url: null,
    currency: "THB",
    is_hidden: false,
    sharing_disabled: false,
    completed: true,
    chapter_id: 887,
    chapter_slug: "gdg-bangkok",
    chapter_title: "GDG Bangkok",
    chapter_url: "https://gdg.community.dev/gdg-bangkok/",
    cohost_registration_url: "https://gdg.community.dev/events/details/google-io-extended-bangkok-2026/?utm_source=gdg-jalandhar",
  },
} as const;

export type RawEvent = (typeof rawEvents)[keyof typeof rawEvents];

const LIST_FIELDS = [
  "slug", "title", "start_date", "end_date", "event_timezone", "event_type_title",
  "audience_type", "venue_name", "venue_city", "cropped_picture_url",
  "cropped_banner_url", "url", "cohost_registration_url", "description_short",
  "tags", "is_hidden", "chapter_id", "chapter_title",
] as const;

export function toListItem(event: RawEvent) {
  const item: Record<string, unknown> = {};
  for (const field of LIST_FIELDS) item[field] = event[field as keyof RawEvent];
  return item;
}

export function envelope(events: RawEvent[]) {
  return {
    links: { next: null, previous: null },
    pagination: { previous_page: null, current_page: 1, next_page: null, page_size: 500 },
    count: events.length,
    results: events.map(toListItem),
  };
}

export const upcomingEvents: RawEvent[] = [rawEvents.buildWithAiBootcamp, rawEvents.devfestJalandhar2026];
export const pastEvents: RawEvent[] = [
  rawEvents.womenTechmakers2025,
  rawEvents.flutterForwardExtended2025,
  rawEvents.googleIoExtendedBangkok2026,
];
export const allEvents: RawEvent[] = [...upcomingEvents, ...pastEvents];
