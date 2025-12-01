"use client";

import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerPlay,
} from "@/registry/default/ui/audio/player";
import { AudioHistory } from "@/registry/default/ui/audio/history";

export default function AudioHistoryDemo() {
  return (
    <div className="space-y-4">
      <AudioPlayer className="w-max">
        <AudioPlayerControlBar>
          <AudioPlayerPlay />
          <AudioHistory maxItems={20} />
        </AudioPlayerControlBar>
      </AudioPlayer>
      <p className="text-muted-foreground text-sm">
        Click the history button to view recently played tracks. The history
        will be populated as you play tracks.
      </p>
    </div>
  );
}
