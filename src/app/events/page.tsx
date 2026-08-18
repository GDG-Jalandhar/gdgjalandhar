import type { Metadata } from "next";
import { RouteAccent } from "@/components/layout/RouteAccent";
import { EventTabs } from "@/features/events/components/EventTabs";
import { EventList } from "@/features/events/components/EventList";
import { fetchEventList } from "@/lib/gdg/client";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past GDG Jalandhar events.",
  alternates: { canonical: "/events" },
};

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

// E-1: default is Upcoming; if there are zero upcoming events, default to
// Past. Both lists are cheap to fetch (Next dedupes identical fetches within
// a render, and the list ISR cache means this isn't a fresh network hit
// every time), so the emptiness check doesn't cost a second round trip in
// practice.
export default async function EventsPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const upcoming = await fetchEventList("Live");

  const effectiveTab: "upcoming" | "past" =
    tab === "past" ? "past" : tab === "upcoming" ? "upcoming" : upcoming.length === 0 ? "past" : "upcoming";

  const events = effectiveTab === "upcoming" ? upcoming : await fetchEventList("Completed");

  return (
    <RouteAccent value="green">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-8 px-5 py-16 md:px-8 md:py-24">
        <h1 className="text-h1 text-text">Events</h1>
        <EventTabs active={effectiveTab} />
        <EventList events={events} tab={effectiveTab} />
      </div>
    </RouteAccent>
  );
}
