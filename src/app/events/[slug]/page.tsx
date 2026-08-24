import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RouteAccent } from "@/components/layout/RouteAccent";
import { EventBanner } from "@/features/events/components/EventBanner";
import { VenueBlock } from "@/features/events/components/VenueBlock";
import { RegistrationCta } from "@/features/events/components/RegistrationCta";
import { AgendaTimeline } from "@/features/events/components/AgendaTimeline";
import { Prose } from "@/components/ui/Prose";
import { TagChip } from "@/features/events/components/TagChip";
import { CohostBadge } from "@/features/events/components/CohostBadge";
import { ShareControl } from "@/features/events/components/ShareControl";
import { fetchEventDetail, fetchEventList } from "@/lib/gdg/client";
import { formatEventDateTimeRange } from "@/lib/gdg/format-event";
import { eventJsonLd } from "@/lib/seo/jsonld";

type Props = {
  params: Promise<{ slug: string }>;
};

// D-12: pre-renders every event page at build, with ISR keeping them fresh.
export async function generateStaticParams() {
  const [upcoming, past] = await Promise.all([fetchEventList("Live"), fetchEventList("Completed")]);
  return [...upcoming, ...past].map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventDetail(slug);
  if (!event) return {};

  return {
    title: event.title,
    description: event.excerpt || undefined,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      type: "website",
      title: event.title,
      description: event.excerpt || undefined,
      images: event.media.isDefaultBanner ? undefined : [event.media.banner],
    },
    twitter: {
      card: event.media.isDefaultBanner ? "summary" : "summary_large_image",
      title: event.title,
      description: event.excerpt || undefined,
    },
  };
}

// D-11: unknown or hidden slug → 404, never a blank page or a permanent
// skeleton. Known trade-off (confirmed against this Next version's own
// notFound() docs): because `/events/loading.tsx` wraps this segment in an
// implicit Suspense boundary, the response has already started streaming a
// 200 by the time notFound() resolves, so this serves a "soft 404" — correct
// content, a `noindex` meta tag Next injects automatically, but a 200 status
// rather than a literal 404. A true 404 status would require checking
// existence in `proxy` before the stream starts, which re-implements this
// lookup at the edge for a benefit the `noindex` tag already covers (crawlers
// won't index it) — not worth the added complexity here.
export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await fetchEventDetail(slug);
  if (!event) notFound();

  return (
    <RouteAccent value={event.status === "upcoming" ? "green" : "yellow"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(event)) }}
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-16 md:px-8 md:py-24">
        <div>
          <p className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">
            {event.status === "upcoming" ? "UPCOMING" : "PAST"}
          </p>
          <h1 className="mt-2 text-h1 text-text">{event.title}</h1>
          <p className="mt-3 font-mono text-meta text-text-muted">{formatEventDateTimeRange(event)}</p>
        </div>

        <EventBanner media={event.media} sizes="(min-width: 768px) 768px, 100vw" priority />

        <CohostBadge cohost={event.cohost} />

        <VenueBlock venue={event.venue} virtualUrl={event.virtualUrl} audience={event.audience} />

        <RegistrationCta event={event} />

        {event.descriptionHtml && <Prose html={event.descriptionHtml} />}

        <AgendaTimeline agenda={event.agenda} />

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-hairline pt-6">
          <a
            href={event.bevyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-meta text-text-muted hover:text-accent-text"
          >
            View on GDG Community →
          </a>
          <ShareControl share={event.share} title={event.title} />
        </div>
      </div>
    </RouteAccent>
  );
}
