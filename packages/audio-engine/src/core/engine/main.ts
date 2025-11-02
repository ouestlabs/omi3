import type { QueueItem } from "../queue";
import {
  type AudioEngineEventMap,
  type BaseMetadata,
  PlaybackState,
  type PlaybackStateType,
  type Track,
} from "../types";
import { logger } from "../utils/logger";
import type { IAudioEngine } from "./types";

const FFT_SIZE = 256;
const RETRY_DELAY = 1000;
const MIN_PLAYBACK_RATE = 0.25;
const MAX_PLAYBACK_RATE = 4;

/**
 * Core audio playback engine using HTMLAudioElement and Web Audio API for analysis.
 * Implements the IAudioEngine interface.
 */
export class AudioEngine implements IAudioEngine {
  private readonly audio: HTMLAudioElement;
  private _audioContext: AudioContext | null = null;
  analyserNode: AnalyserNode | null = null;
  private _sourceNode: MediaElementAudioSourceNode | null = null;
  private frequencyDataBuffer: Uint8Array<ArrayBuffer> | null = null;
  private _frequencyData: Uint8Array | null = null;
  private animationFrameId: number | null = null;

  private playPromise: Promise<void> | null = null;
  private retryAttempts = 0;
  private readonly maxRetries = 3;
  private readonly eventTarget = new EventTarget();
  private _currentTrack: Track | null = null;
  private _queue: QueueItem[] | null = null;
  private _activeItemId: string | number | null = null;
  private _playbackState: PlaybackStateType = PlaybackState.IDLE;
  private seekOnReadyTime: number | null = null;
  private _isBuffering = false;
  private _lastError: { code: number; message: string } | null = null;
  private boundListeners: { [key: string]: EventListener } = {};

  private isContextInitialized = false;

  constructor() {
    if (typeof window === "undefined" || !window.document) {
      throw new Error("AudioEngine requires a browser environment.");
    }
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.setupEventListeners();
    this.setVolume(1);
    this.setupMediaSessionHandlers();

    this.initAudioContext();
  }

  private initAudioContext(): boolean {
    if (this.isContextInitialized || typeof window === "undefined") {
      return this.isContextInitialized;
    }
    try {
      this._audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      this.analyserNode = this._audioContext.createAnalyser();
      this.analyserNode.fftSize = FFT_SIZE;
      this.frequencyDataBuffer = new Uint8Array(
        this.analyserNode.frequencyBinCount
      );
      this._sourceNode = this._audioContext.createMediaElementSource(
        this.audio
      );

      this._sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this._audioContext.destination);

      this.isContextInitialized = true;
      this.dispatchCustomEvent("contextInitialized", {
        analyserNode: this.analyserNode,
      });

      if (this._audioContext.state === "suspended") {
        this._audioContext.resume().catch((error) => {
          console.warn(
            "AudioEngine: Failed to resume AudioContext on init:",
            error
          );
        });
      }

      return true;
    } catch (error) {
      console.error("AudioEngine: Failed to initialize AudioContext:", error);
      this.isContextInitialized = false;
      this._audioContext = null;
      this.analyserNode = null;
      this._sourceNode = null;
      this.frequencyDataBuffer = null;
      this.dispatchCustomEvent("contextInitialized", { analyserNode: null });
      return false;
    }
  }

  get playbackState(): PlaybackStateType {
    return this._playbackState;
  }
  get currentTrack(): Track | null {
    return this._currentTrack;
  }
  get queue(): QueueItem[] | null {
    return this._queue;
  }
  get activeItemId(): string | number | null {
    return this._activeItemId;
  }
  get volume(): number {
    return this.audio.volume;
  }
  get duration(): number {
    const dur = this.audio.duration;
    return !Number.isNaN(dur) && Number.isFinite(dur) ? dur : 0;
  }
  get currentTime(): number {
    const time = this.audio.currentTime;
    return Number.isNaN(time) ? 0 : time;
  }
  get isMuted(): boolean {
    return this.audio.muted || this.audio.volume === 0;
  }
  get playbackRate(): number {
    return this.audio.playbackRate;
  }
  get isBuffering(): boolean {
    return this._isBuffering;
  }
  get lastError(): { code: number; message: string } | null {
    return this._lastError;
  }
  get frequencyData(): Uint8Array | null {
    return this._frequencyData;
  }
  get audioElement(): HTMLAudioElement {
    return this.audio;
  }

  get audioContext(): AudioContext | null {
    return this._audioContext;
  }

  get sourceNode(): MediaElementAudioSourceNode | null {
    return this._sourceNode;
  }

  /**
   * Sets the queue.
   *
   * @param queue Array of QueueItem objects, or null to clear the queue.
   */
  setQueue<TData = unknown, TMetadata extends BaseMetadata = BaseMetadata>(
    queue: QueueItem<TData, TMetadata>[] | null
  ): void {
    logger.info("Engine", `Queue updated: ${queue?.length ?? 0} items`);
    this._queue = queue;
    this.dispatchCustomEvent("queueChange", { queue: this._queue });
  }

  /**
   * Sets the active item in the queue by ID.
   *
   * @param id The ID of the item to make active, or null to clear the active item.
   */
  async setActiveItem(id: string | number | null): Promise<void> {
    if (id === this._activeItemId) {
      return;
    }

    this._activeItemId = id;
    this.dispatchCustomEvent("activeItemChange", {
      activeItemId: this._activeItemId,
    });

    if (id === null) {
      await this.load({ url: "" });
      return;
    }

    if (!this._queue) {
      return;
    }

    const item = this._queue.find((track) => track.id === id);
    if (item) {
      await this.load(item);
    }
  }

  /**
   * Checks if an item with the given ID is currently active.
   *
   * @param id The ID to check.
   * @returns true if the item is active, false otherwise.
   */
  isItemActive(id: string | number | null): boolean {
    return this._activeItemId === id;
  }

  /**
   * Loads a new track into the engine.
   * Stops current playback and replaces the audio source.
   *
   * @param track The Track object containing URL and metadata.
   * @param startTime Optional time (in seconds) to seek to once the track is ready.
   */
  load(track: Track, startTime?: number): Promise<void> {
    logger.info("Engine", `Loading track: ${track.url}`, { startTime });
    this._lastError = null;
    this.seekOnReadyTime = startTime ?? null;
    this.setPlaybackState(PlaybackState.LOADING);
    this._isBuffering = true;
    this.dispatchCustomEvent("bufferingStateChange", { buffering: true });

    const previousTrack = this._currentTrack;
    this._currentTrack = track;
    this.dispatchCustomEvent("trackChange", { track: this._currentTrack });

    this.updateMediaSessionMetadata();

    try {
      if (
        this.audio.src === track.url &&
        this.audio.readyState > HTMLMediaElement.HAVE_NOTHING
      ) {
        let targetState: PlaybackStateType = PlaybackState.LOADING;
        if (this.audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          targetState = PlaybackState.READY;
        } else if (this.audio.readyState === HTMLMediaElement.HAVE_NOTHING) {
          this.audio.load();
          targetState = PlaybackState.LOADING;
        }

        if (this._playbackState !== targetState) {
          this.setPlaybackState(targetState);
        }

        if (this._playbackState === PlaybackState.READY) {
          this._isBuffering = false;
          this.dispatchCustomEvent("bufferLoaded");
          this.dispatchCustomEvent("durationChange", {
            duration: this.duration,
          });
        }
        return Promise.resolve();
      }

      if (!this.audio.paused) {
        this.audio.pause();
      }
      this.audio.src = track.url;
      this.audio.preload = "auto";
      this.retryAttempts = 0;
      this.audio.load();
      return Promise.resolve();
    } catch (error) {
      logger.error("Engine", "Load process error", { error, track: track.url });
      console.error("AudioEngine: Load process error:", error);
      this._currentTrack = previousTrack;
      this.setPlaybackState(PlaybackState.ERROR);
      const errDetail = {
        code: -1,
        message: error instanceof Error ? error.message : "Unknown load error",
      };
      this._lastError = errDetail;
      this.dispatchCustomEvent("error", errDetail);
      this.dispatchCustomEvent("trackChange", { track: this._currentTrack });
      return Promise.resolve();
    }
  }

  /**
   * Handles queue item selection before playback.
   *
   * @param item Optional QueueItem to play.
   * @returns true if playback should continue, false if it should stop.
   */
  private async handleQueueItem<
    TData = unknown,
    TMetadata extends BaseMetadata = BaseMetadata,
  >(item?: QueueItem<TData, TMetadata> | null): Promise<boolean> {
    if (item === undefined) {
      return true;
    }

    if (item === null) {
      this.pause();
      return false;
    }

    const itemId = item.id;
    if (!this.isItemActive(itemId)) {
      await this.setActiveItem(itemId);
    }
    return true;
  }

  /**
   * Initiates playback of the loaded track or a specific queue item.
   * Resumes if paused, starts from the beginning or `startTime` if loaded.
   * Initializes the AudioContext on the first play attempt if necessary.
   *
   * @param item Optional QueueItem to play. If provided, sets it as active and loads it.
   * @returns A promise that resolves when playback begins or rejects if an error occurs.
   */
  async play<TData = unknown, TMetadata extends BaseMetadata = BaseMetadata>(
    item?: QueueItem<TData, TMetadata> | null
  ): Promise<void> {
    logger.info("Engine", "Play requested", { itemId: item?.id });
    const shouldContinue = await this.handleQueueItem(item);
    if (!shouldContinue) {
      return;
    }

    if (this._audioContext?.state === "suspended") {
      try {
        await this._audioContext.resume();
      } catch (resumeError) {
        console.error(
          "AudioEngine: Failed to resume AudioContext:",
          resumeError
        );
        const errDetail = {
          code: -4,
          message: "Failed to resume AudioContext.",
        };
        this._lastError = errDetail;
        this.dispatchCustomEvent("error", errDetail);
        this.setPlaybackState(PlaybackState.ERROR);
        return;
      }
    }

    if (
      this._playbackState !== PlaybackState.IDLE &&
      this._playbackState !== PlaybackState.READY &&
      this._playbackState !== PlaybackState.PAUSED
    ) {
      console.warn(
        `AudioEngine: Play called in invalid state (${this._playbackState})`
      );
      return;
    }

    try {
      this.playPromise = this.audio.play();
      if (this.playPromise) {
        await this.playPromise;
        this.playPromise = null;
      }
    } catch (error) {
      this.playPromise = null;
      console.error("AudioEngine: Error starting playback:", error);
      this.stopFrequencyAnalysis();
      this.setPlaybackState(PlaybackState.ERROR);
      const errDetail = {
        code: -2,
        message:
          error instanceof Error ? error.message : "Play initiation failed",
      };
      this._lastError = errDetail;
      this.dispatchCustomEvent("error", errDetail);
    }
  }

  /**
   * Pauses the currently playing audio.
   */
  pause(): void {
    logger.info("Engine", "Pause requested");
    if (this._playbackState === PlaybackState.PLAYING) {
      this.audio.pause();
    }
  }

  /**
   * Seeks to a specific time within the loaded track.
   *
   * @param time The time in seconds to seek to. Clamped between 0 and track duration.
   */
  seek(time: number): void {
    const duration = this.duration;
    const seekableTime = Math.max(0, Math.min(time, duration));

    if (
      duration > 0 &&
      Number.isFinite(seekableTime) &&
      !Number.isNaN(seekableTime)
    ) {
      if (this.audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        try {
          this.audio.currentTime = seekableTime;
          this.seekOnReadyTime = null;
          this.dispatchCustomEvent("seek", { time: seekableTime });
          this.dispatchCustomEvent("timeUpdate", { currentTime: seekableTime });
          this.updateMediaSessionPositionState();
        } catch (error) {
          console.error(
            "AudioEngine: Error setting currentTime during seek:",
            error
          );
        }
      } else {
        this.seekOnReadyTime = seekableTime;
        console.warn(
          `AudioEngine: Seek requested (${seekableTime}s) but audio not ready (state: ${this.audio.readyState}). Will seek when ready.`
        );
      }
    } else {
      console.warn(
        `AudioEngine: Seek aborted: Invalid conditions - duration=${duration}, seekableTime=${seekableTime}`
      );
    }
  }

  /**
   * Sets the audio volume.
   *
   * @param volume A value between 0.0 (silent) and 1.0 (maximum).
   */
  setVolume(volume: number): void {
    logger.debug("Engine", `Volume changed: ${volume}`);
    const safeVolume = Math.max(0, Math.min(1, volume));
    this.audio.volume = safeVolume;
    this.audio.muted = safeVolume === 0;
  }

  /**
   * Sets the playback rate.
   *
   * @param rate Playback rate where 1.0 is normal speed, 2.0 is double speed, 0.5 is half speed, etc.
   */
  setPlaybackRate(rate: number): void {
    const safeRate = Math.max(
      MIN_PLAYBACK_RATE,
      Math.min(MAX_PLAYBACK_RATE, rate)
    );
    this.audio.playbackRate = safeRate;
    this.dispatchCustomEvent("playbackRateChange", { playbackRate: safeRate });
  }

  /**
   * Releases resources used by the AudioEngine instance.
   * Stops playback, removes event listeners, cleans up Media Session and AudioContext.
   * The instance should not be used after calling dispose.
   */
  dispose(): void {
    this.stopFrequencyAnalysis();
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.removeEventListeners();
    this.cleanupMediaSession();
    this._currentTrack = null;
    this._queue = null;
    this._activeItemId = null;
    this.setPlaybackState(PlaybackState.IDLE);

    if (this.isContextInitialized && this._audioContext) {
      this._sourceNode?.disconnect();
      this.analyserNode?.disconnect();
      this._sourceNode = null;
      this.analyserNode = null;
      this.isContextInitialized = false;
    }
  }

  /**
   * Registers an event listener for the specified event type.
   *
   * @param type The name of the event to listen for.
   * @param listener The function to call when the event is dispatched.
   * @param options Optional configuration object for the listener.
   */
  addEventListener<K extends keyof AudioEngineEventMap>(
    type: K,
    listener: (this: IAudioEngine, ev: AudioEngineEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.eventTarget.addEventListener(type, listener as EventListener, options);
  }

  /**
   * Removes a previously registered event listener.
   *
   * @param type The name of the event.
   * @param listener The listener function to remove.
   * @param options Optional configuration object used when adding the listener.
   */
  removeEventListener<K extends keyof AudioEngineEventMap>(
    type: K,
    listener: (this: IAudioEngine, ev: AudioEngineEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void {
    this.eventTarget.removeEventListener(
      type,
      listener as EventListener,
      options
    );
  }

  /**
   * Dispatches an event of the specified type.
   * (Typically used internally, but part of the IAudioEngine interface).
   *
   * @param event The event object to dispatch.
   * @returns boolean Indicating if the event was dispatched successfully.
   */
  dispatchEvent<K extends keyof AudioEngineEventMap>(
    event: AudioEngineEventMap[K]
  ): boolean {
    return this.eventTarget.dispatchEvent(event);
  }

  private dispatchCustomEvent<K extends keyof AudioEngineEventMap>(
    type: K,
    detail?: AudioEngineEventMap[K]["detail"]
  ): boolean {
    return this.eventTarget.dispatchEvent(new CustomEvent(type, { detail }));
  }

  private setPlaybackState(newState: PlaybackStateType): void {
    if (this._playbackState !== newState) {
      logger.debug(
        "Engine",
        `PlaybackState: ${this._playbackState} → ${newState}`
      );
      this._playbackState = newState;
      this.updateMediaSessionState();
      this.dispatchCustomEvent("playbackStateChange", { state: newState });
    }
  }

  private setupEventListeners(): void {
    this.boundListeners = {
      error: this.handleAudioError,
      playing: this.handleAudioPlaying,
      pause: this.handleAudioPause,
      ended: this.handleAudioEnded,
      canplay: this.handleAudioCanPlay,
      waiting: this.handleAudioWaiting,
      canplaythrough: this.handleAudioCanPlayThrough,
      timeupdate: this.handleAudioTimeUpdate,
      durationchange: this.handleAudioDurationChange,
      volumechange: this.handleAudioVolumeChange,
      ratechange: this.handleAudioRateChange,
      loadstart: this.handleAudioLoadStart,
    };

    for (const [event, listener] of Object.entries(this.boundListeners)) {
      this.audio.addEventListener(event, listener);
    }
  }

  private removeEventListeners(): void {
    for (const [event, listener] of Object.entries(this.boundListeners)) {
      this.audio.removeEventListener(event, listener);
    }
    this.boundListeners = {};
  }

  private readonly handleAudioError = (e: Event | string) => {
    let message = "Unknown audio error";
    const code = this.audio.error?.code || 0;
    let recoverable = true;

    if (this.audio.error) {
      switch (code) {
        case MediaError.MEDIA_ERR_ABORTED:
          message = "Playback aborted by user or system.";
          recoverable = false;
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          message = "Network error while loading audio.";
          recoverable = true;
          break;
        case MediaError.MEDIA_ERR_DECODE:
          message = "Error decoding audio file.";
          recoverable = false;
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          message = "Audio format not supported.";
          recoverable = false;
          break;
        default:
          message = `Unknown error (Code: ${code})`;
      }
    } else if (e instanceof ErrorEvent) {
      message = e.message;
      recoverable = false;
    } else if (typeof e === "string") {
      message = e;
      recoverable = false;
    }

    const errorDetails = { code, message };
    console.error("AudioEngine Error:", errorDetails, this.audio.error);
    this.setPlaybackState(PlaybackState.ERROR);
    this._lastError = errorDetails;

    if (
      recoverable &&
      this.retryAttempts < this.maxRetries &&
      this.audio.networkState !== this.audio.NETWORK_IDLE
    ) {
      this.retryAttempts++;
      setTimeout(() => this.reloadAudio(), RETRY_DELAY * this.retryAttempts);
    } else {
      this.dispatchCustomEvent("error", errorDetails);
    }
  };

  private readonly handleAudioPlaying = () => {
    this.retryAttempts = 0;
    this._isBuffering = false;
    this.setPlaybackState(PlaybackState.PLAYING);
    this.startFrequencyAnalysis();
    this.dispatchCustomEvent("play");
    this.dispatchCustomEvent("bufferingStateChange", { buffering: false });
  };

  private readonly handleAudioPause = () => {
    this.stopFrequencyAnalysis();
    if (
      this.audio.ended ||
      this._playbackState === PlaybackState.IDLE ||
      this._playbackState === PlaybackState.LOADING
    ) {
      return;
    }
    this.setPlaybackState(PlaybackState.PAUSED);
    this.dispatchCustomEvent("pause");
  };

  private readonly handleAudioEnded = () => {
    this.stopFrequencyAnalysis();
    this.setPlaybackState(PlaybackState.IDLE);
    this.dispatchCustomEvent("ended");
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = null;
    }
  };

  private readonly handleAudioCanPlay = () => {
    this.retryAttempts = 0;
    this._isBuffering = false;

    if (
      this.seekOnReadyTime !== null &&
      Number.isFinite(this.seekOnReadyTime)
    ) {
      this.seek(this.seekOnReadyTime);
    }

    if (this._playbackState === PlaybackState.LOADING) {
      this.setPlaybackState(PlaybackState.READY);
      this.dispatchCustomEvent("bufferLoaded");
    }
    this.dispatchCustomEvent("durationChange", { duration: this.duration });
    this.dispatchCustomEvent("bufferingStateChange", { buffering: false });
  };

  private readonly handleAudioLoadStart = () => {
    if (
      this._playbackState === PlaybackState.IDLE ||
      this._playbackState === PlaybackState.LOADING
    ) {
      this._isBuffering = true;
      this.dispatchCustomEvent("bufferingStateChange", { buffering: true });
    }
  };

  private readonly handleAudioWaiting = () => {
    this._isBuffering = true;
    this.dispatchCustomEvent("bufferingStateChange", { buffering: true });
  };

  private readonly handleAudioCanPlayThrough = () => {
    this._isBuffering = false;
    this.dispatchCustomEvent("bufferingStateChange", { buffering: false });
    if (this._playbackState === PlaybackState.LOADING) {
      this.setPlaybackState(PlaybackState.READY);
      this.dispatchCustomEvent("bufferLoaded");
    }
  };

  private readonly handleAudioTimeUpdate = () => {
    this.dispatchCustomEvent("timeUpdate", { currentTime: this.currentTime });
  };

  private readonly handleAudioDurationChange = () => {
    this.dispatchCustomEvent("durationChange", { duration: this.duration });
  };

  private readonly handleAudioVolumeChange = () => {
    this.dispatchCustomEvent("volumeChange", {
      volume: this.volume,
      muted: this.isMuted,
    });
  };

  private readonly handleAudioRateChange = () => {
    this.dispatchCustomEvent("playbackRateChange", {
      playbackRate: this.playbackRate,
    });
  };

  private reloadAudio(): void {
    const currentSrc = this.audio.src;
    if (currentSrc && this._currentTrack) {
      console.warn("AudioEngine: Attempting to reload audio source.");
      this.audio.src = "";
      this.audio.load();
      this.setPlaybackState(PlaybackState.LOADING);
      this._isBuffering = true;
      this.dispatchCustomEvent("bufferingStateChange", { buffering: true });
    } else {
      console.error("AudioEngine: Cannot reload - no current source or track.");
    }
  }

  private setupMediaSessionHandlers(): void {
    if (!("mediaSession" in navigator)) {
      return;
    }

    navigator.mediaSession.setActionHandler("play", () => {
      this.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      this.pause();
    });
    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      const skipTime = details.seekOffset || 10;
      this.seek(Math.max(this.currentTime - skipTime, 0));
    });
    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      const skipTime = details.seekOffset || 10;
      this.seek(Math.min(this.currentTime + skipTime, this.duration));
    });
    navigator.mediaSession.setActionHandler("stop", () => {
      this.pause();
      this.seek(0);
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      this.dispatchCustomEvent("requestPreviousTrack");
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      this.dispatchCustomEvent("requestNextTrack");
    });
  }

  private updateMediaSessionMetadata(): void {
    if (!("mediaSession" in navigator)) {
      return;
    }

    if (!this._currentTrack) {
      navigator.mediaSession.metadata = null;
      return;
    }
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this._currentTrack.title || "Unknown Title",
        artist: this._currentTrack.artist || "Unknown Artist",
        album: this._currentTrack.album || "",
        artwork: this._currentTrack.artwork ? [this._currentTrack.artwork] : [],
      });
    } catch (error) {
      console.error(
        "AudioEngine: Error setting media session metadata:",
        error
      );
    }
  }

  private updateMediaSessionState(): void {
    if (!("mediaSession" in navigator)) {
      return;
    }

    let state: MediaSessionPlaybackState = "none";
    switch (this._playbackState) {
      case PlaybackState.PLAYING:
        state = "playing";
        break;
      case PlaybackState.PAUSED:
        state = "paused";
        break;
      default:
        state = "none";
        break;
    }
    navigator.mediaSession.playbackState = state;
  }

  private readonly updateMediaSessionPositionState = () => {
    if (
      !("mediaSession" in navigator) ||
      this._playbackState !== PlaybackState.PLAYING
    ) {
      return;
    }
    const duration = this.duration;
    const position = this.currentTime;
    if (
      Number.isNaN(duration) ||
      !Number.isFinite(duration) ||
      Number.isNaN(position) ||
      !Number.isFinite(position)
    ) {
      return;
    }
    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: this.audio.playbackRate,
        position,
      });
    } catch (error) {
      console.warn(
        "AudioEngine: Error setting media session position state:",
        error
      );
    }
  };

  private cleanupMediaSession(): void {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = "none";
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("seekbackward", null);
      navigator.mediaSession.setActionHandler("seekforward", null);
      navigator.mediaSession.setActionHandler("stop", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
    }
  }

  private startFrequencyAnalysis(): void {
    if (!this.isContextInitialized || this.animationFrameId !== null) {
      return;
    }
    this.updateFrequencyData();
  }

  private stopFrequencyAnalysis(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      this._frequencyData = null;
      this.dispatchCustomEvent("frequencyDataUpdate", {
        data: new Uint8Array(),
      });
    }
  }

  private readonly updateFrequencyData = (): void => {
    if (!(this.analyserNode && this.frequencyDataBuffer)) {
      this.animationFrameId = null;
      return;
    }
    this.analyserNode.getByteFrequencyData(this.frequencyDataBuffer);
    this._frequencyData = new Uint8Array(this.frequencyDataBuffer);
    this.dispatchCustomEvent("frequencyDataUpdate", {
      data: this._frequencyData,
    });
    this.animationFrameId = requestAnimationFrame(this.updateFrequencyData);
  };
}
