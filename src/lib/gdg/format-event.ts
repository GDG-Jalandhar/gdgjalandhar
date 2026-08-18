import type { GdgEvent } from "./types";

/**
 * Formats in the event's own IANA timezone, not the viewer's (PRD §6.6 D-4).
 * Seconds are always absent from `start_date`/`end_date` display — native
 * `Intl.DateTimeFormat` never emits them unless asked.
 */
export function formatEventDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: timezone || undefined,
  })
    .format(date)
    .toUpperCase();
}

export function formatEventTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone || undefined,
  }).format(date);
}

/** e.g. "MON 14 SEP · 10:00 AM – 4:00 PM IST" */
export function formatEventDateTimeRange(event: Pick<GdgEvent, "startAt" | "endAt" | "timezone" | "tzAbbr">): string {
  const datePart = formatEventDate(event.startAt, event.timezone);
  const startTime = formatEventTime(event.startAt, event.timezone);
  if (!event.endAt) return `${datePart} · ${startTime}${event.tzAbbr ? ` ${event.tzAbbr}` : ""}`;

  const sameDay = event.startAt.toDateString() === event.endAt.toDateString();
  const endTime = formatEventTime(event.endAt, event.timezone);
  const tz = event.tzAbbr ? ` ${event.tzAbbr}` : "";

  if (sameDay) return `${datePart} · ${startTime} – ${endTime}${tz}`;
  const endDatePart = formatEventDate(event.endAt, event.timezone);
  return `${datePart} ${startTime} – ${endDatePart} ${endTime}${tz}`;
}

export function venueOrOnline(event: Pick<GdgEvent, "venue" | "audience">): string {
  if (event.venue?.name) return event.venue.name;
  if (event.audience === "VIRTUAL") return "Online";
  if (event.audience === "HYBRID") return "Hybrid · Online + in person";
  return "Venue TBA";
}
