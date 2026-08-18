import { chapter } from "@/data/chapter";
import type { GdgEvent } from "@/lib/gdg/types";

// §7.2: site-wide Organization JSON-LD, cheap to add, feeds knowledge-panel
// style results for a search on the chapter name.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: chapter.fullName,
    url: "https://gdgjalandhar.com",
    logo: "https://gdgjalandhar.com/icons/icon-512.png",
    email: chapter.contactEmail,
    foundingDate: chapter.foundedISO,
    sameAs: Object.values(chapter.socials),
  };
}

// D-12: per-event Event JSON-LD including location and endDate.
export function eventJsonLd(event: GdgEvent) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startAt.toISOString(),
    endDate: event.endAt?.toISOString(),
    eventAttendanceMode:
      event.audience === "VIRTUAL"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : event.audience === "HYBRID"
          ? "https://schema.org/MixedEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.venue
      ? {
          "@type": "Place",
          name: event.venue.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: event.venue.address,
            addressLocality: event.venue.city,
            addressRegion: event.venue.state,
            postalCode: event.venue.zip,
          },
        }
      : event.virtualUrl
        ? { "@type": "VirtualLocation", url: event.virtualUrl }
        : undefined,
    image: event.media.isDefaultBanner ? undefined : [event.media.banner],
    description: event.excerpt || undefined,
    organizer: {
      "@type": "Organization",
      name: event.cohost.isOurs ? chapter.fullName : event.cohost.chapterTitle,
      url: event.cohost.isOurs ? chapter.joinUrl : event.cohost.chapterUrl,
    },
  };
}
