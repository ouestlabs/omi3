import type {
  AudioEngineEventMap,
  BaseMetadata,
  PlaybackStateType,
  QueueItem,
  Track,
} from "../types";

/**
 * Defines the public interface for the audio engine.
 */
export type IAudioEngine = {
  /** The current playback state of the engine. */
  readonly playbackState: PlaybackStateType;
  /** The currently loaded track, or null if none. */
  readonly currentTrack: Track | null;
  /** The current queue, or null if none. */
  readonly queue: QueueItem[] | null;
  /** The ID of the currently active item in the queue, or null if none. */
  readonly activeItemId: string | number | null;
  /** The current volume level (0.0 to 1.0). */
  readonly volume: number;
  /** The duration of the current track in seconds (0 if unknown or not loaded). */
  readonly duration: number;
  /** The current playback position in seconds. */
  readonly currentTime: number;
  /** Whether the audio is currently muted (true if volume is 0 or muted property is set). */
  readonly isMuted: boolean;
  /** The current playback rate (1.0 is normal speed, 2.0 is double speed, etc.). */
  readonly playbackRate: number;
  /** Whether the engine is currently buffering data. */
  readonly isBuffering: boolean;
  /** The last error that occurred, or null if none. */
  readonly lastError: { code: number; message: string } | null;
  /** The latest frequency data for visualization, or null if not playing/available. */
  readonly frequencyData: Uint8Array | null;
  /** The Web Audio API AnalyserNode, or null if not initialized. */
  readonly analyserNode: AnalyserNode | null;
  /** The Web Audio API AudioContext, or null if not initialized. */
  readonly audioContext: AudioContext | null;
  /** The Web Audio API MediaElementAudioSourceNode, or null if not initialized. */
  readonly sourceNode: MediaElementAudioSourceNode | null;
  /** The underlying HTMLAudioElement used for playback. */
  readonly audioElement: HTMLAudioElement;

  /**
   * Loads a new track.
   * @param track The Track object to load.
   * @param startTime Optional time in seconds to start playback from once loaded.
   */
  load(track: Track, startTime?: number): Promise<void>;
  /**
   * Sets the queue.
   * @param queue Array of QueueItem objects, or null to clear the queue.
   */
  setQueue<TData = unknown, TMetadata extends BaseMetadata = BaseMetadata>(
    queue: QueueItem<TData, TMetadata>[] | null
  ): void;
  /**
   * Sets the active item in the queue by ID.
   * @param id The ID of the item to make active, or null to clear the active item.
   */
  setActiveItem(id: string | number | null): Promise<void>;
  /**
   * Checks if an item with the given ID is currently active.
   * @param id The ID to check.
   * @returns true if the item is active, false otherwise.
   */
  isItemActive(id: string | number | null): boolean;
  /** Starts or resumes playback. Initializes AudioContext if necessary. */
  play<TData = unknown, TMetadata extends BaseMetadata = BaseMetadata>(
    item?: QueueItem<TData, TMetadata> | null
  ): Promise<void>;
  /** Pauses playback. */
  pause(): void;
  /**
   * Seeks to a specific time in the current track.
   * @param time Time in seconds to seek to.
   */
  seek(time: number): void;
  /**
   * Sets the playback volume.
   * @param volume Volume level between 0.0 (silent) and 1.0 (maximum).
   */
  setVolume(volume: number): void;
  /**
   * Sets the playback rate.
   * @param rate Playback rate where 1.0 is normal speed, 2.0 is double speed, 0.5 is half speed, etc.
   */
  setPlaybackRate(rate: number): void;
  /** Cleans up resources used by the engine (event listeners, audio context, etc.). */
  dispose(): void;

  /**
   * Adds an event listener for audio engine events.
   * @param type The event type to listen for.
   * @param listener The callback function.
   * @param options Event listener options.
   */
  addEventListener<K extends keyof AudioEngineEventMap>(
    type: K,
    listener: (this: IAudioEngine, ev: AudioEngineEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  /**
   * Removes an event listener.
   * @param type The event type.
   * @param listener The callback function to remove.
   * @param options Event listener options.
   */
  removeEventListener<K extends keyof AudioEngineEventMap>(
    type: K,
    listener: (this: IAudioEngine, ev: AudioEngineEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;

  /**
   * Dispatches an event.
   * @param event The event to dispatch.
   */
  dispatchEvent<K extends keyof AudioEngineEventMap>(
    event: AudioEngineEventMap[K]
  ): boolean;
};
