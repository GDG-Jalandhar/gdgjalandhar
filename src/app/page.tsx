import { Suspense } from "react";
import type { Metadata } from "next";
import { RouteAccent } from "@/components/layout/RouteAccent";
import { Hero } from "@/features/home/components/Hero";
import { HeroSkeleton } from "@/features/home/components/HeroSkeleton";
import { WhoWeAre } from "@/features/home/components/WhoWeAre";
import { WhatsNext } from "@/features/home/components/WhatsNext";
import { Recently } from "@/features/home/components/Recently";
import { StripSkeleton } from "@/features/home/components/StripSkeleton";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Suspense boundaries per PRD §7.3: shell/nav render immediately, the hero
// is the first boundary, "What's next" and "Recently" are separate
// lower-priority boundaries — a slow past-events call must never hold up
// the next event's date.
export default function Home() {
  return (
    <RouteAccent value="blue">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-16 px-5 py-16 md:px-8 md:py-24">
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>

        <WhoWeAre />

        <Suspense fallback={<StripSkeleton />}>
          <WhatsNext />
        </Suspense>

        <Suspense fallback={<StripSkeleton />}>
          <Recently />
        </Suspense>
      </div>
    </RouteAccent>
  );
}
