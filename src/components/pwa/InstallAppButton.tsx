"use client";

import { useEffect, useState } from "react";
import { strings } from "@/lib/strings";
import { trackEvent } from "@/lib/analytics";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos() {
  return typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
}

// P-7e: the permanent, quiet entry point in the footer and mobile drawer —
// always visible, so the interruptive engagement-gated prompt (InstallPrompt.tsx)
// only ever needs to appear once. Independent of that component's own
// beforeinstallprompt capture; both can coexist safely.
export function InstallAppButton({ className }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  async function handleClick() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      trackEvent(outcome === "accepted" ? { name: "pwa_install_accepted" } : { name: "pwa_install_dismissed" });
      return;
    }
    if (isIos()) {
      setShowIosHint((v) => !v);
    }
  }

  return (
    <div className="relative">
      <button type="button" onClick={handleClick} className={className}>
        {strings.pwa.install}
      </button>
      {showIosHint && (
        <p className="mt-2 max-w-xs font-mono text-meta text-text-muted">
          Tap Share, then &quot;Add to Home Screen&quot;. Works in Safari.
        </p>
      )}
    </div>
  );
}
