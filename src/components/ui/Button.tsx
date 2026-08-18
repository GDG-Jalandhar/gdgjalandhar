"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Glyph } from "@/components/glyphs/Glyph";
import { trackEvent, type JoinPlacement } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost";

// A plain, serializable event descriptor rather than an onClick closure, so
// Server Components (e.g. the Home page) can pass tracking intent down to
// this Client Component without crossing the server/client boundary with a
// live function — React Server Components can't pass event handlers as props.
type AnalyticsIntent = { name: "join_click"; placement: JoinPlacement } | { name: "rsvp_click"; slug: string };

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  analyticsEvent?: AnalyticsIntent;
};

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

type ButtonProps = CommonProps & {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const VARIANT_CLASSES: Record<Variant, string> = {
  // Solid accent fill, dark text on bright accent (Design-Philosophy.md §8) —
  // "one primary per viewport" is a content discipline, not enforceable in CSS.
  primary:
    "inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-accent px-6 font-medium text-bg transition-colors hover:opacity-90",
  secondary:
    "inline-flex h-12 items-center justify-center gap-2 rounded-pill border-[1.5px] border-accent px-6 font-medium text-accent-text transition-colors hover:bg-accent-soft",
  ghost:
    "inline-flex items-center gap-1.5 font-medium text-accent-text underline decoration-transparent transition-colors hover:decoration-current",
};

function GhostArrow() {
  return <Glyph name="arrowRight" className="h-3.5 w-3.5" />;
}

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", children, className, analyticsEvent, ...rest } = props;
  const classes = [VARIANT_CLASSES[variant], className].filter(Boolean).join(" ");
  const content =
    variant === "ghost" ? (
      <>
        {children}
        <GhostArrow />
      </>
    ) : (
      children
    );

  function handleClick() {
    if (analyticsEvent) trackEvent(analyticsEvent);
  }

  if ("href" in props && props.href) {
    const { href, external, onClick, ...anchorRest } = rest as Omit<LinkProps, keyof CommonProps>;
    const onClickCombined: typeof onClick = (e) => {
      handleClick();
      onClick?.(e as never);
    };
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={onClickCombined}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClickCombined} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const { onClick, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={classes}
      onClick={(e) => {
        handleClick();
        onClick?.(e);
      }}
      {...buttonRest}
    >
      {content}
    </button>
  );
}
