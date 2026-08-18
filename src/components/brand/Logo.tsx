export type LogoVariant = "horizontal" | "stacked";
export type AccentColor = "blue" | "green" | "yellow" | "red";

const FILE_PREFIX: Record<LogoVariant, string> = {
  horizontal: "GDG-Jalandhar-Logo",
  stacked: "GDGLogo-top-bottom",
};

const COLOR_SUFFIX: Record<AccentColor, string> = {
  blue: "Blue",
  green: "Green",
  yellow: "Yellow",
  red: "Red",
};

// Intrinsic display dimensions matching each file's real aspect ratio
// (horizontal 5171:620, stacked 4391:1496) — prevents CLS; actual rendered
// size is controlled by the caller's className (e.g. `h-8 w-auto`).
const INTRINSIC: Record<LogoVariant, { width: number; height: number }> = {
  horizontal: { width: 517, height: 62 },
  stacked: { width: 293, height: 100 },
};

type Props = {
  variant?: LogoVariant;
  /**
   * Colors the "Jalandhar" location line only (the kit's "Editable Location"
   * slot) — matches the current route's accent, per Design-Philosophy.md §4.2.
   * The chevron mark itself always uses all four Google core colors; that's
   * fixed across every file and is the one sanctioned "all four colors"
   * exception (§4.2).
   */
  accent?: AccentColor;
  className?: string;
};

/**
 * The horizontal/stacked lockups only ship a light-wordmark ("-Light") and a
 * dark-wordmark variant. This site is dark-first/single-mode (§4.4), so the
 * dark-canvas ("-Light", white wordmark) file is always the right one —
 * verified by rendering both against #1e1e1e (see Phase 0 asset-ingestion work).
 */
export function Logo({ variant = "horizontal", accent = "blue", className }: Props) {
  const src = `/brand/logos/${FILE_PREFIX[variant]}-${COLOR_SUFFIX[accent]}-Light.svg`;
  const { width, height } = INTRINSIC[variant];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- vector brand asset, next/image adds no value here
    <img
      src={src}
      alt="Google Developer Group Jalandhar"
      width={width}
      height={height}
      className={className}
    />
  );
}
