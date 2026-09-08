import { PersonAvatar } from "./PersonAvatar";
import { PersonDetails } from "./PersonDetails";

type Props = {
  name: string;
  photo: string | null;
  /** The designation — a job title, or a chapter role. */
  title: string;
  /** The line below it: a company, or a second title. Blank when there isn't one. */
  secondaryTitle?: string;
  /** One of the kit's three sanctioned badges. Don't invent a fourth tier. */
  badge?: "Organizer" | "Speaker" | "Member";
  /** Sanitized upstream by `toBioHtml`; "" when the person has no bio. */
  bioHtml?: string;
  twitter?: string | null;
  linkedin?: string | null;
};

/**
 * The one person tile on the site — chapter organizers on About, and event
 * speakers/judges/mentors on an event page. Both surfaces show exactly the same
 * three things (photo, name, designation), so they share one component rather
 * than drifting apart.
 *
 * A real card, not a bare stack: Design-Philosophy.md §6 prescribes the plain
 * card variant (same radius, hairline border, no notch) for "dense lists,
 * sponsor logos, and anything repeating more than 3x", which a speaker grid is.
 * It also puts these on the same footing as the sponsor cards directly below
 * them on an event page, instead of leaving the people unbounded on the canvas.
 *
 * Centered, because the card is narrow and every line is short: a portrait
 * centered over a ragged-right name and title reads as two competing axes.
 *
 * The name is `text-small`, not `text-body` — a card is ~240px wide here, and
 * body-size bold text fills it and wraps most names.
 *
 * The designation is NOT uppercased. Uppercase Mono is the kit's label voice
 * (eyebrows, badges, dates) and a job title is content, not a label — set in
 * caps, a real title like "Graphics and UI/UX Designer" shouts and wraps. The
 * badge keeps its caps, because a badge IS a label.
 *
 * Both designation lines are `text-text-muted`, and the third `text-text-faint`
 * tier is deliberately not used here. That token is documented in globals.css
 * as the faintest value that still clears 4.5:1 — but that was measured against
 * the `--gdg-bg` canvas (#1e1e1e, 4.83:1). On this card's `bg-surface` fill
 * (#262626) the same value drops to 4.38:1 and fails AA. `text-text-muted`
 * holds 6.36:1 there. Hierarchy comes from order and the bold name instead.
 *
 * The bio and social handles don't fit a card this size, so they live behind
 * the "View profile" button at the bottom (`PersonDetails`). That button is
 * absent when there's nothing behind it — 8 of 155 real people on this chapter
 * have neither a bio nor a handle, and a control that opens an empty modal is
 * worse than no control.
 */
export function PersonCard({
  name,
  photo,
  title,
  secondaryTitle,
  badge,
  bioHtml = "",
  twitter = null,
  linkedin = null,
}: Props) {
  return (
    <div className="flex h-full flex-col items-center gap-3 rounded-card border border-hairline bg-surface p-4 text-center">
      <PersonAvatar name={name} photo={photo} />
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-small font-bold leading-tight text-text">{name}</p>
        {badge && (
          <span className="rounded-pill border border-accent px-2.5 py-0.5 font-mono text-eyebrow uppercase tracking-wide text-accent-text">
            {badge}
          </span>
        )}
        {title && <p className="font-mono text-meta leading-snug text-text-muted">{title}</p>}
        {secondaryTitle && (
          <p className="font-mono text-meta leading-snug text-text-muted">{secondaryTitle}</p>
        )}
      </div>
      {/* Predicate lives here, not alongside PersonDetails: that module is
          `"use client"`, and a Server Component may render a client component
          but never call a function exported from one. */}
      {(bioHtml || twitter || linkedin) && (
        <PersonDetails
          name={name}
          photo={photo}
          title={title}
          secondaryTitle={secondaryTitle}
          badge={badge}
          bioHtml={bioHtml}
          twitter={twitter}
          linkedin={linkedin}
        />
      )}
    </div>
  );
}
