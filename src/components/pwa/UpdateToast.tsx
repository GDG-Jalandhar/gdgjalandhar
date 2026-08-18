"use client";

import { useEffect, useState } from "react";
import { useSerwist } from "@serwist/turbopack/react";
import { Button } from "@/components/ui/Button";
import { strings } from "@/lib/strings";

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

// P-8/P-8a/P-8b/P-8c: checks for updates on load, on visibilitychange back to
// the tab, and on a 60-minute interval. When a new worker reaches `waiting`,
// shows a dismissible toast whose Reload button posts SKIP_WAITING and
// reloads once the new worker takes control — guarded so a reload can only
// ever fire once per session, never a loop.
export function UpdateToast() {
  const { serwist } = useSerwist();
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (!serwist) return;
    const sw = serwist;

    let reloaded = false;

    function onWaiting() {
      setWaiting(true);
    }
    function onControlling() {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    }

    sw.addEventListener("waiting", onWaiting);
    sw.addEventListener("controlling", onControlling);

    let cancelled = false;
    function onVisibilityChange() {
      if (document.visibilityState === "visible") sw.update();
    }
    // `sw.active` resolves once this instance's registration is actually
    // active — calling `update()` any earlier races SerwistProvider's own
    // registration and throws "Cannot update ... without being registered."
    let interval: ReturnType<typeof setInterval> | undefined;
    sw.active.then(() => {
      if (cancelled) return;
      sw.update();
      document.addEventListener("visibilitychange", onVisibilityChange);
      interval = setInterval(() => sw.update(), UPDATE_CHECK_INTERVAL_MS);
    });

    return () => {
      cancelled = true;
      sw.removeEventListener("waiting", onWaiting);
      sw.removeEventListener("controlling", onControlling);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(interval);
    };
  }, [serwist]);

  if (!waiting) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 flex items-center justify-between gap-4 rounded-card border border-hairline bg-surface p-4 shadow-lg md:inset-x-auto md:right-4 md:w-80 md:rounded-card-lg"
    >
      <p className="text-small text-text">{strings.pwa.updateAvailable}</p>
      <Button variant="secondary" onClick={() => serwist?.messageSkipWaiting()}>
        {strings.pwa.reload}
      </Button>
    </div>
  );
}
