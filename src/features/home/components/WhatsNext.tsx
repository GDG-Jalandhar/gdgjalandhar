import Link from "next/link";
import { EventCard } from "@/features/events/components/EventCard";
import { fetchEventList } from "@/lib/gdg/client";
import { strings } from "@/lib/strings";

// H-5: up to 3 upcoming events, horizontal snap-scroll on mobile, grid on
// desktop. Hidden entirely if there are none.
export async function WhatsNext() {
  const events = (await fetchEventList("Live")).slice(0, 3);
  if (events.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">
          {strings.home.whatsNextEyebrow}
        </p>
        <Link href="/events" className="font-mono text-meta text-accent-text hover:underline">
          {strings.home.seeAllEvents}
        </Link>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
        {events.map((event) => (
          <div key={event.slug} className="w-[85%] shrink-0 snap-start md:w-auto">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
}
