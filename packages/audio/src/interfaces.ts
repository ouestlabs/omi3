/**
 * Represents the possible playback states of the audio engine.
 */
export enum PlaybackState {
  /** Audio is stopped or not yet loaded */
  IDLE = "idle",
  /** Audio is currently loading */
  LOADING = "loading",
  /** Audio is loaded and ready to play */
  READY = "ready",
  /** Audio is currently playing */
  PLAYING = "playing",
  /** Audio is paused */
  PAUSED = "paused",
  /** An error occurred */
  ERROR = "error",
}

/**
 * Represents a music track with its metadata and URL.
 */
export interface Music {
  /** Optional unique identifier for the track */
  id?: string | number;
  /** URL of the audio file */
  url: string;
  /** Duration of the track in seconds (if known) */
  duration?: number;
  /** Audio codec (e.g., 'mp3', 'opus') */
  codec?: string;
  /** Bitrate in kbps (if known) */
  bitrate?: number;
  /** Sample rate in Hz (if known) */
  sampleRate?: number;
  /** Whether the audio is lossless */
  lossless?: boolean;
  /** Track title */
  title?: string;
  /** Track artist */
  artist?: string;
  /** Album title */
  album?: string;
  /** Artist associated with the album */
  albumArtist?: string;
  /** Composer */
  composer?: string;
  /** Genre */
  genre?: string;
  /** Year of release */
  year?: number | string;
  /** Track number within the album/disc */
  trackNumber?: number | string;
  /** Disc number if part of a multi-disc album */
  discNumber?: number | string;
  /** Comment embedded in the track */
  comment?: string;
  /** Lyrics */
  lyrics?: string;
  /** Software or hardware used to encode the file */
  encodedBy?: string;
  /** Artwork associated with the track (used for Media Session API) */
  artwork?: MediaImage;
  /** Beats per minute */
  bpm?: number;
  /** iTunes grouping metadata */
  grouping?: string;
  /** Musical key of the track */
  initialKey?: string;
  /** International Standard Recording Code */
  isrc?: string;
  /** Publisher */
  publisher?: string;
  /** Copyright information */
  copyright?: string;
}



/**
 * Map of event types dispatched by the AudioEngine and their corresponding CustomEvent detail types.
 */
export interface AudioEngineEventMap {
  /** Fired when playback starts. */
  "play": CustomEvent<void>;
  /** Fired when playback is paused. */
  "pause": CustomEvent<void>;
  /** Fired when playback ends naturally. */
  "ended": CustomEvent<void>;
  /** Fired when an error occurs (network, decode, format support, etc.). */
  "error": CustomEvent<{ code: number; message: string }>;
  /** Fired repeatedly during playback with the current time. */
  "timeUpdate": CustomEvent<{ currentTime: number }>;
  /** Fired when the audio duration becomes available or changes. */
  "durationChange": CustomEvent<{ duration: number }>;
  /** Fired when the volume or muted state changes. */
  "volumeChange": CustomEvent<{ volume: number; muted: boolean }>;
  /** Fired when the playback state changes (e.g., IDLE -> LOADING -> READY -> PLAYING). */
  "playbackStateChange": CustomEvent<{ state: PlaybackState }>;
  /** Fired when the engine starts or stops buffering. */
  "bufferingStateChange": CustomEvent<{ buffering: boolean }>;
  /** Fired when a new track is loaded. */
  "trackChange": CustomEvent<{ music: Music | null }>;
  /** Fired when a seek operation completes (internal event, may not be needed publicly). */
  "seek": CustomEvent<{ time: number }>;
  /** Fired when enough data has buffered to allow playback to start or resume. */
  "bufferLoaded": CustomEvent<void>;
  /** Fired when the media session requests the previous track. */
  "requestPreviousTrack": CustomEvent<void>;
  /** Fired when the media session requests the next track. */
  "requestNextTrack": CustomEvent<void>;
  /** Fired frequently during playback with frequency data for visualization. */
  "frequencyDataUpdate": CustomEvent<{ data: Uint8Array }>;
  /** Fired once the internal AudioContext and AnalyserNode are initialized. */
  "contextInitialized": CustomEvent<{ analyserNode: AnalyserNode | null }>;
}

/**
 * Defines the public interface for the audio engine.
 */
export interface IAudioEngine {
  /** The current playback state of the engine. */
  readonly playbackState: PlaybackState;
  /** The currently loaded music track, or null if none. */
  readonly currentMusic: Music | null;
  /** The current volume level (0.0 to 1.0). */
  readonly volume: number;
  /** The duration of the current track in seconds (0 if unknown or not loaded). */
  readonly duration: number;
  /** The current playback position in seconds. */
  readonly currentTime: number;
  /** Whether the audio is currently muted (true if volume is 0 or muted property is set). */
  readonly isMuted: boolean;
  /** Whether the engine is currently buffering data. */
  readonly isBuffering: boolean;
  /** The last error that occurred, or null if none. */
  readonly lastError: { code: number; message: string } | null;
  /** The latest frequency data for visualization, or null if not playing/available. */
  readonly frequencyData: Uint8Array | null;
  /** The Web Audio API AnalyserNode, or null if not initialized. */
  readonly analyserNode: AnalyserNode | null;

  /**
   * Loads a new music track.
   * @param music The Music object to load.
   * @param startTime Optional time in seconds to start playback from once loaded.
   */
  load(music: Music, startTime?: number): Promise<void>;
  /** Starts or resumes playback. Initializes AudioContext if necessary. */
  play(): Promise<void>;
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
    listener: (this: IAudioEngine, ev: AudioEngineEventMap[K]) => any,
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
    listener: (this: IAudioEngine, ev: AudioEngineEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;

  /**
   * Dispatches an event.
   * @param event The event to dispatch.
   */
  dispatchEvent<K extends keyof AudioEngineEventMap>(event: AudioEngineEventMap[K]): boolean;
}
