import type { ReactNode } from "react";
import type { AccentColor } from "@/components/brand/Logo";

type Props = {
  value: AccentColor;
  children: ReactNode;
};

/**
 * Sets `data-accent` on a wrapper around this route's own content (not on
 * `<html>`) — a single root layout stays intact so client-side navigation
 * between routes keeps working offline (§7.7), and Event detail can pick its
 * accent from fetched data (green if upcoming, yellow if past) rather than a
 * static per-route value. Zero client JS: this is a plain RSC element.
 */
export function RouteAccent({ value, children }: Props) {
  return (
    <div data-accent={value} className="contents">
      {children}
    </div>
  );
}
