import Image from "next/image";
import { Glyph } from "@/components/glyphs/Glyph";
import type { GdgEvent } from "@/lib/gdg/types";

type Props = {
  media: GdgEvent["media"];
  sizes: string;
  priority?: boolean;
};

/**
 * The wide event banner, for the DETAIL page only. `cropped_banner_url` is a
 * 2560x640 Cloudinary crop — exactly 4:1, verified against the live chapter —
 * so `aspect-banner` shows it whole. Cards use `EventThumbnail` instead: the
 * same artwork downscaled 8.5x into a ~300px card loses its fine type.
 *
 * D-6: Bevy's own placeholder (`GDG_Bevy_DefaultEventBanner`) is swapped for a
 * branded fallback rather than showing its generic stock photo.
 */
export function EventBanner({ media, sizes, priority }: Props) {
  if (!media.banner || media.isDefaultBanner) {
    return <BrandedFallback className="aspect-banner" />;
  }

  return (
    <div className="relative aspect-banner overflow-hidden rounded-lg border border-accent/40">
      <Image src={media.banner} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}

/**
 * The square poster, for CARDS. `cropped_picture_url` is a 1000x1000 asset —
 * the one the artwork was actually designed for — and it renders uncropped at
 * `aspect-square`, so nothing is trimmed and the downscale is a gentle ~3x.
 *
 * Note this checks `isDefaultThumbnail`, NOT `isDefaultBanner`: Bevy uses two
 * different placeholder markers and they disagree. Several events ship a
 * placeholder banner alongside real poster art.
 *
 * Backgrounds vary (white, grey, near-black) because organizers author them.
 * That's deliberate — no tint or blend is applied, since normalising them would
 * distort the artwork this component exists to show faithfully.
 */
export function EventThumbnail({ media, sizes, priority }: Props) {
  if (!media.thumbnail || media.isDefaultThumbnail) {
    return <BrandedFallback className="aspect-square" />;
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border border-accent/40">
      <Image src={media.thumbnail} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}

/**
 * Shown wherever Bevy has no real artwork — roughly half of past events, so
 * this is a first-class state, not an edge case.
 */
function BrandedFallback({ className }: { className: string }) {
  return (
    <div
      className={`flex ${className} items-center justify-center gap-3 rounded-lg border border-accent/40 bg-surface-2`}
    >
      <Glyph name="globe" className="h-6 w-6 text-accent md:h-8 md:w-8" />
      <span className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">
        GDG Jalandhar
      </span>
    </div>
  );
}
