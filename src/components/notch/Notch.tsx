import type { ReactNode } from "react";
import styles from "./Notch.module.css";

const NOTCH_W = 26;
const NOTCH_H = 15;
const RADIUS = 6;

// Rounded on the 3 untouched corners, sharp on the L-step per
// Design-Philosophy.md §6 ("The notch: a stepped corner ... implement with
// clip-path plus an SVG stroke overlay so the border follows the notch").
const STROKE_PATH = `
  M ${NOTCH_W} 0
  L ${100 - RADIUS} 0
  A ${RADIUS} ${RADIUS} 0 0 1 100 ${RADIUS}
  L 100 ${100 - RADIUS}
  A ${RADIUS} ${RADIUS} 0 0 1 ${100 - RADIUS} 100
  L ${RADIUS} 100
  A ${RADIUS} ${RADIUS} 0 0 1 0 ${100 - RADIUS}
  L 0 ${NOTCH_H}
  L ${NOTCH_W} ${NOTCH_H}
  Z
`.trim();

type Props = {
  /** The notch cavity holds one thing: a Mono eyebrow label. No eyebrow →
   * plain `.card` variant, never an empty notch (§6: "the notch must always
   * be carrying information"). */
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function Notch({ eyebrow, children, className }: Props) {
  if (!eyebrow) {
    return (
      <div className={[styles.card, className].filter(Boolean).join(" ")}>
        <div className="p-6 md:p-8">{children}</div>
      </div>
    );
  }

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      <div className={styles.fill}>
        <div className="px-6 pb-6 pt-16 md:px-8 md:pb-8 md:pt-20">{children}</div>
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
          d={STROKE_PATH}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className={`${styles.eyebrow} font-mono text-eyebrow uppercase tracking-wide text-accent-text`}>
        {eyebrow}
      </span>
    </div>
  );
}
