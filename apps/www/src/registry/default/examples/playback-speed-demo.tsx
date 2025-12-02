"use client";

import { AudioPlaybackSpeed } from "@/registry/default/ui/audio/playback-speed";
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

export default function AudioPlaybackSpeedDemo() {
  return (
    <AudioPlayer className="w-max">
      <AudioPlayerControlBar>
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
  );
}
