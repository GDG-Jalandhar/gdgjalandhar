import { http, HttpResponse } from "msw";
import { CHAPTER_ID, CHAPTER_SLUG } from "@/lib/gdg/constants";
import { allEvents, envelope, pastEvents, upcomingEvents } from "./fixtures/events";
import { chapterFixture } from "./fixtures/chapter";
import { eventPeople, eventSponsors, peopleEnvelope, teamFixture } from "./fixtures/people";

const LIST_URL = `https://gdg.community.dev/api/event_slim/for_chapter/${CHAPTER_ID}/`;
const DETAIL_URL = "https://gdg.community.dev/api/event_slim/:slug/";
// Keyed by slug, not by CHAPTER_ID — the numeric form 404s upstream.
const CHAPTER_URL = `https://gdg.community.dev/api/chapter_slim/${CHAPTER_SLUG}/`;
const TEAM_URL = `https://gdg.community.dev/api/chapter_slim/${CHAPTER_SLUG}/team/`;
// These two are keyed OPPOSITELY upstream — people by slug, sponsors by numeric
// id — and these handlers replicate that so a mistake fails here too, rather
// than only in production.
const PEOPLE_URL = "https://gdg.community.dev/api/event_person/";
const SPONSOR_URL = "https://gdg.community.dev/api/event_sponsor/";

export const handlers = [
  http.get(LIST_URL, ({ request }) => {
    const status = new URL(request.url).searchParams.get("status");
    // The real API sorts server-side via the `order` param (E-3); this mock
    // does the same so fixture ordering doesn't accidentally look correct
    // only because the array happened to be written in date order.
    if (status === "Completed") {
      const sorted = [...pastEvents].sort((a, b) => b.start_date.localeCompare(a.start_date));
      return HttpResponse.json(envelope(sorted));
    }
    const sorted = [...upcomingEvents].sort((a, b) => a.start_date.localeCompare(b.start_date));
    return HttpResponse.json(envelope(sorted));
  }),

  http.get(CHAPTER_URL, () => HttpResponse.json(chapterFixture)),

  http.get(DETAIL_URL, ({ params }) => {
    const event = allEvents.find((e) => e.slug === params.slug);
    if (!event) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(event);
  }),

  // Upstream this 200s with `count: 0` for an unknown key rather than 404ing,
  // which is exactly how passing a numeric id instead of a slug hides itself.
  http.get(PEOPLE_URL, ({ request }) => {
    const slug = new URL(request.url).searchParams.get("event") ?? "";
    return HttpResponse.json(peopleEnvelope(eventPeople[slug] ?? []));
  }),

  http.get(SPONSOR_URL, ({ request }) => {
    const eventId = new URL(request.url).searchParams.get("event_id") ?? "";
    // A slug here is a hard 400 upstream, not an empty list.
    if (!/^\d+$/.test(eventId)) return new HttpResponse(null, { status: 400 });
    return HttpResponse.json(peopleEnvelope(eventSponsors[Number(eventId)] ?? []));
  }),

  // A bare array, no envelope — the one list endpoint shaped this way.
  http.get(TEAM_URL, () => HttpResponse.json(teamFixture)),
];
