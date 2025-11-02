import { PlaybackState } from "../../core/types";
import type { AudioEngineState } from "./types";

export type { AudioEngineState } from "./types";

export const initialState: AudioEngineState = {
  currentTime: 0,
  duration: 0,
  volume: 0.75,
  isMuted: false,
  playbackRate: 1,
  playbackState: PlaybackState.IDLE,
  isBuffering: false,
  error: null,
  currentTrack: null,
  queue: null,
  activeItemId: null,
  frequencyData: null,
  analyserNode: null,
  engineInstance: null,
};
