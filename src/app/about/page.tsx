import type { Metadata } from "next";
import { RouteAccent } from "@/components/layout/RouteAccent";
import { Button } from "@/components/ui/Button";
import { TeamCard } from "@/features/about/components/TeamCard";
import { chapter } from "@/data/chapter";
import { team } from "@/data/team";
import { yearsSince } from "@/lib/format";
import { strings } from "@/lib/strings";

export const metadata: Metadata = {
  title: "About",
  description: "Who GDG Jalandhar is, the team behind it, and how to get involved.",
  alternates: { canonical: "/about" },
};

// A-1/A-7: lead with the chapter's age — founded Feb 2011 makes it one of
// the longest-running GDG chapters in India, the strongest credibility
// signal available for a prospective speaker or sponsor.
export default function AboutPage() {
  const speakSubject = encodeURIComponent("Speaking at GDG Jalandhar");
  const sponsorSubject = encodeURIComponent("Sponsoring GDG Jalandhar");

  return (
    <RouteAccent value="yellow">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-16 px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">
            EST. FEB {chapter.foundedISO.slice(0, 4)} · {yearsSince()} YEARS RUNNING
          </p>
          <h1 className="mt-2 text-h1 text-text">About {chapter.name}</h1>
          <p className="mt-4 text-body text-text-muted">
            Google Developer Groups are inclusive local communities — all levels welcome, beginners
            explicitly included. In Jalandhar, that means talks, hands-on workshops, and hackathons
            across Android, Web, Cloud, and AI, run by volunteers for the developer community in Punjab.
            We&apos;ve been doing this since February 2011, which makes us one of the longest-running GDG
            chapters in India.
          </p>
        </div>

        <section className="flex flex-col gap-6">
          <p className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">{"// TEAM"}</p>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {team.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <p className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">
            {strings.about.getInvolvedEyebrow}
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <GetInvolvedCard
              title="Join"
              body="Become part of the community — RSVP to events and get updates."
              href={chapter.joinUrl}
              external
              cta={strings.hero.joinCommunity}
            />
            <GetInvolvedCard
              title="Speak"
              body="Have something to teach? We're always looking for speakers."
              href={`mailto:${chapter.contactEmail}?subject=${speakSubject}`}
              cta={strings.about.speak}
            />
            <GetInvolvedCard
              title="Sponsor"
              body="Help us host better events for the community."
              href={`mailto:${chapter.contactEmail}?subject=${sponsorSubject}`}
              cta={strings.about.sponsor}
            />
          </div>
        </section>

        <section id="code-of-conduct" className="flex flex-col gap-3 scroll-mt-20">
          <h2 className="text-h2 text-text">{strings.about.codeOfConduct}</h2>
          <p className="max-w-2xl text-body text-text-muted">
            Every GDG Jalandhar event follows Google&apos;s community Code of Conduct — a harassment-free,
            inclusive experience for everyone, regardless of experience level.
          </p>
          <a
            href="https://developers.google.com/community-guidelines"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit font-mono text-meta text-accent-text hover:underline"
          >
            Read the full Code of Conduct →
          </a>
        </section>

        <div>
          <Button href={chapter.joinUrl} external analyticsEvent={{ name: "join_click", placement: "about" }}>
            {strings.hero.joinCommunity}
          </Button>
        </div>
      </div>
    </RouteAccent>
  );
}

function GetInvolvedCard({
  title,
  body,
  href,
  cta,
  external,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
  external?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface p-6 md:rounded-card-lg">
      <h3 className="text-h3 text-text">{title}</h3>
      <p className="flex-1 text-small text-text-muted">{body}</p>
      <Button href={href} external={external} variant="ghost" className="w-fit">
        {cta}
      </Button>
    </div>
  );
}
