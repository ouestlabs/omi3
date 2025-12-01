"use client";

import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerPlay,
} from "@/registry/default/ui/audio/player";
import { AudioMetadata } from "@/registry/default/ui/audio/metadata";

export default function AudioMetadataDemo() {
  return (
    <div className="space-y-4">
      <AudioPlayer className="w-max">
        <AudioPlayerControlBar>
          <AudioPlayerPlay />
          <AudioMetadata buttonLabel="Track Info" />
        </AudioPlayerControlBar>
      </AudioPlayer>
      <p className="text-muted-foreground text-sm">
        Click the info button to view detailed metadata about the current track,
        including technical information like ready state, network state, and
        buffered data.
      </p>
    </div>
  );
}
