"use client";

import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerControlGroup,
  AudioPlayerPlay,
  AudioPlayerSeekBar,
  AudioPlayerSkipBack,
  AudioPlayerSkipForward,
  AudioPlayerTimeDisplay,
  AudioPlayerVolume,
} from "@/registry/default/ui/audio/player";
import {
  AudioQueue,
  AudioQueueRepeatMode,
  AudioQueueShuffle,
} from "@/registry/default/ui/audio/queue";
import { AudioPlaybackSpeed } from "@/registry/default/ui/audio/playback-speed";
import { AudioHistory } from "@/registry/default/ui/audio/history";
import { AudioMetadata } from "@/registry/default/ui/audio/metadata";
import { AudioErrorDisplay } from "@/registry/default/ui/audio/error-display";

export default function AudioPlayerWithAllFeaturesDemo() {
  return (
    <div className="space-y-6">
      <AudioErrorDisplay variant="inline" />
      <AudioPlayer className="w-full">
        <AudioPlayerControlBar>
          <AudioPlayerControlGroup>
            <AudioQueueShuffle />
            <AudioQueueRepeatMode />
            <AudioQueue />
            <AudioHistory />
            <AudioMetadata />
          </AudioPlayerControlGroup>
          <AudioPlayerControlGroup>
            <AudioPlayerSkipBack />
            <AudioPlayerPlay />
            <AudioPlayerSkipForward />
          </AudioPlayerControlGroup>
          <AudioPlayerControlGroup>
            <AudioPlayerTimeDisplay />
            <AudioPlayerSeekBar />
            <AudioPlayerTimeDisplay remaining />
          </AudioPlayerControlGroup>
          <AudioPlayerControlGroup>
            <AudioPlaybackSpeed />
            <AudioPlayerVolume />
          </AudioPlayerControlGroup>
        </AudioPlayerControlBar>
      </AudioPlayer>
    </div>
  );
}
