import type { GdgEvent } from "@/lib/gdg/types";
import { strings } from "@/lib/strings";

// D-9/D-10: "Cohosted with {chapter_title}" whenever chapter_id !== 781 —
// honest attribution, and it explains why a foreign-city event is in our list.
export function CohostBadge({ cohost }: { cohost: GdgEvent["cohost"] }) {
  if (cohost.isOurs) return null;

  return (
    <a
      href={cohost.chapterUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-2 rounded-full border border-hairline px-3 py-1 font-mono text-meta text-text-muted transition-colors hover:text-accent-text"
    >
      {strings.eventDetail.cohostedWith} {cohost.chapterTitle}
    </a>
  );
}
