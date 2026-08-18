import { chapter } from "@/data/chapter";
import { SOCIAL_ICONS, type SocialPlatform } from "./icons";

const LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  x: "X",
  linkedin: "LinkedIn",
  github: "GitHub",
};

type Props = {
  className?: string;
  iconClassName?: string;
};

/**
 * One component, reused at the 3 places social links are allowed to appear
 * (header drawer, About, footer) — G-5.
 */
export function SocialLinks({ className, iconClassName = "h-5 w-5" }: Props) {
  const platforms = Object.keys(chapter.socials) as SocialPlatform[];
  return (
    <ul className={["flex items-center gap-4", className].filter(Boolean).join(" ")}>
      {platforms.map((platform) => {
        const Icon = SOCIAL_ICONS[platform];
        return (
          <li key={platform}>
            <a
              href={chapter.socials[platform]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GDG Jalandhar on ${LABELS[platform]}`}
              className="text-text-muted transition-colors hover:text-accent-text"
            >
              <Icon className={iconClassName} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
