import { RouteAccent } from "@/components/layout/RouteAccent";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/glyphs/Glyph";
import { strings } from "@/lib/strings";

// P-5: branded offline fallback for uncached routes, in brand voice, with a
// link back to cached content. Precached explicitly by the Serwist route
// handler's `additionalPrecacheEntries` so this page itself works offline.
export default function OfflinePage() {
  return (
    <RouteAccent value="red">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-start gap-6 px-5 py-24 md:px-8">
        <Glyph name="globe" className="h-10 w-10 text-accent" />
        <h1 className="text-h1 text-text">{strings.offline.pageTitle}</h1>
        <p className="max-w-md text-body text-text-muted">{strings.offline.pageBody}</p>
        <Button href="/">{strings.offline.backHome}</Button>
      </div>
    </RouteAccent>
  );
}
