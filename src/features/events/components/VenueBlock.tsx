import { Glyph } from "@/components/glyphs/Glyph";
import type { GdgEvent } from "@/lib/gdg/types";

type Props = {
  venue: GdgEvent["venue"];
  virtualUrl: string | null;
  audience: GdgEvent["audience"];
};

// D-2/D-3: venue block with an "Open in Maps" link built from the address
// parts (honouring `show_map`), plus the virtual join link for
// VIRTUAL/HYBRID events — a hybrid event shows both.
export function VenueBlock({ venue, virtualUrl, audience }: Props) {
  const showVenue = venue && (audience === "IN_PERSON" || audience === "HYBRID");
  const showVirtual = virtualUrl && (audience === "VIRTUAL" || audience === "HYBRID");

  if (!showVenue && !showVirtual) return null;

  return (
    <div className="flex flex-col gap-4">
      {showVenue && venue && (
        <div className="flex items-start gap-3">
          <Glyph name="globe" className="mt-1 h-5 w-5 shrink-0 text-accent" />
          <div className="flex flex-col gap-1">
            <p className="text-body text-text">{venue.name}</p>
            {venue.address && (
              <p className="font-mono text-meta text-text-muted">
                {[venue.address, venue.city, venue.state, venue.zip].filter(Boolean).join(", ")}
              </p>
            )}
            {venue.showMap && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  [venue.name, venue.address, venue.city].filter(Boolean).join(", "),
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-mono text-meta text-accent-text hover:underline"
              >
                Open in Maps →
              </a>
            )}
          </div>
        </div>
      )}
      {showVirtual && (
        <div className="flex items-start gap-3">
          <Glyph name="globe" className="mt-1 h-5 w-5 shrink-0 text-accent" />
          <a href={virtualUrl} target="_blank" rel="noopener noreferrer" className="text-body text-accent-text hover:underline">
            Join online →
          </a>
        </div>
      )}
    </div>
  );
}
