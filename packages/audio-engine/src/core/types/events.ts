import type { QueueItem } from "../queue";
import type { Track } from "./base";
import type { PlaybackStateType } from "./playback-state";

/**
 * Map of event types dispatched by the AudioEngine and their corresponding CustomEvent detail types.
 */
export type AudioEngineEventMap = {
  /** Fired when playback starts. */
  play: CustomEvent<void>;
  /** Fired when playback is paused. */
  pause: CustomEvent<void>;
  /** Fired when playback ends naturally. */
  ended: CustomEvent<void>;
  /** Fired when an error occurs (network, decode, format support, etc.). */
  error: CustomEvent<{ code: number; message: string }>;
  /** Fired repeatedly during playback with the current time. */
  timeUpdate: CustomEvent<{ currentTime: number }>;
  /** Fired when the audio duration becomes available or changes. */
  durationChange: CustomEvent<{ duration: number }>;
  /** Fired when the volume or muted state changes. */
  volumeChange: CustomEvent<{ volume: number; muted: boolean }>;
  /** Fired when the playback rate changes. */
  playbackRateChange: CustomEvent<{ playbackRate: number }>;
  /** Fired when the playback state changes (e.g., IDLE -> LOADING -> READY -> PLAYING). */
  playbackStateChange: CustomEvent<{ state: PlaybackStateType }>;
  /** Fired when the engine starts or stops buffering. */
  bufferingStateChange: CustomEvent<{ buffering: boolean }>;
  /** Fired when a new track is loaded. */
  trackChange: CustomEvent<{ track: Track | null }>;
  /** Fired when the queue changes. */
  queueChange: CustomEvent<{ queue: QueueItem[] | null }>;
  /** Fired when the active item in the queue changes. */
  activeItemChange: CustomEvent<{ activeItemId: string | number | null }>;
  /** Fired when a seek operation completes (internal event, may not be needed publicly). */
  seek: CustomEvent<{ time: number }>;
  /** Fired when enough data has buffered to allow playback to start or resume. */
  bufferLoaded: CustomEvent<void>;
  /** Fired when the media session requests the previous track. */
  requestPreviousTrack: CustomEvent<void>;
  /** Fired when the media session requests the next track. */
  requestNextTrack: CustomEvent<void>;
  /** Fired frequently during playback with frequency data for visualization. */
  frequencyDataUpdate: CustomEvent<{ data: Uint8Array }>;
  /** Fired once the internal AudioContext and AnalyserNode are initialized. */
  contextInitialized: CustomEvent<{ analyserNode: AnalyserNode | null }>;
};
