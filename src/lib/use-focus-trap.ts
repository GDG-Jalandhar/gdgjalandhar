"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal dialog keyboard behaviour: focus the panel's first control on open,
 * cycle Tab/Shift+Tab within it, close on Escape, and stop the page behind
 * from scrolling. Design-Philosophy.md §10 ("full keyboard operability").
 *
 * Extracted from `MobileDrawer`, which used to hand-roll it, once a second
 * dialog needed the same thing — two copies of a focus trap is exactly the
 * kind of thing that drifts apart.
 *
 * Focus RESTORE is deliberately not here: it belongs to whatever opened the
 * dialog, since only that component knows what to focus on the way out. See
 * `Header.closeDrawer` and `PersonDetails`.
 *
 * The focusable list is re-queried on every Tab rather than cached on open, so
 * a panel whose contents change while open (a bio that has finished streaming,
 * a conditionally rendered link) still traps correctly.
 */
export function useFocusTrap(
  panelRef: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    // Restoring the previous inline value rather than clearing it, so this
    // can't stomp a style set elsewhere.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [panelRef, open, onClose]);
}
