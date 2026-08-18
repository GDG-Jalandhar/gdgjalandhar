import { glyphPaths, type GlyphName } from "./paths";

/**
 * The kit has no "three-person group" glyph in the provided asset drop
 * (brand-kit/assets/glyphs/{Thin,Fat}), so it's hand-drawn here in the same
 * stroke-only style as the rest of the Thin set. See Design-Philosophy.md §6.
 */
const COMMUNITY_VIEWBOX = "0 0 200 140";
const COMMUNITY_PATHS = [
  "M100 66C114.36 66 126 54.36 126 40C126 25.64 114.36 14 100 14C85.64 14 74 25.64 74 40C74 54.36 85.64 66 100 66Z",
  "M46 126C46 96.7695 70.7695 74 100 74C129.23 74 154 96.7695 154 126",
  "M40 60C50.4934 60 59 51.4934 59 41C59 30.5066 50.4934 22 40 22C29.5066 22 21 30.5066 21 41C21 51.4934 29.5066 60 40 60Z",
  "M2 112C2 89.4609 19.4609 72 40 72C48.7031 72 56.7461 75.1523 63.0977 80.4023",
  "M160 60C170.493 60 179 51.4934 179 41C179 30.5066 170.493 22 160 22C149.507 22 141 30.5066 141 41C141 51.4934 149.507 60 160 60Z",
  "M198 112C198 89.4609 180.539 72 160 72C151.297 72 143.254 75.1523 136.902 80.4023",
] as const;

type Props = {
  name: GlyphName | "community";
  className?: string;
};

/**
 * Decorative outline glyph: stroke-only, 1.5px-equivalent, currentColor,
 * always aria-hidden. Never place more than two per section (Design-Philosophy.md §6).
 */
export function Glyph({ name, className }: Props) {
  if (name === "community") {
    return (
      <svg
        viewBox={COMMUNITY_VIEWBOX}
        fill="none"
        aria-hidden="true"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {COMMUNITY_PATHS.map((d, i) => (
          <path key={i} d={d} stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
    );
  }

  const def = glyphPaths[name];
  return (
    <svg
      viewBox={def.viewBox}
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {def.paths.map((p, i) =>
        p.joinAttr === "strokeLinejoin" ? (
          <path key={i} d={p.d} stroke="currentColor" strokeWidth={p.strokeWidth} strokeLinejoin={p.joinValue as "round"} />
        ) : (
          <path key={i} d={p.d} stroke="currentColor" strokeWidth={p.strokeWidth} strokeMiterlimit={p.joinValue} />
        ),
      )}
    </svg>
  );
}
