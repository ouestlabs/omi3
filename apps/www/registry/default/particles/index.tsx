/** biome-ignore-all lint/suspicious/noExplicitAny: any is used to allow any type of component */
import type React from "react";
import AudioControls from "./particle-controls";
import AudioFileInput from "./particle-file-input";
import AudioPlayer from "./particle-player";
import AudioSeekBar from "./particle-seek-bar";
import AudioTrackInfo from "./particle-track-info";
import AudioVisualizer from "./particle-visualizer";
import AudioVolume from "./particle-volume";

type ParticleComponent = React.ComponentType<any>;

type ParticleItem = {
  id: string;
  component: ParticleComponent;
  fullWidth?: boolean;
  className?: string;
  category?: string[];
};

export const particles: ParticleItem[] = [
  {
    id: "audio-file-input",
    component: AudioFileInput,
    category: ["file"],
    className: "**:data-[slot=particle-wrapper]:w-full",
  },
  {
    id: "audio-controls",
    component: AudioControls,
    category: ["controls"],
    className: "**:data-[slot=particle-wrapper]:w-full",
  },
  {
    id: "audio-seek-bar",
    component: AudioSeekBar,
    category: ["seek-bar"],
    className: "**:data-[slot=particle-wrapper]:w-full",
  },
  {
    id: "audio-track-info",
    component: AudioTrackInfo,
    category: ["track-info"],
    className: "**:data-[slot=particle-wrapper]:w-full",
  },
  {
    id: "audio-visualizer",
    component: AudioVisualizer,
    category: ["visualizer"],
    className: "**:data-[slot=particle-wrapper]:w-full",
  },
  {
    id: "audio-volume",
    component: AudioVolume,
    category: ["volume"],
    className:
      "**:data-[slot=particle-wrapper]:w-full  **:data-[slot=menu-trigger]:place-self-center **:data-[slot=menu-trigger]:flex",
  },
  {
    id: "audio-player",
    component: AudioPlayer,
    category: ["player"],
    className: "**:data-[slot=particle-wrapper]:w-full ",
  },
];
