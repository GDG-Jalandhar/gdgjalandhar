"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/social/SocialLinks";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { chapter } from "@/data/chapter";
import { strings } from "@/lib/strings";

type NavItem = { href: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

// Focus trap + Esc-to-close + focus-returns-to-trigger, per
// Design-Philosophy.md §10 ("Full keyboard operability including the mobile
// drawer"). G-2: Join stays outside this drawer, in the header bar.
//
// The trap itself lives in `useFocusTrap`, shared with the person detail
// modal. Focus restore stays here-ish — `Header` owns it, via the `onClose` it
// passes down.
export function MobileDrawer({ open, onClose, navItems }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open, onClose);

  if (!open) return null;

  // Portaled to <body>: the header is `backdrop-blur`ed, and CSS filter/
  // backdrop-filter on an ancestor makes it the containing block for
  // `position: fixed` descendants — without the portal this drawer gets
  // clipped to the header's own 56px box instead of covering the viewport.
  return createPortal(
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-bg/70"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col gap-8 border-l border-hairline bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="rounded-md px-2 py-3 text-h3 text-text transition-colors hover:text-accent-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-6">
          <SocialLinks />
          <InstallAppButton className="w-fit text-left font-mono text-meta text-text-muted transition-colors hover:text-accent-text" />
          <Button
            href={chapter.joinUrl}
            external
            analyticsEvent={{ name: "join_click", placement: "navbar" }}
            onClick={onClose}
          >
            {strings.nav.join}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
