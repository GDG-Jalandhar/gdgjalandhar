import { CHAPTER_ID } from "@/lib/gdg/constants";

export { CHAPTER_ID };

export const chapter = {
  name: "GDG Jalandhar",
  fullName: "Google Developer Group Jalandhar",
  city: "Jalandhar",
  foundedISO: "2011-02",
  memberCount: 6115,
  // Stated stat per PRD H-4a — never derived from the API's `count`, which
  // returns fewer than this due to cohost/parent-chapter filters and hidden events.
  eventsHostedStat: 122,
  contactEmail: "hello@gdgjalandhar.com",
  joinUrl: "https://gdg.community.dev/gdg-jalandhar/",
  bevyChapterUrl: "https://gdg.community.dev/gdg-jalandhar/",
  socials: {
    instagram: "https://instagram.com/gdgjalandhar",
    x: "https://x.com/gdgjalandhar",
    linkedin: "https://linkedin.com/company/gdgjalandhar",
    github: "https://github.com/gdg-jalandhar",
  },
} as const;

export type SocialPlatform = keyof typeof chapter.socials;
