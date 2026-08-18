"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/glyphs/Glyph";
import { strings } from "@/lib/strings";
import { trackEvent } from "@/lib/analytics";

const SNOOZE_KEY = "gdgjal:install-snooze-until";
const DISMISS_COUNT_KEY = "gdgjal:install-dismiss-count";
const SESSION_SHOWN_KEY = "gdgjal:install-shown-session";
const SNOOZE_DAYS = 30;
const MAX_DISMISSALS = 2;
const ENGAGEMENT_DELAY_MS = 30_000;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isEventDetailRoute(pathname: string) {
  return /^\/events\/[^/]+$/.test(pathname) && pathname !== "/events";
}

function isIos() {
  return typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function canShowPrompt() {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(SESSION_SHOWN_KEY)) return false;
  const dismissCount = Number(localStorage.getItem(DISMISS_COUNT_KEY) ?? "0");
  if (dismissCount >= MAX_DISMISSALS) return false;
  const snoozeUntil = Number(localStorage.getItem(SNOOZE_KEY) ?? "0");
  if (Date.now() < snoozeUntil) return false;
  return true;
}

function dismiss() {
  sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
  const dismissCount = Number(localStorage.getItem(DISMISS_COUNT_KEY) ?? "0") + 1;
  localStorage.setItem(DISMISS_COUNT_KEY, String(dismissCount));
  localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000));
  trackEvent({ name: "pwa_install_dismissed" });
}

// P-7: engagement-gated install prompt. Android/Chromium captures
// `beforeinstallprompt`; iOS gets a manual "Add to Home Screen" sheet since
// that event doesn't exist there. Never fires before the engagement trigger,
// never when already standalone, at most once per session, and stops for
// good after two dismissals — the footer/drawer "Install app" entry point
// is what makes that safe (P-7e).
export function InstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (isStandalone()) return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    function onAppInstalled() {
      trackEvent({ name: "pwa_install_accepted" });
      setVisible(false);
      sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (isStandalone() || triggeredRef.current || !canShowPrompt()) return;

    function trigger(nextPlatform: "android" | "ios") {
      if (triggeredRef.current || !canShowPrompt()) return;
      triggeredRef.current = true;
      setPlatform(nextPlatform);
      setVisible(true);
      trackEvent({ name: "pwa_install_prompted" });
    }

    const ios = isIos();

    if (isEventDetailRoute(pathname)) {
      if (ios) trigger("ios");
      else if (deferredPrompt) trigger("android");
      return;
    }

    let scrolledPastHero = false;
    function onScroll() {
      if (window.scrollY > window.innerHeight * 0.6) scrolledPastHero = true;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    const timer = setTimeout(() => {
      if (!scrolledPastHero) return;
      if (ios) trigger("ios");
      else if (deferredPrompt) trigger("android");
    }, ENGAGEMENT_DELAY_MS);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [pathname, deferredPrompt]);

  if (!visible || !platform) return null;

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    trackEvent(outcome === "accepted" ? { name: "pwa_install_accepted" } : { name: "pwa_install_dismissed" });
    setVisible(false);
    sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
  }

  return (
    <div
      role="dialog"
      aria-label={strings.pwa.install}
      className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-3 rounded-card border border-hairline bg-surface p-4 shadow-lg md:inset-x-auto md:right-4 md:w-96 md:rounded-card-lg"
    >
      {platform === "android" ? (
        <>
          <p className="text-body text-text">{strings.pwa.installBody}</p>
          <div className="flex gap-3">
            <Button onClick={handleInstallClick}>{strings.pwa.installAction}</Button>
            <Button
              variant="ghost"
              onClick={() => {
                dismiss();
                setVisible(false);
              }}
            >
              Not now
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-body font-bold text-text">{strings.pwa.iosInstructionsTitle}</p>
          <p className="flex items-center gap-1.5 text-small text-text-muted">
            Tap
            <Glyph name="arrowRight" className="h-3.5 w-3.5 -translate-y-px" />
            Share, then &quot;Add to Home Screen&quot;. Works in Safari.
          </p>
          <Button
            variant="ghost"
            className="w-fit"
            onClick={() => {
              dismiss();
              setVisible(false);
            }}
          >
            Got it
          </Button>
        </>
      )}
    </div>
  );
}
