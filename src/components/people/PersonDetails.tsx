"use client";

import { useCallback, useId, useRef, useState } from "react";
import { PersonAvatar } from "./PersonAvatar";
import { Button } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { SOCIAL_ICONS } from "@/components/social/icons";
import { linkedinUrl, twitterUrl } from "@/lib/gdg/format-people";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { strings } from "@/lib/strings";

export type PersonDetailsProps = {
  name: string;
  photo: string | null;
  title: string;
  secondaryTitle?: string;
  badge?: "Organizer" | "Speaker" | "Member";
  /** Already sanitized upstream by `toBioHtml` — this never sanitizes. */
  bioHtml: string;
  twitter: string | null;
  linkedin: string | null;
};

/**
 * The "View profile" trigger and the dialog it opens — bio and socials, the
 * detail the card has no room for.
 *
 * Only this trigger and dialog are client components; `PersonCard` around it
 * stays a Server Component, so a grid of twenty speakers ships one small
 * bundle rather than twenty rendered cards.
 *
 * Unlike `MobileDrawer` this is NOT portaled to `document.body`, and that is
 * deliberate. The drawer portals because it lives inside the `backdrop-blur`
 * header, and a `backdrop-filter` ancestor becomes the containing block for
 * `position: fixed`. No such ancestor exists here — but `RouteAccent`'s
 * `[data-accent]` wrapper is one, and portaling out of it would drop the modal
 * back to the `:root` blue on a green event page or the yellow About page,
 * breaking the one-accent-family rule (Design-Philosophy.md §4.2).
 *
 * The close control is text, not an icon, and the social links carry text
 * labels beside their marks. The kit ships no close glyph, and X's own mark is
 * two crossed lines — an unlabelled X in a dialog reads as "close", not as a
 * link to someone's profile. Confirmed by looking at the rendered modal, where
 * the two sat one above the other and were genuinely indistinguishable.
 */
export function PersonDetails({
  name,
  photo,
  title,
  secondaryTitle,
  badge,
  bioHtml,
  twitter,
  linkedin,
}: PersonDetailsProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headingId = useId();

  // The opener restores focus, matching `Header.closeDrawer`. Stable identity
  // so the trap's effect isn't torn down and rebuilt on every render.
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useFocusTrap(panelRef, open, close);

  const links = [
    { href: twitterUrl(twitter), Icon: SOCIAL_ICONS.x, name: "X", label: strings.people.onX },
    {
      href: linkedinUrl(linkedin),
      Icon: SOCIAL_ICONS.linkedin,
      name: "LinkedIn",
      label: strings.people.onLinkedIn,
    },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href));

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        className="mt-auto pt-2 text-meta"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {strings.people.viewProfile}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label={strings.people.close}
            className="absolute inset-0 bg-bg/70"
            onClick={close}
          />
          {/* `text-left` is load-bearing: this renders inside PersonCard, which
              is `text-center`, and a centered bio is unreadable at this width. */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className="relative flex max-h-[85vh] w-full max-w-lg flex-col gap-5 overflow-y-auto rounded-card border border-hairline bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-left md:rounded-card-lg"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-5 top-5 font-mono text-meta uppercase tracking-wide text-text-muted transition-colors hover:text-accent-text"
            >
              {strings.people.close}
            </button>

            {/* Right padding keeps a long name clear of the close control. */}
            <div className="flex items-start gap-4 pr-20">
              <PersonAvatar name={name} photo={photo} />
              <div className="flex min-w-0 flex-col items-start gap-1.5">
                <h2 id={headingId} className="text-h3 text-text">
                  {name}
                </h2>
                {badge && (
                  <span className="rounded-pill border border-accent px-2.5 py-0.5 font-mono text-eyebrow uppercase tracking-wide text-accent-text">
                    {badge}
                  </span>
                )}
                {title && <p className="font-mono text-meta text-text-muted">{title}</p>}
                {secondaryTitle && (
                  <p className="font-mono text-meta text-text-muted">{secondaryTitle}</p>
                )}
              </div>
            </div>

            {bioHtml && <Prose html={bioHtml} />}

            {links.length > 0 && (
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline pt-4">
                {links.map(({ href, Icon, label, name: platform }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${name} ${label}`}
                      className="inline-flex items-center gap-2 font-mono text-meta text-text-muted transition-colors hover:text-accent-text"
                    >
                      <Icon className="h-4 w-4" />
                      {platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
