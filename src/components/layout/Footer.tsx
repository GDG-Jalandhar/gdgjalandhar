import { Logo } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/social/SocialLinks";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { chapter } from "@/data/chapter";
import { strings } from "@/lib/strings";

// G-4: stacked logo lockup, socials, contact, Code of Conduct link, an
// "Install app" entry point (P-7e), a Mono credit line.
export function Footer() {
  return (
    <footer className="border-t border-hairline bg-bg px-5 py-16 md:px-8">
      <div className="mx-auto flex max-w-[1140px] flex-col items-start gap-8">
        <Logo variant="stacked" className="h-16 w-auto" />
        <SocialLinks />
        <nav className="flex flex-col gap-3 font-mono text-meta text-text-muted">
          <a href={`mailto:${chapter.contactEmail}`} className="transition-colors hover:text-accent-text">
            {chapter.contactEmail}
          </a>
          <a href="/about#code-of-conduct" className="transition-colors hover:text-accent-text">
            {strings.about.codeOfConduct}
          </a>
          <InstallAppButton className="w-fit text-left transition-colors hover:text-accent-text" />
        </nav>
        <p className="font-mono text-meta text-text-faint">{strings.footer.since}</p>
      </div>
    </footer>
  );
}
