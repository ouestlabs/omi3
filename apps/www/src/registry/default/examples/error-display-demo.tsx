"use client";

import { AudioErrorDisplay } from "@/registry/default/ui/audio/error-display";

export default function AudioErrorDisplayDemo() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-medium text-sm">Default</h3>
        <AudioErrorDisplay />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Compact</h3>
        <AudioErrorDisplay variant="compact" />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Inline</h3>
        <AudioErrorDisplay variant="inline" />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Without Retry</h3>
        <AudioErrorDisplay showRetry={false} />
      </div>
      <p className="text-muted-foreground text-sm">
        Note: Error display will only appear when there is an actual playback
        error. To test, try playing an invalid audio URL.
      </p>
    </div>
  );
}
