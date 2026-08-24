import type { CSSProperties, ReactNode } from "react";
import styles from "./Notch.module.css";

const NOTCH_W = 26;
const RADIUS = 6;

/**
 * Notch depth, as a percentage of the card's own height — the clip-path and
 * the SVG overlay's `viewBox="0 0 100 100"` are coordinate-locked, so this one
 * number drives both (see Notch.module.css's header comment).
 *
 * Because it's proportional, the same percentage reads very differently on a
 * short card and a tall one. Design-Philosophy §6 specs the cavity at roughly
 * 40px tall, which is what these two variants are calibrated to:
 *
 *   default — the Hero's ~300px block.
 *   compact — event cards, which are ~555px tall since the square poster
 *             landed. At 15% those were cutting an 83px cavity to hold a 12px
 *             label; 8% brings it back to ~44px.
 */
const NOTCH_H = { default: 15, compact: 8 } as const;

/**
 * Top padding must clear the cavity, so it's paired with the depth above.
 *
 * `compact` is counter-intuitively LARGER on mobile: the depth is a percentage
 * of card height, and event cards are tallest in the single-column layout
 * below `sm` (a full-width square poster). Measured worst case is at 639px,
 * just under the two-column breakpoint: a 760px card cutting a 61px cavity,
 * which `pt-16` (64px) clears by 3px. Above `md` the three-column grid gives
 * ~505px cards and a ~41px cavity, so less padding is needed, not more.
 * If the card's content ever grows, re-check the 600-639px band first.
 */
const TOP_PADDING = {
  default: "pt-18 md:pt-24",
  compact: "pt-16 md:pt-14",
} as const;

type NotchSize = keyof typeof NOTCH_H;

// Rounded on the 3 untouched corners, sharp on the L-step per
// Design-Philosophy.md §6 ("The notch: a stepped corner ... implement with
// clip-path plus an SVG stroke overlay so the border follows the notch").
function strokePath(notchH: number): string {
  return `
  M ${NOTCH_W} 0
  L ${100 - RADIUS} 0
  A ${RADIUS} ${RADIUS} 0 0 1 100 ${RADIUS}
  L 100 ${100 - RADIUS}
  A ${RADIUS} ${RADIUS} 0 0 1 ${100 - RADIUS} 100
  L ${RADIUS} 100
  A ${RADIUS} ${RADIUS} 0 0 1 0 ${100 - RADIUS}
  L 0 ${notchH}
  L ${NOTCH_W} ${notchH}
  Z
`.trim();
}

type Props = {
  /** The notch cavity holds one thing: a Mono eyebrow label. No eyebrow →
   * plain `.card` variant, never an empty notch (§6: "the notch must always
   * be carrying information"). */
  eyebrow?: string;
  /** `compact` for tall containers (event cards) where the proportional
   * default cuts an oversized cavity. See NOTCH_H above. */
  size?: NotchSize;
  children: ReactNode;
  className?: string;
};

export function Notch({ eyebrow, size = "default", children, className }: Props) {
  if (!eyebrow) {
    return (
      <div className={[styles.card, className].filter(Boolean).join(" ")}>
        <div className="p-6 md:p-8">{children}</div>
      </div>
    );
  }

  const notchH = NOTCH_H[size];

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
      // Overrides the stylesheet's default so the clip-path stays locked to
      // the SVG path below, which is generated from the same number.
      style={{ "--notch-h": `${notchH}%` } as CSSProperties}
    >
      <div className={[styles.fill, "h-full"].filter(Boolean).join(" ")}>
        <div className={`px-6 pb-6 md:px-8 md:pb-8 ${TOP_PADDING[size]}`}>{children}</div>
      </div>
      {/* Siblings of .fill, not children of it — .fill's clip-path would
          otherwise cut the eyebrow entirely and halve the stroke's width
          along the notch boundary. See Notch.module.css's header comment. */}
      <svg
        className={styles.stroke}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={strokePath(notchH)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        className={`${styles.eyebrow} font-mono text-eyebrow uppercase tracking-wide text-accent-text`}
      >
        {eyebrow}
      </span>
    </div>
  );
}
