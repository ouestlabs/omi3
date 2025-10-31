"use client";
import AudioControls from "@/registry/default/particles/particle-controls";
import AudioFileInput from "@/registry/default/particles/particle-file-input";
import AudioSeekBar from "@/registry/default/particles/particle-seek-bar";
import AudioTrackInfo from "@/registry/default/particles/particle-track-info";
import AudioVisualizer from "@/registry/default/particles/particle-visualizer";
import AudioVolume from "@/registry/default/particles/particle-volume";

function AudioPlayer() {
  return (
    <section
      className="flex w-full flex-col gap-3 rounded-lg border bg-card p-3"
      data-slot="particle-wrapper"
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
  );
}

export default AudioPlayer;
