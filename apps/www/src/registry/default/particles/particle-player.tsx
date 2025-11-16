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
  AudioQueue,
  AudioQueueRepeatMode,
  AudioQueueShuffle,
} from "@/registry/default/ui/audio/queue";

export default function ParticleAudioPlayer() {
  return (
    <AudioPlayer>
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
          <AudioQueue />
        </AudioControlGroup>
      </AudioControlBar>
    </AudioPlayer>
  );
}
