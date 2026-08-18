"use client";

import { Button } from "@/components/ui/Button";
import { strings } from "@/lib/strings";

// E-6: error state with a Retry that re-runs the query — Next's `reset()`
// re-renders the segment, which re-triggers the failed fetch.
export default function EventsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[1140px] flex-col items-start gap-4 px-5 py-16 md:px-8 md:py-24">
      <p className="text-body text-text-muted">{strings.events.error.replace(" →", "")}</p>
      <Button variant="secondary" onClick={reset}>
        {strings.events.retry}
      </Button>
    </div>
  );
}
