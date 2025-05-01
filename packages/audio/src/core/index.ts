import { type AudioEngineEventMap, type IAudioEngine, type Music, PlaybackState } from '../interfaces';

/**
 * Core audio playback engine using HTMLAudioElement and Web Audio API for analysis.
 * Implements the IAudioEngine interface.
 */
export class AudioEngine implements IAudioEngine {

  private audio: HTMLAudioElement;
  private audioContext: AudioContext | null = null;
  public analyserNode: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private frequencyDataBuffer: Uint8Array | null = null;
  private _frequencyData: Uint8Array | null = null;
  private animationFrameId: number | null = null;

  private playPromise: Promise<void> | null = null;
  private retryAttempts = 0;
  private maxRetries = 3;
  private eventTarget = new EventTarget();
  private _currentMusic: Music | null = null;
  private _playbackState: PlaybackState = PlaybackState.IDLE;
  private seekOnReadyTime: number | null = null;
  private _isBuffering = false;
  private _lastError: { code: number; message: string } | null = null;
  private boundListeners: { [key: string]: EventListener } = {};

  private isContextInitialized = false;

  constructor() {
    if (typeof window === 'undefined' || !window.document) {
      throw new Error("AudioEngine requires a browser environment.");
    }
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.setupEventListeners();
    this.setVolume(1);
    this.setupMediaSessionHandlers();
  }

  private initAudioContext(): boolean {
    if (this.isContextInitialized || typeof window === 'undefined') {
      return this.isContextInitialized;
    }
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.frequencyDataBuffer = new Uint8Array(this.analyserNode.frequencyBinCount);
      this.sourceNode = this.audioContext.createMediaElementSource(this.audio);

      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioContext.destination);

      this.isContextInitialized = true;
      this.dispatchCustomEvent("contextInitialized", { analyserNode: this.analyserNode });
      return true;
    } catch (error) {
      console.error("AudioEngine: Failed to initialize AudioContext:", error);
      this.isContextInitialized = false;
      this.audioContext = null;
      this.analyserNode = null;
      this.sourceNode = null;
      this.frequencyDataBuffer = null;
      this.dispatchCustomEvent("contextInitialized", { analyserNode: null });
      return false;
    }
  }

  get playbackState(): PlaybackState { return this._playbackState; }
  get currentMusic(): Music | null { return this._currentMusic; }
  get volume(): number { return this.audio.volume; }
  get duration(): number {
    const dur = this.audio.duration;
    return !Number.isNaN(dur) && Number.isFinite(dur) ? dur : 0;
  }
  get currentTime(): number {
    const time = this.audio.currentTime;
    return Number.isNaN(time) ? 0 : time;
  }
  get isMuted(): boolean { return this.audio.muted || this.audio.volume === 0; }
  get isBuffering(): boolean { return this._isBuffering; }
  get lastError(): { code: number; message: string } | null { return this._lastError; }
  get frequencyData(): Uint8Array | null { return this._frequencyData; }

  /**
   * Loads a new music track into the engine.
   * Stops current playback and replaces the audio source.
   *
   * @param music The Music object containing URL and metadata.
   * @param startTime Optional time (in seconds) to seek to once the track is ready.
   */
  public async load(music: Music, startTime?: number): Promise<void> {
    this._lastError = null;
    this.seekOnReadyTime = startTime ?? null;
    this.setPlaybackState(PlaybackState.LOADING);
    this._isBuffering = true;
    this.dispatchCustomEvent("bufferingStateChange", { buffering: true });

    const previousMusic = this._currentMusic;
    this._currentMusic = music;
    this.dispatchCustomEvent("trackChange", { music: this._currentMusic });

    this.updateMediaSessionMetadata();

    try {
      if (this.audio.src === music.url && this.audio.readyState > HTMLMediaElement.HAVE_NOTHING) {
        let targetState = PlaybackState.LOADING;
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
          this.dispatchCustomEvent("durationChange", { duration: this.duration });
        }
        return;
      }

      if (!this.audio.paused) {
        this.audio.pause();
      }
      this.audio.src = music.url;
      this.audio.preload = "auto";
      this.retryAttempts = 0;
      this.audio.load();

    } catch (error) {
      console.error("AudioEngine: Load process error:", error);
      this._currentMusic = previousMusic;
      this.setPlaybackState(PlaybackState.ERROR);
      const errDetail = { code: -1, message: error instanceof Error ? error.message : "Unknown load error" };
      this._lastError = errDetail;
      this.dispatchCustomEvent("error", errDetail);
      this.dispatchCustomEvent("trackChange", { music: this._currentMusic });
    }
  }

  /**
   * Initiates playback of the loaded track.
   * Resumes if paused, starts from the beginning or `startTime` if loaded.
   * Initializes the AudioContext on the first play attempt if necessary.
   *
   * @returns A promise that resolves when playback begins or rejects if an error occurs.
   */
  public async play(): Promise<void> {
    if (!this.isContextInitialized) {
      if (!this.initAudioContext()) {
        const errDetail = { code: -3, message: "Failed to initialize AudioContext, cannot play." };
        this._lastError = errDetail;
        this.dispatchCustomEvent("error", errDetail);
        this.setPlaybackState(PlaybackState.ERROR);
        return;
      }
      if (this.audioContext?.state === 'suspended') {
        try {
          await this.audioContext.resume();
        } catch (resumeError) {
          console.error("AudioEngine: Failed to resume AudioContext:", resumeError);
          const errDetail = { code: -4, message: "Failed to resume AudioContext." };
          this._lastError = errDetail;
          this.dispatchCustomEvent("error", errDetail);
          this.setPlaybackState(PlaybackState.ERROR);
          return;
        }
      }
    }

    if (this._playbackState !== PlaybackState.IDLE &&
      this._playbackState !== PlaybackState.READY &&
      this._playbackState !== PlaybackState.PAUSED) {
      console.warn(`AudioEngine: Play called in invalid state (${this._playbackState})`);
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
      const errDetail = { code: -2, message: error instanceof Error ? error.message : "Play initiation failed" };
      this._lastError = errDetail;
      this.dispatchCustomEvent("error", errDetail);
    }
  }

  /**
   * Pauses the currently playing audio.
   */
  public pause(): void {
    if (this._playbackState === PlaybackState.PLAYING) {
      this.audio.pause();
    }
  }

  /**
   * Seeks to a specific time within the loaded track.
   *
   * @param time The time in seconds to seek to. Clamped between 0 and track duration.
   */
  public seek(time: number): void {
    const duration = this.duration;
    const seekableTime = Math.max(0, Math.min(time, duration));

    if (duration > 0 && Number.isFinite(seekableTime) && !Number.isNaN(seekableTime)) {
      if (this.audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        try {
          this.audio.currentTime = seekableTime;
          this.seekOnReadyTime = null;
          this.dispatchCustomEvent("seek", { time: seekableTime });
          this.dispatchCustomEvent("timeUpdate", { currentTime: seekableTime });
          this.updateMediaSessionPositionState();
        } catch (error) {
          console.error("AudioEngine: Error setting currentTime during seek:", error);
        }
      } else {
        this.seekOnReadyTime = seekableTime;
        console.warn(`AudioEngine: Seek requested (${seekableTime}s) but audio not ready (state: ${this.audio.readyState}). Will seek when ready.`);
      }
    } else {
      console.warn(`AudioEngine: Seek aborted: Invalid conditions - duration=${duration}, seekableTime=${seekableTime}`);
    }
  }

  /**
   * Sets the audio volume.
   *
   * @param volume A value between 0.0 (silent) and 1.0 (maximum).
   */
  public setVolume(volume: number): void {
    const safeVolume = Math.max(0, Math.min(1, volume));
    this.audio.volume = safeVolume;
    this.audio.muted = safeVolume === 0;
  }

  /**
   * Releases resources used by the AudioEngine instance.
   * Stops playback, removes event listeners, cleans up Media Session and AudioContext.
   * The instance should not be used after calling dispose.
   */
  public dispose(): void {
    this.stopFrequencyAnalysis();
    this.audio.pause();
    this.audio.removeAttribute('src');
    this.removeEventListeners();
    this.cleanupMediaSession();
    this._currentMusic = null;
    this.setPlaybackState(PlaybackState.IDLE);

    if (this.isContextInitialized && this.audioContext) {
      this.sourceNode?.disconnect();
      this.analyserNode?.disconnect();
      this.sourceNode = null;
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
  public addEventListener<K extends keyof AudioEngineEventMap>(
    type: K,
    listener: (this: IAudioEngine, ev: AudioEngineEventMap[K]) => any,
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
  public removeEventListener<K extends keyof AudioEngineEventMap>(
    type: K,
    listener: (this: IAudioEngine, ev: AudioEngineEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void {
    this.eventTarget.removeEventListener(type, listener as EventListener, options);
  }

  /**
   * Dispatches an event of the specified type.
   * (Typically used internally, but part of the IAudioEngine interface).
   *
   * @param event The event object to dispatch.
   * @returns boolean Indicating if the event was dispatched successfully.
   */
  public dispatchEvent<K extends keyof AudioEngineEventMap>(event: AudioEngineEventMap[K]): boolean {
    return this.eventTarget.dispatchEvent(event);
  }

  private dispatchCustomEvent<K extends keyof AudioEngineEventMap>(
    type: K,
    detail?: AudioEngineEventMap[K]['detail']
  ): boolean {
    return this.eventTarget.dispatchEvent(new CustomEvent(type, { detail }));
  }

  private setPlaybackState(newState: PlaybackState): void {
    if (this._playbackState !== newState) {
      this._playbackState = newState;
      this.updateMediaSessionState();
      this.dispatchCustomEvent("playbackStateChange", { state: newState });
    }
  }

  private setupEventListeners(): void {
    this.boundListeners = {
      'error': this.handleAudioError,
      'playing': this.handleAudioPlaying,
      'pause': this.handleAudioPause,
      'ended': this.handleAudioEnded,
      'canplay': this.handleAudioCanPlay,
      'waiting': this.handleAudioWaiting,
      'canplaythrough': this.handleAudioCanPlayThrough,
      'timeupdate': this.handleAudioTimeUpdate,
      'durationchange': this.handleAudioDurationChange,
      'volumechange': this.handleAudioVolumeChange,
      'loadstart': this.handleAudioLoadStart
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

  private handleAudioError = (e: Event | string) => {
    let message = "Unknown audio error";
    const code = this.audio.error?.code || 0;
    let recoverable = true;

    if (this.audio.error) {
      switch (code) {
        case MediaError.MEDIA_ERR_ABORTED: message = "Playback aborted by user or system."; recoverable = false; break;
        case MediaError.MEDIA_ERR_NETWORK: message = "Network error while loading audio."; recoverable = true; break;
        case MediaError.MEDIA_ERR_DECODE: message = "Error decoding audio file."; recoverable = false; break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: message = "Audio format not supported."; recoverable = false; break;
        default: message = `Unknown error (Code: ${code})`;
      }
    } else if (e instanceof ErrorEvent) {
      message = e.message;
      recoverable = false;
    } else if (typeof e === 'string') {
      message = e;
      recoverable = false;
    }

    const errorDetails = { code, message };
    console.error("AudioEngine Error:", errorDetails, this.audio.error);
    this.setPlaybackState(PlaybackState.ERROR);
    this._lastError = errorDetails;

    if (recoverable && this.retryAttempts < this.maxRetries && this.audio.networkState !== this.audio.NETWORK_IDLE) {
      this.retryAttempts++;
      setTimeout(() => this.reloadAudio(), 1000 * this.retryAttempts);
    } else {
      this.dispatchCustomEvent("error", errorDetails);
    }
  };

  private handleAudioPlaying = () => {
    this.retryAttempts = 0;
    this._isBuffering = false;
    this.setPlaybackState(PlaybackState.PLAYING);
    this.startFrequencyAnalysis();
    this.dispatchCustomEvent("play");
    this.dispatchCustomEvent("bufferingStateChange", { buffering: false });
  };

  private handleAudioPause = () => {
    this.stopFrequencyAnalysis();
    if (this.audio.ended || this._playbackState === PlaybackState.IDLE || this._playbackState === PlaybackState.LOADING) {
      return;
    }
    this.setPlaybackState(PlaybackState.PAUSED);
    this.dispatchCustomEvent("pause");
  };

  private handleAudioEnded = () => {
    this.stopFrequencyAnalysis();
    this.setPlaybackState(PlaybackState.IDLE);
    this.dispatchCustomEvent("ended");
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
    }
  };

  private handleAudioCanPlay = () => {
    this.retryAttempts = 0;
    this._isBuffering = false;

    if (this.seekOnReadyTime !== null && Number.isFinite(this.seekOnReadyTime)) {
      this.seek(this.seekOnReadyTime);
    }

    if (this._playbackState === PlaybackState.LOADING) {
      this.setPlaybackState(PlaybackState.READY);
      this.dispatchCustomEvent("bufferLoaded");
    }
    this.dispatchCustomEvent("durationChange", { duration: this.duration });
    this.dispatchCustomEvent("bufferingStateChange", { buffering: false });
  };

  private handleAudioLoadStart = () => {
    if (this._playbackState === PlaybackState.IDLE || this._playbackState === PlaybackState.LOADING) {
      this._isBuffering = true;
      this.dispatchCustomEvent("bufferingStateChange", { buffering: true });
    }
  };

  private handleAudioWaiting = () => {
    this._isBuffering = true;
    this.dispatchCustomEvent("bufferingStateChange", { buffering: true });
  };

  private handleAudioCanPlayThrough = () => {
    this._isBuffering = false;
    this.dispatchCustomEvent("bufferingStateChange", { buffering: false });
    if (this._playbackState === PlaybackState.LOADING) {
      this.setPlaybackState(PlaybackState.READY);
      this.dispatchCustomEvent("bufferLoaded");
    }
  };

  private handleAudioTimeUpdate = () => {
    this.dispatchCustomEvent("timeUpdate", { currentTime: this.currentTime });
  };

  private handleAudioDurationChange = () => {
    this.dispatchCustomEvent("durationChange", { duration: this.duration });
  };

  private handleAudioVolumeChange = () => {
    this.dispatchCustomEvent("volumeChange", { volume: this.volume, muted: this.isMuted });
  };

  private reloadAudio(): void {
    const currentSrc = this.audio.src;
    if (currentSrc && this._currentMusic) {
      console.warn("AudioEngine: Attempting to reload audio source.");
      this.audio.src = '';
      this.audio.load();
      this.setPlaybackState(PlaybackState.LOADING);
      this._isBuffering = true;
      this.dispatchCustomEvent("bufferingStateChange", { buffering: true });
    } else {
      console.error("AudioEngine: Cannot reload - no current source or music.");
    }
  }

  private setupMediaSessionHandlers(): void {
    if (!('mediaSession' in navigator)) { return; }

    navigator.mediaSession.setActionHandler('play', () => { this.play(); });
    navigator.mediaSession.setActionHandler('pause', () => { this.pause(); });
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const skipTime = details.seekOffset || 10;
      this.seek(Math.max(this.currentTime - skipTime, 0));
    });
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const skipTime = details.seekOffset || 10;
      this.seek(Math.min(this.currentTime + skipTime, this.duration));
    });
    navigator.mediaSession.setActionHandler('stop', () => {
      this.pause();
      this.seek(0);
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      this.dispatchCustomEvent('requestPreviousTrack');
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      this.dispatchCustomEvent('requestNextTrack');
    });

  }

  private updateMediaSessionMetadata(): void {
    if (!('mediaSession' in navigator)) { return; }

    if (!this._currentMusic) {
      navigator.mediaSession.metadata = null;
      return;
    }
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this._currentMusic.title || 'Unknown Title',
        artist: this._currentMusic.artist || 'Unknown Artist',
        album: this._currentMusic.album || '',
        artwork: this._currentMusic.artwork ? [this._currentMusic.artwork] : [],
      });
    } catch (error) {
      console.error("AudioEngine: Error setting media session metadata:", error);
    }
  }

  private updateMediaSessionState(): void {
    if (!('mediaSession' in navigator)) { return; }

    let state: MediaSessionPlaybackState = 'none';
    switch (this._playbackState) {
      case PlaybackState.PLAYING: state = 'playing'; break;
      case PlaybackState.PAUSED: state = 'paused'; break;
      default: state = 'none'; break;
    }
    navigator.mediaSession.playbackState = state;
  }

  private updateMediaSessionPositionState = () => {
    if (!('mediaSession' in navigator) || this._playbackState !== PlaybackState.PLAYING) {
      return;
    }
    const duration = this.duration;
    const position = this.currentTime;
    if (Number.isNaN(duration) || !Number.isFinite(duration) || Number.isNaN(position) || !Number.isFinite(position)) {
      return;
    }
    try {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: this.audio.playbackRate,
        position: position,
      });
    } catch (error) {
      console.warn("AudioEngine: Error setting media session position state:", error);
    }
  }

  private cleanupMediaSession(): void {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('stop', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
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
      this.dispatchCustomEvent("frequencyDataUpdate", { data: new Uint8Array() });
    }
  }

  private updateFrequencyData = (): void => {
    if (!this.analyserNode || !this.frequencyDataBuffer) {
      this.animationFrameId = null;
      return;
    }
    this.analyserNode.getByteFrequencyData(this.frequencyDataBuffer);
    this._frequencyData = new Uint8Array(this.frequencyDataBuffer);
    this.dispatchCustomEvent("frequencyDataUpdate", { data: this._frequencyData });
    this.animationFrameId = requestAnimationFrame(this.updateFrequencyData);
  };
}
