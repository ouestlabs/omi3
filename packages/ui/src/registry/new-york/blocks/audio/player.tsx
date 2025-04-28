"use client";
import { AudioProvider } from "@omi3/audio/react";
import { AudioControls } from "./elements/controls";
import { AudioFileInput } from "./elements/file-input";
import { AudioSeekBar } from "./elements/seek-bar";
import { AudioTrackInfo } from "./elements/track-info";
import { AudioVisualizer } from "./elements/visualizer";
import { AudioVolume } from "./elements/volume";

export function AudioPlayer() {
  return (
    <AudioProvider>
      <section
        aria-label="Audio Player Container"
        className="flex flex-col border rounded-lg p-2 w-full bg-card gap-2"
      >
        <AudioFileInput />
        <AudioVisualizer height={60} />
        <AudioSeekBar />
        <div className="flex items-center justify-between">
          <AudioTrackInfo />
          <div className="flex items-center gap-2">
            <AudioControls />
            <AudioVolume />
          </div>
        </div>
      </section>
    </AudioProvider>
  );
}
