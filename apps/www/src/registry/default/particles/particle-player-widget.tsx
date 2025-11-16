"use client";

import {
  AudioControlBar,
  AudioControlGroup,
  AudioPlay,
  AudioPlayer,
  AudioSeekBar,
  AudioSkipBack,
  AudioSkipForward,
  AudioTimeDisplay,
  AudioVolume,
} from "@/registry/default/ui/audio/player";
import {
  AudioQueueRepeatMode,
  AudioQueueShuffle,
} from "@/registry/default/ui/audio/queue";
import { AudioTrackList } from "@/registry/default/ui/audio/track";

export default function ParticlePlayerWidget() {
  return (
    <AudioPlayer className="flex flex-col gap-1.5">
      <AudioTrackList className="h-36 w-full rounded-sm border bg-muted/50 p-1" />
      <AudioControlBar variant="stacked">
        <AudioControlGroup>
          <AudioTimeDisplay />
          <AudioSeekBar />
          <AudioTimeDisplay remaining />
        </AudioControlGroup>
        <AudioControlGroup>
          <AudioControlGroup>
            <AudioSkipBack />
            <AudioPlay />
            <AudioSkipForward />
          </AudioControlGroup>
          <AudioQueueShuffle />
          <AudioQueueRepeatMode />
          <AudioVolume />
        </AudioControlGroup>
      </AudioControlBar>
    </AudioPlayer>
  );
}
