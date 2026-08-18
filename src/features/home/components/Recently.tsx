import { EventCard } from "@/features/events/components/EventCard";
import { fetchEventList } from "@/lib/gdg/client";
import { strings } from "@/lib/strings";

// H-6: up to 3 most recent past events. Hidden entirely if there are none.
export async function Recently() {
  const events = (await fetchEventList("Completed")).slice(0, 3);
  if (events.length === 0) return null;

  return (
    <section data-accent="yellow" className="flex flex-col gap-6">
      <p className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">
        {strings.home.recentlyEyebrow}
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </section>
  );
}
