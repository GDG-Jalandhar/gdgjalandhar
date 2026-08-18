import Link from "next/link";
import { strings } from "@/lib/strings";

type Props = {
  active: "upcoming" | "past";
};

// E-1/E-2: a segmented control whose selection is a real navigation (?tab=),
// so it survives refresh and sharing — no client state needed.
export function EventTabs({ active }: Props) {
  const tabs: { key: "upcoming" | "past"; label: string; href: string }[] = [
    { key: "upcoming", label: strings.events.upcoming, href: "/events?tab=upcoming" },
    { key: "past", label: strings.events.past, href: "/events?tab=past" },
  ];

  return (
    <div role="tablist" className="inline-flex gap-1 rounded-pill border border-hairline bg-surface p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          role="tab"
          aria-selected={active === tab.key}
          className={
            active === tab.key
              ? "rounded-pill bg-accent px-5 py-2 font-medium text-bg"
              : "rounded-pill px-5 py-2 font-medium text-text-muted transition-colors hover:text-text"
          }
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
