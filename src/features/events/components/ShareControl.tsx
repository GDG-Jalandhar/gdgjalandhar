"use client";

import { useState } from "react";
import { Glyph } from "@/components/glyphs/Glyph";
import { strings } from "@/lib/strings";
import type { GdgEvent } from "@/lib/gdg/types";

type Props = {
  share: GdgEvent["share"];
  title: string;
};

// D-11: Web Share API with `static_url` (short, built for sharing), copy-
// link fallback. Hidden entirely when `sharing_disabled` is true.
export function ShareControl({ share, title }: Props) {
  const [copied, setCopied] = useState(false);

  if (!share.enabled) return null;

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: share.url });
        return;
      } catch {
        // user cancelled or Web Share unavailable at runtime — fall through to copy
      }
    }
    await navigator.clipboard.writeText(share.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 font-mono text-meta text-text-muted transition-colors hover:text-accent-text"
    >
      <Glyph name="arrowRight" className="h-4 w-4 -rotate-45" />
      {copied ? strings.eventDetail.linkCopied : strings.eventDetail.share}
    </button>
  );
}
