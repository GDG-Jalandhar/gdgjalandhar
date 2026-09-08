import Image from "next/image";
import type { GdgSponsor } from "@/lib/gdg/types";
import { strings } from "@/lib/strings";

const LOGO_SIZES = "(min-width: 768px) 240px, 45vw";

/**
 * An event's partners, in one flat list.
 *
 * Deliberately NOT grouped by Bevy's `sponsor_type`, which an earlier version
 * did: the distinctions it draws (media partner, local sponsor, global sponsor)
 * are Bevy's internal taxonomy, not something a reader needs, and every sponsor
 * this chapter has ever had is a `media_partner` anyway — so the grouping only
 * ever produced one section with a heading that named an implementation detail.
 * One "Partners" heading says what the reader needs to know.
 *
 * Plain cards, not notched: Design-Philosophy.md §6 names sponsor logos as the
 * case the plain `.card` variant exists for, and caps notched containers at
 * three per viewport — an event page has already spent them.
 *
 * The white plate behind each logo is load-bearing, not decoration. These are
 * transparent PNGs authored for light backgrounds (verified by decoding the
 * live chapter's own logos: palette PNGs with a tRNS chunk), so a dark-ink
 * wordmark dropped straight onto the #1e1e1e canvas is invisible. It's a
 * neutral photo plate — §4.3's sanctioned use for a light surface — so it
 * doesn't drag a second color family into the composition.
 *
 * `object-contain` for the same reason the logos use `logo.url` rather than
 * Bevy's square `thumbnail_url` crop: they're wide (roughly 2:1), and any
 * cover-crop cuts the wordmark in half.
 */
export function EventSponsors({ sponsors }: { sponsors: GdgSponsor[] }) {
  if (sponsors.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">
        {strings.eventDetail.partnersEyebrow}
      </h2>
      {/* Same container-query rhythm as `PersonGrid` directly above, but capped
          at three columns — a wide logo needs more width than a portrait, and
          there are rarely more than a few partners. */}
      <div className="@container">
        <div className="grid grid-cols-2 gap-4 @md:grid-cols-3 @md:gap-5">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex h-full flex-col gap-3 rounded-card border border-hairline bg-surface p-4 text-center"
            >
              {sponsor.logo && (
                <div className="relative h-16 w-full overflow-hidden rounded-lg bg-white p-2">
                  <Image
                    src={sponsor.logo}
                    alt=""
                    fill
                    sizes={LOGO_SIZES}
                    className="object-contain p-2"
                  />
                </div>
              )}
              <p className="font-mono text-meta leading-snug text-text-muted">{sponsor.company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
