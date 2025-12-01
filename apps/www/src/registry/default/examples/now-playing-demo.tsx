"use client";

import { AudioNowPlaying } from "@/registry/default/ui/audio/now-playing";

export default function AudioNowPlayingDemo() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-medium text-sm">Default</h3>
        <AudioNowPlaying />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Compact</h3>
        <AudioNowPlaying variant="compact" />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Minimal</h3>
        <AudioNowPlaying variant="minimal" />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Without Seekbar</h3>
        <AudioNowPlaying showSeekBar={false} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Without Controls</h3>
        <AudioNowPlaying showControls={false} />
      </div>
    </div>
  );
}
