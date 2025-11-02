import type { IAudioEngine } from "../../core/engine/types";
import type { QueueItem } from "../../core/queue";
import type { Track } from "../../core/types";
import type { PlaybackStateType } from "../../core/types/playback-state";

/**
 * Audio engine state managed by the React store
 */
export type AudioEngineState = {
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  playbackState: PlaybackStateType;
  isBuffering: boolean;
  error: { code?: number; message?: string } | null;
  currentTrack: Track | null;
  queue: QueueItem[] | null;
  activeItemId: string | number | null;
  frequencyData: Uint8Array | null;
  analyserNode: AnalyserNode | null;
  engineInstance: IAudioEngine | null;
};
