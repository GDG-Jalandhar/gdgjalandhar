import Image from "next/image";
import { Glyph } from "@/components/glyphs/Glyph";
import type { GdgEvent } from "@/lib/gdg/types";

type Props = {
  media: GdgEvent["media"];
  sizes: string;
  priority?: boolean;
};

/**
 * D-6: detects Bevy's own placeholder banner (`GDG_Bevy_DefaultEventBanner`
 * in the URL) and substitutes a branded fallback instead of showing Bevy's
 * generic stock photo.
 */
export function EventBanner({ media, sizes, priority }: Props) {
  if (!media.banner || media.isDefaultBanner) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-accent/40 bg-surface-2">
        <Glyph name="globe" className="h-10 w-10 text-accent" />
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-accent/40">
      <Image src={media.banner} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
