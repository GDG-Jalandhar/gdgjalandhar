import type { SVGProps } from "react";

/**
 * The GDG brand kit ships no social-platform marks (not part of a chapter kit
 * by nature), and no icon library is installed. These are hand-drawn here as
 * stroke-only, 1.5px, currentColor line icons matching the kit's own glyph
 * weight — never vendor-colored brand marks, per Design-Philosophy.md §8.
 *
 * All four sit in the SAME rounded-square frame. They didn't originally:
 * Instagram and LinkedIn were framed while X and GitHub were bare marks drawn
 * to the full 24px box, so in a row of four the X read as roughly twice the
 * size of its neighbours. Consistency is the whole point of a house-drawn set —
 * if a fifth platform is added, frame it too.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  xmlns: "http://www.w3.org/2000/svg",
};

/** The shared enclosure. One radius for all four, so the row reads as a set. */
function Frame() {
  return <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5" />;
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <Frame />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.25" cy="6.75" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <Frame />
      {/* Inset to 8–16 so the cross has the same breathing room inside the
          frame as the Instagram lens and the LinkedIn "in". */}
      <path d="M8 8L16 16" />
      <path d="M16 8L8 16" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <Frame />
      <path d="M7.5 10.5V17" />
      <circle cx="7.5" cy="7" r="0.1" />
      <path d="M11.75 17V13.25C11.75 11.9036 12.8536 10.8 14.2 10.8C15.5464 10.8 16.5 11.9036 16.5 13.25V17" />
      <path d="M11.75 10.5V17" />
    </svg>
  );
}

// The octocat outline is drawn to the full 24px box, so it gets scaled down to
// sit inside the frame. `strokeWidth` is divided by the same factor, since a
// transform scales the stroke too and would otherwise leave GitHub visibly
// thinner than the other three.
const GITHUB_SCALE = 0.6;

export function GitHubIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <Frame />
      <g transform={`translate(4.97 4.39) scale(${GITHUB_SCALE})`} strokeWidth={1.5 / GITHUB_SCALE}>
        <path d="M9 19.5C5 20.7 5 17.5 3.5 17M15.5 21V18.13C15.5 17.2 15.17 16.6 14.79 16.29C17.29 16 19.92 15.05 19.92 10.68C19.92 9.46 19.48 8.46 18.76 7.68C18.88 7.38 19.27 6.23 18.65 4.68C18.65 4.68 17.7 4.37 15.53 5.85C14.62 5.6 13.65 5.47 12.68 5.47C11.71 5.47 10.74 5.6 9.83 5.85C7.66 4.37 6.71 4.68 6.71 4.68C6.09 6.23 6.48 7.38 6.6 7.68C5.88 8.46 5.44 9.47 5.44 10.68C5.44 15.04 8.06 16 10.56 16.3C10.26 16.57 9.99 17.05 9.9 17.75C9.25 18.04 7.6 18.53 6.58 16.79C6.58 16.79 5.98 15.7 4.84 15.62C4.84 15.62 3.73 15.61 4.76 16.31C4.76 16.31 5.51 16.66 6.03 17.98C6.03 17.98 6.7 20 9.86 19.31V21" />
      </g>
    </svg>
  );
}

export const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
} as const;

export type SocialPlatform = keyof typeof SOCIAL_ICONS;
