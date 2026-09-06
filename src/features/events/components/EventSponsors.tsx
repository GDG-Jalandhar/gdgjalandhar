import Image from "next/image";
import type { GdgSponsorGroup } from "@/lib/gdg/types";

const LOGO_SIZES = "(min-width: 768px) 240px, 45vw";

/**
 * An event's sponsors and partners, grouped by Bevy's `sponsor_type`.
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
export function EventSponsors({ groups }: { groups: GdgSponsorGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group.type} className="flex flex-col gap-6">
          <h2 className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">
            {`// ${group.label}`}
          </h2>
          {/* Same container-query rhythm as `PersonGrid` directly above, but
              capped at three columns — a wide logo needs more width than a
              portrait, and there are rarely more than a few sponsors. */}
          <div className="@container">
            <div className="grid grid-cols-2 gap-4 @md:grid-cols-3 @md:gap-5">
              {group.sponsors.map((sponsor) => (
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
                  <p className="font-mono text-meta leading-snug text-text-muted">
                    {sponsor.company}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
