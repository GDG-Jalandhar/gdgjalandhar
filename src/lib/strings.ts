/**
 * Centralized UI copy (PRD §7.8 i18n readiness) — nothing content-shaped
 * should be buried inline in JSX, so a future `[locale]` segment is cheap.
 * Voice rules: Design-Philosophy.md §11 (plain, active voice, sentence case,
 * specific over clever, no "Unlock/Empower/Level up").
 */
export const strings = {
  nav: {
    home: "Home",
    events: "Events",
    about: "About",
    join: "Join",
  },
  hero: {
    upcomingEyebrow: "UPCOMING",
    announcingSoonEyebrow: "NEXT EVENT — ANNOUNCING SOON",
    rsvp: "RSVP",
    details: "Details",
    joinCommunity: "Join the community",
  },
  stats: {
    members: "Members",
    eventsHosted: "Events hosted",
    yearsRunning: "Years running",
  },
  home: {
    whoWeAreEyebrow: "// WHO WE ARE",
    whatsNextEyebrow: "// WHAT'S NEXT",
    recentlyEyebrow: "// RECENTLY",
    seeAllEvents: "See all events →",
  },
  events: {
    upcoming: "Upcoming",
    past: "Past",
    loadMore: "Load more",
    emptyUpcoming: "No upcoming events yet. Past events are here →",
    emptyPast: "No past events yet.",
    error: "Couldn't load events. Retry →",
    retry: "Retry",
  },
  eventDetail: {
    openInMaps: "Open in Maps",
    viewOnGdgCommunity: "View on GDG Community",
    viewOnBevy: "View this event on GDG Community",
    cohostedWith: "Cohosted with",
    share: "Share",
    copyLink: "Copy link",
    linkCopied: "Link copied",
    agendaUnavailable: "Agenda not available.",
    notFoundTitle: "Event not found",
    notFoundBody: "This event doesn't exist, or isn't public anymore.",
  },
  about: {
    getInvolvedEyebrow: "// GET INVOLVED",
    speak: "Speak",
    sponsor: "Sponsor",
    codeOfConduct: "Code of Conduct",
  },
  offline: {
    banner: "You're offline. Showing the last events we saved.",
    pageTitle: "You're offline",
    pageBody: "This page hasn't been saved for offline reading yet. Reconnect and try again, or go back to something you've already visited.",
    backHome: "Back to Home",
  },
  notFound: {
    title: "Page not found",
    body: "That page doesn't exist. Here's how to find your way back.",
    backHome: "Back to Home",
    viewEvents: "View events",
  },
  pwa: {
    install: "Install app",
    installBody: "Install GDG Jalandhar for quick access, even offline.",
    installAction: "Install",
    iosInstructionsTitle: "Add to Home Screen",
    updateAvailable: "New version available",
    reload: "Reload",
  },
  footer: {
    since: "Since 2011",
    contact: "hello@gdgjalandhar.com",
  },
} as const;
