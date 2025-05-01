export enum PlaybackState {
  IDLE = "idle",
  LOADING = "loading",
  READY = "ready",
  PLAYING = "playing",
  PAUSED = "paused",
  ERROR = "error",
}

export interface Music {
  id?: string | number;
  url: string;
  duration?: number;
  codec?: string;
  bitrate?: number;
  sampleRate?: number;
  lossless?: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArtist?: string;
  composer?: string;
  genre?: string;
  year?: number | string;
  trackNumber?: number | string;
  discNumber?: number | string;
  comment?: string;
  lyrics?: string;
  encodedBy?: string;
  artwork?: MediaImage;
  bpm?: number;
  grouping?: string;
  initialKey?: string;
  isrc?: string;
  publisher?: string;
  copyright?: string;
};

export type MediaImage = { src: string; type?: string; sizes?: string };

export interface AudioEngineEventMap {
  "play": CustomEvent<void>;
  "pause": CustomEvent<void>;
  "ended": CustomEvent<void>;
  "error": CustomEvent<{ code: number; message: string }>;
  "timeUpdate": CustomEvent<{ currentTime: number }>;
  "durationChange": CustomEvent<{ duration: number }>;
  "volumeChange": CustomEvent<{ volume: number; muted: boolean }>;
  "playbackStateChange": CustomEvent<{ state: PlaybackState }>;
  "bufferingStateChange": CustomEvent<{ buffering: boolean }>;
  "trackChange": CustomEvent<{ music: Music | null }>;
  "seek": CustomEvent<{ time: number }>;
  "bufferLoaded": CustomEvent<void>;
  "requestPreviousTrack": CustomEvent<void>;
  "requestNextTrack": CustomEvent<void>;
  "frequencyDataUpdate": CustomEvent<{ data: Uint8Array }>;
}

export interface IAudioEngine {
  readonly playbackState: PlaybackState;
  readonly currentMusic: Music | null;
  readonly volume: number;
  readonly duration: number;
  readonly currentTime: number;
  readonly isMuted: boolean;
  readonly isBuffering: boolean;
  readonly lastError: { code: number; message: string } | null;
  readonly frequencyData: Uint8Array | null;
  readonly analyserNode: AnalyserNode | null;

  load(music: Music, startTime?: number): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  seek(time: number): void;
  setVolume(volume: number): void;
  dispose(): void;

  addEventListener<K extends keyof AudioEngineEventMap>(
    type: K,
    listener: (this: IAudioEngine, ev: AudioEngineEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof AudioEngineEventMap>(
    type: K,
    listener: (this: IAudioEngine, ev: AudioEngineEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;

  dispatchEvent<K extends keyof AudioEngineEventMap>(event: AudioEngineEventMap[K]): boolean;
}
