import type { QueueItem } from "../../core/queue";
import type { BaseMetadata, Track } from "../../core/types";
import type { AudioEngineState } from "../provider/types";

/**
 * Actions that update the audio store state directly.
 * These actions update the store without needing the engine instance.
 */
export type AudioStoreActions = {
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number, muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setPlaybackState: (state: AudioEngineState["playbackState"]) => void;
  setBuffering: (buffering: boolean) => void;
  setError: (error: { code?: number; message?: string } | null) => void;
  setCurrentTrack: (track: Track | null) => void;
  setQueue: <TData = unknown, TMetadata extends BaseMetadata = BaseMetadata>(
    queue: QueueItem<TData, TMetadata>[] | null
  ) => void;
  setActiveItemId: (id: string | number | null) => void;
  setFrequencyData: (data: Uint8Array | null) => void;
  setAnalyserNode: (node: AnalyserNode | null) => void;
  setEngineInstance: (engine: AudioEngineState["engineInstance"]) => void;
  reset: () => void;
};

/**
 * Engine-specific actions that require the engine instance.
 * These will be created in the provider where the engine is available.
 */
export type AudioEngineActions = {
  load: (track: Track, startTime?: number) => void;
  play: <TData = unknown, TMetadata extends BaseMetadata = BaseMetadata>(
    item?: QueueItem<TData, TMetadata> | null
  ) => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setQueue: <TData = unknown, TMetadata extends BaseMetadata = BaseMetadata>(
    queue: QueueItem<TData, TMetadata>[] | null
  ) => void;
  setActiveItem: (id: string | number | null) => Promise<void>;
  isItemActive: (id: string | number | null) => boolean;
};
