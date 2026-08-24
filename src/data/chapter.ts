import { CHAPTER_ID } from "@/lib/gdg/constants";

export { CHAPTER_ID };

export const chapter = {
  name: "GDG Jalandhar",
  fullName: "Google Developer Group Jalandhar",
  city: "Jalandhar",
  foundedISO: "2011-02",
  // FALLBACKS ONLY — not the displayed values. Both are fetched live from
  // Bevy (`fetchChapter`, and the event list lengths); these are what render
  // if that call fails, so a Bevy outage degrades to a stale number rather
  // than an error. Refresh them occasionally, but don't rely on them.
  memberCountFallback: 6148 as number,
  descriptionFallbackHtml:
    "<p>Google Developer Groups are inclusive local communities — all levels welcome, " +
    "beginners explicitly included. In Jalandhar, that means talks, hands-on workshops, " +
    "and hackathons across Android, Web, Cloud, and AI, run by volunteers for the " +
    "developer community in Punjab. We've been doing this since February 2011, which " +
    "makes us one of the longest-running GDG chapters in India.</p>",
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
