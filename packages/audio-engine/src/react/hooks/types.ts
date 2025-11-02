import type { AudioEffect, AudioEffectsProcessor } from "../../core/effects";
import type { IAudioEngine } from "../../core/engine";
import type { QueueState } from "../../core/queue";
import type {
  BaseMetadata,
  PlaybackStateType,
  QueueItem,
  Track,
} from "../../core/types";

/**
 * Granular state structure for playback-related properties
 */
export type AudioPlaybackState = {
  state: PlaybackStateType;
  isPlaying: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  currentTrack: Track | null;
};

/**
 * Granular state structure for engine status-related properties
 */
export type AudioStatusState = {
  engine: IAudioEngine | null;
  isInitialized: boolean;
  analyserNode: AnalyserNode | null;
  audioContext: AudioContext | null;
  audioElement: HTMLAudioElement | null;
  sourceNode: MediaElementAudioSourceNode | null;
};

/**
 * Granular state structure for volume-related properties
 */
export type AudioVolumeState = {
  volume: number;
  isMuted: boolean;
};

/**
 * Granular state structure for visualization-related properties
 */
export type AudioVisualizationState = {
  frequencyData: number[];
  rawFrequencyData: Uint8Array | null;
  isActive: boolean;
};

/**
 * Granular state structure for error-related properties
 */
export type AudioErrorState = {
  error: { code?: number; message?: string } | null;
};

/**
 * Granular state structure for queue-related properties
 */
export type AudioQueueState<
  TData = unknown,
  TMetadata extends BaseMetadata = BaseMetadata,
> = {
  items: QueueItem<TData, TMetadata>[];
  current: QueueItem<TData, TMetadata> | null;
  history: QueueItem<TData, TMetadata>[];
  activeItemId: string | number | null;
  config: {
    repeatMode: QueueState["repeatMode"];
    shuffleMode: boolean;
  };
};

/**
 * Granular actions structure for playback-related actions
 */
export type AudioPlaybackActions<
  TData = unknown,
  TMetadata extends BaseMetadata = BaseMetadata,
> = {
  play: (item?: QueueItem<TData, TMetadata> | null) => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  load: (track: Track, startTime?: number) => void;
  setPlaybackRate: (rate: number) => void;
};

/**
 * Granular actions structure for volume-related actions
 */
export type AudioVolumeActions = {
  setVolume: (volume: number) => void;
  toggleMute: () => void;
};

/**
 * Granular actions structure for queue-related actions
 */
export type AudioQueueActions<
  TData = unknown,
  TMetadata extends BaseMetadata = BaseMetadata,
> = {
  setQueue: (queue: QueueItem<TData, TMetadata>[] | null) => void;
  setActiveItem: (id: string | number | null) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  skipForward: (seconds: number) => void;
  skipBackward: (seconds: number) => void;
};

/**
 * Granular effects structure
 */
export type AudioEffects = {
  apply: (effects: AudioEffect[]) => void;
  update: (effect: AudioEffect) => void;
  updateWetDry: (effectId: string, wet: number, dry: number) => void;
  processor: AudioEffectsProcessor | null;
};

/**
 * Complete return type for useAudio hook
 */
export type UseAudioReturn<
  TData = unknown,
  TMetadata extends BaseMetadata = BaseMetadata,
> = {
  state: {
    playback: AudioPlaybackState;
    status: AudioStatusState;
    volume: AudioVolumeState;
    visualization: AudioVisualizationState;
    error: AudioErrorState;
    queue: AudioQueueState<TData, TMetadata>;
  };
  actions: {
    playback: AudioPlaybackActions;
    volume: AudioVolumeActions;
    queue: AudioQueueActions<TData, TMetadata>;
  };
  effects: AudioEffects;
  queue: AudioQueueState<TData, TMetadata> & {
    actions: AudioQueueActions<TData, TMetadata>;
  };
};
