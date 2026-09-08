/**
 * Fixtures for the three enrichment endpoints: `event_person`, `event_sponsor`
 * and the chapter team.
 *
 * Every one reproduces an edge case measured on the live chapter, named in the
 * comment above it — the same rule the event fixtures follow. Photos point at
 * picsum.photos, which is allowlisted in next.config.ts for mock mode only.
 */

const portrait = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`;
// Wide, like every real sponsor logo — the square-crop trap this feature has to
// avoid (Bevy's own `thumbnail_url` would cut these in half).
const logo = (seed: string) => `https://picsum.photos/seed/${seed}/480/240`;

type Extras = { bio?: string; twitter?: string; linkedin?: string };

function person(
  id: number,
  first: string,
  last: string,
  role: string,
  title: string,
  company: string,
  order: number,
  extras: Extras = {},
) {
  return {
    id,
    first_name: first,
    last_name: last,
    company,
    title,
    role,
    order,
    picture: { url: portrait(`${first}${last}`), thumbnail_url: portrait(`${first}${last}`) },
    bio: extras.bio ?? "",
    personal_twitter: extras.twitter ?? "",
    personal_linkedin_page: extras.linkedin ?? "",
  };
}

export const eventPeople: Record<string, unknown[]> = {
  // The common case: a straight speaker list.
  "build-with-ai-bootcamp": [
    // The common case: an HTML bio plus both handles.
    person(20001, "Aashi", "Dutt", "speaker", "Senior Technical Content Writer", "Mem0", 0, {
      bio: "<p>Kaggle Expert with a publication on deep learning and a pending patent.</p><p>Focused on shipping ML into products people actually use.</p>",
      twitter: "AashiDutt",
      linkedin: "aashi-dutt",
    }),
    // Handles but no bio — the modal opens on links alone.
    person(20002, "Loveleen", "Kaur", "speaker", "Mobile Engineer", "Twin Health", 1, {
      twitter: "loveleen_nancy",
    }),
    // A title-less person (real data has these), and one with neither a bio nor
    // a handle — this card must render NO button at all.
    person(20003, "Akansha", "Jain", "speaker", "", "Autonation", 2),
  ],

  // Mixed roles in one event — the case that makes grouping worth having.
  "devfest-jalandhar-2026": [
    // 7 of 132 real event bios are PLAIN TEXT, not HTML, despite the field
    // being HTML everywhere else. Blank lines have to survive as paragraphs.
    person(20101, "Priya", "Sharma", "speaker", "Staff Engineer", "Google", 0, {
      bio: "Builds developer tools.\n\nPreviously on the Android platform team.\nStill writes Kotlin for fun.",
      twitter: "priya_builds",
    }),
    // Organizer-authored HTML with a script tag and an inline handler — the
    // sanitizer has to strip both while keeping the prose.
    person(20102, "Rahul", "Verma", "judge", "Engineering Manager", "Searce", 0, {
      bio: '<p>Cloud architect.<script>alert(1)</script></p><p onerror="alert(2)">Ten years on GCP.</p>',
      twitter: "rahulverma",
    }),
    person(20103, "Neha", "Gupta", "mentor", "Cloud Engineer", "TSYS", 0),
    person(20104, "Arjun", "Mehta", "host", "Community Lead", "GDG Jalandhar", 0),
    // A role slug nothing maps — must titleize to "Guest Emcees", not vanish.
    person(20105, "Simran", "Bedi", "guest_emcee", "Product Designer", "", 0),
  ],

  // Bevy lets an organizer save an empty person row; the API returns it as a
  // literal "- -" with an empty `{}` picture. It must never reach the page.
  "flutter-forward-extended-2025": [
    // A one-character bio — the shortest real value on the live chapter.
    person(20201, "Suraj", "Kumar", "speaker", "SOC Analyst", "LinearStack", 0, { bio: "<p>S</p>" }),
    { id: 20202, first_name: "-", last_name: "-", company: "", title: "", role: "speaker", order: 1, picture: {} },
    // `order` is the display order, and it is not the array order.
    person(20203, "Bharat", "Agarwal", "speaker", "Full Stack Developer", "", 2),
  ],

  // Most events have nobody attached — neither section may render an empty
  // heading for them.
  "women-techmakers-jalandhar-2025": [],
  "google-io-extended-bangkok-2026": [],
};

export const eventSponsors: Record<number, unknown[]> = {
  // Two sponsor types in one event, so the grouping is actually exercised, plus
  // an invisible row that must be filtered out.
  10002: [
    {
      id: 30001,
      company: "Innovation Mission Punjab",
      sponsor_type: "media_partner",
      order: 0,
      visible: true,
      logo: { url: logo("impunjab"), thumbnail_url: logo("impunjab-thumb") },
      url: "https://impunjab.org/",
    },
    {
      id: 30002,
      company: "Natchkin",
      sponsor_type: "media_partner",
      order: 1,
      visible: true,
      logo: { url: logo("natchkin"), thumbnail_url: logo("natchkin-thumb") },
      url: "https://natchkin.com/",
    },
    {
      id: 30003,
      company: "Lovely Professional University",
      sponsor_type: "local_sponsor",
      order: 0,
      visible: true,
      logo: { url: logo("lpu"), thumbnail_url: logo("lpu-thumb") },
      url: null,
    },
    {
      id: 30004,
      company: "Withdrawn Partner",
      sponsor_type: "local_sponsor",
      order: 1,
      visible: false,
      logo: { url: logo("withdrawn"), thumbnail_url: logo("withdrawn-thumb") },
      url: null,
    },
  ],
  10001: [
    {
      id: 30101,
      company: "D4 Community",
      sponsor_type: "media_partner",
      order: 0,
      visible: true,
      logo: { url: logo("d4"), thumbnail_url: logo("d4-thumb") },
      url: null,
    },
  ],
};

/**
 * The chapter team, mirroring the four contradictions the real payload has:
 * an organizer whose ROLE is in `user.title` and day job in the team `title`,
 * another with exactly the reverse, one with an empty `user.title`, and one
 * where both fields say the same thing.
 */
export const teamFixture = [
  {
    title: "Software Engineer",
    user: {
      full_name: "Simar Preet Singh",
      title: "Organiser",
      company: "GDG Jalandhar",
      cropped_avatar_url: portrait("simar"),
      avatar: { url: portrait("simar"), thumbnail_url: portrait("simar") },
      // Team bios are ALWAYS plain text — never HTML, unlike event people.
      bio: "JavaScript developer who likes problems with no obvious answer.",
      twitter: "programmersingh",
    },
  },
  {
    title: "Organiser",
    user: {
      full_name: "Amanpreet Kaur",
      title: "Android Developer",
      company: "Intellisense Technology",
      cropped_avatar_url: portrait("amanpreet"),
      avatar: { url: portrait("amanpreet"), thumbnail_url: portrait("amanpreet") },
      // Blank lines carry the paragraph structure in the real payload.
      bio: "Android developer, six years in.\n\nWomen Techmakers Ambassador. Runs DevFests and workshops.\n\nDraws, when there's time.",
      twitter: "kauramanp",
    },
  },
  {
    title: "Graphics and UI/UX Designer",
    user: {
      full_name: "Qazi Zaid",
      title: "",
      company: "",
      cropped_avatar_url: portrait("qazi"),
      avatar: { url: portrait("qazi"), thumbnail_url: portrait("qazi") },
      bio: "Robotics AI student. Design, community, and a bit of Java.",
      twitter: "Qazi__Zaid",
    },
  },
  {
    title: "Fullstack developer",
    user: {
      full_name: "veer pratap Singh",
      title: "Fullstack developer",
      company: "Antier Solutions",
      cropped_avatar_url: null,
      avatar: {},
      // Empty bio but a real handle — must still get a button (matches the
      // live chapter, where one organizer's bio is blank).
      bio: "",
      twitter: "theveer5",
    },
  },
];

export function peopleEnvelope(results: unknown[]) {
  return {
    links: { next: null, previous: null },
    pagination: { previous_page: null, current_page: 1, next_page: null, page_size: 500 },
    count: results.length,
    results,
  };
}
