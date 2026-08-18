import { RouteAccent } from "@/components/layout/RouteAccent";
import { Button } from "@/components/ui/Button";
import { strings } from "@/lib/strings";

// G-7: 404 route with working nav back to Home and Events.
export default function NotFound() {
  return (
    <RouteAccent value="red">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-start gap-6 px-5 py-24 md:px-8">
        <p className="font-mono text-eyebrow uppercase tracking-wide text-accent-text">404</p>
        <h1 className="text-h1 text-text">{strings.notFound.title}</h1>
        <p className="max-w-md text-body text-text-muted">{strings.notFound.body}</p>
        <div className="flex flex-wrap gap-4">
          <Button href="/">{strings.notFound.backHome}</Button>
          <Button href="/events" variant="secondary">
            {strings.notFound.viewEvents}
          </Button>
        </div>
      </div>
    </RouteAccent>
  );
}
