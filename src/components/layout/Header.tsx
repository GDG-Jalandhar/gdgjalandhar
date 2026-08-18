"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { chapter } from "@/data/chapter";
import { strings } from "@/lib/strings";
import { routeAccentFromPathname } from "@/lib/accent";

const NAV_ITEMS = [
  { href: "/", label: strings.nav.home },
  { href: "/events", label: strings.nav.events },
  { href: "/about", label: strings.nav.about },
];

// G-1/G-2: sticky header, logo links home, Join always visible outside the
// drawer below 768px — it must never require two taps.
export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const accent = routeAccentFromPathname(pathname);

  function closeDrawer() {
    setDrawerOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-hairline bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/85">
      <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="GDG Jalandhar — Home" className="shrink-0">
          {/* Stacked lockup below 768px — the horizontal lockup's wordmark
              alone is ~230px wide at readable height, which doesn't leave
              room for Join + the menu button on a 360px viewport. Design-
              Philosophy.md §3 names this exact case ("narrow ... constrained")
              as the stacked variant's job. */}
          <Logo variant="stacked" accent={accent} className="h-9 w-auto md:hidden" />
          <Logo variant="horizontal" accent={accent} className="hidden h-8 w-auto md:block" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-text transition-colors hover:text-accent-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button href={chapter.joinUrl} external analyticsEvent={{ name: "join_click", placement: "navbar" }}>
            {strings.nav.join}
          </Button>
          <button
            ref={toggleRef}
            type="button"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-text md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
              <path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={closeDrawer} navItems={NAV_ITEMS} />
    </header>
  );
}
