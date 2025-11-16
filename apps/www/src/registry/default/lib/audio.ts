export type Track = {
  id?: string | number;
  url: string;
  title?: string;
  artist?: string;
  artwork?: string;
  images?: string[];
  duration?: number;
  album?: string;
  genre?: string;
  live?: boolean;
  [key: string]: unknown;
};

class AudioLib {
  private audio: HTMLAudioElement | null = null;
  private isInitialized = false;
  private playPromise: Promise<void> | null = null;
  private lastVolume = 1;
  private fadeTimeout: NodeJS.Timeout | null = null;
  private retryAttempts = 0;
  private readonly maxRetries = 3;
  private readonly eventTarget = new EventTarget();

  init(): void {
    if (this.isInitialized || !this.isClient()) {
      return;
    }

    this.isInitialized = true;

    if (this.isClient()) {
      this.audio = new Audio();
      this.setupEventListeners();
    }
  }

  private setupEventListeners(): void {
    if (!this.isClient()) {
      return;
    }

    const audio = this.ensureAudio();
    if (!audio) {
      return;
    }

    audio.addEventListener("error", () => {
      const errorDetails = {
        code: audio.error?.code,
        message: audio.error?.message,
        event_type: `error_code_${audio.error?.code || "unknown"}`,
        src: audio.src,
        readyState: audio.readyState,
        networkState: audio.networkState,
        raw_error_object: audio.error,
      };
      console.error("### Detailed Audio Element Error ###", errorDetails);

      if (this.retryAttempts < this.maxRetries) {
        this.retryAttempts += 1;

        setTimeout(() => {
          this.reloadAudio();
        }, 1000);
      }

      this.eventTarget.dispatchEvent(new CustomEvent("audioError"));
    });

    audio.addEventListener("playing", () => {
      this.retryAttempts = 0;
      this.eventTarget.dispatchEvent(new CustomEvent("bufferingEnd"));
      this.eventTarget.dispatchEvent(new CustomEvent("playbackStarted"));
    });

    audio.addEventListener("canplaythrough", () => {
      this.retryAttempts = 0;
      this.eventTarget.dispatchEvent(new CustomEvent("bufferingEnd"));
    });

    audio.addEventListener("waiting", () => {
      this.eventTarget.dispatchEvent(new CustomEvent("bufferingStart"));
    });

    audio.addEventListener("progress", () => {
      const buffered = audio.buffered;
      const currentTime = audio.currentTime;
      let bufferedEnd = 0;

      if (buffered.length === 0) {
        return;
      }

      for (let i = buffered.length - 1; i >= 0; i--) {
        if (buffered.start(i) <= currentTime) {
          bufferedEnd = buffered.end(i);
          break;
        }
      }

      if (bufferedEnd === 0) {
        bufferedEnd = buffered.end(0);
      }

      if (bufferedEnd > 0) {
        this.eventTarget.dispatchEvent(
          new CustomEvent("bufferUpdate", {
            detail: { bufferedTime: bufferedEnd },
          })
        );
      }
    });
  }

  cleanup(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio.load();
    }

    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
      this.fadeTimeout = null;
    }

    this.playPromise = null;
  }

  getAudioElement(): HTMLAudioElement | null {
    if (!this.isClient()) {
      return null;
    }
    return this.audio;
  }

  private isClient(): boolean {
    return typeof window !== "undefined" && !!window.document;
  }

  private ensureAudio(): HTMLAudioElement {
    if (!this.isClient()) {
      throw new Error("Audio module not available on server side");
    }
    if (!this.audio) {
      throw new Error("Audio module not initialized");
    }
    return this.audio;
  }

  async load(url: string, startTime = 0, isLiveStream = false): Promise<void> {
    if (!this.isClient()) {
      return;
    }

    const audio = this.ensureAudio();
    if (!audio) {
      return;
    }

    try {
      this.retryAttempts = 0;
      if (audio.src === url) {
        if (audio.currentTime !== startTime && !isLiveStream) {
          audio.currentTime = startTime;
        }
        return;
      }

      audio.pause();
      audio.src = "";

      audio.src = url;
      audio.preload = "auto";

      const loadTimeout = isLiveStream ? 60_000 : 30_000;

      await new Promise<void>((resolve, reject) => {
        let timeoutId: NodeJS.Timeout | null = null;
        let isResolved = false;

        const cleanup = () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          audio.removeEventListener("loadedmetadata", handleLoadSuccess);
          audio.removeEventListener("canplay", handleLoadSuccess);
          audio.removeEventListener("canplaythrough", handleLoadSuccess);
          audio.removeEventListener("error", handleErrorLoading);
        };

        const handleTimeout = () => {
          if (isResolved) {
            return;
          }
          isResolved = true;
          cleanup();

          reject(
            new Error(
              `Audio load timeout (${loadTimeout / 1000}s). ReadyState: ${audio.readyState}, NetworkState: ${audio.networkState}, URL: ${audio.src}`
            )
          );
        };

        const handleLoadSuccess = () => {
          if (isResolved) {
            return;
          }
          isResolved = true;
          cleanup();

          // Ne pas définir currentTime pour les streams live
          if (startTime > 0 && !isLiveStream) {
            audio.currentTime = startTime;
          }
          resolve();
        };

        const handleErrorLoading = () => {
          if (isResolved) {
            return;
          }
          isResolved = true;
          cleanup();
          console.error("Error during initial audio load:", audio.error);
          reject(
            new Error(
              `Audio load failed: ${audio.error?.message || "Unknown error"}`
            )
          );
        };

        timeoutId = setTimeout(handleTimeout, loadTimeout);

        audio.addEventListener("loadedmetadata", handleLoadSuccess);
        audio.addEventListener("canplay", handleLoadSuccess);
        audio.addEventListener("canplaythrough", handleLoadSuccess);
        audio.addEventListener("error", handleErrorLoading);
        audio.load();
      });
    } catch (error) {
      console.error("Audio load process error:", error);
      throw error;
    }
  }

  async play(): Promise<void> {
    if (!this.isClient()) {
      return;
    }
    if (!this.audio) {
      throw new Error("Audio module not initialized");
    }

    try {
      if (!this.audio.paused) {
        return;
      }
      this.playPromise = this.audio.play();
      await this.playPromise;
      this.playPromise = null;
    } catch (error) {
      this.playPromise = null;
      const errorDetails = {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        url: this.audio.src,
        readyState: this.audio.readyState,
        networkState: this.audio.networkState,
      };
      console.error("Play error:", errorDetails);
      throw error;
    }
  }

  private reloadAudio(): void {
    if (!this.isClient()) {
      return;
    }

    const audio = this.ensureAudio();
    const currentTime = audio.currentTime;
    const wasPlaying = !audio.paused;
    const currentSrc = audio.src;

    audio.pause();
    audio.src = "";
    audio.load();
    audio.src = currentSrc;
    audio.preload = "auto";
    audio.load();

    const setTimeAndPlay = () => {
      if (audio.readyState >= audio.HAVE_METADATA) {
        audio.currentTime = currentTime;
        if (wasPlaying) {
          this.play().catch(console.error);
        }
        audio.removeEventListener("loadedmetadata", setTimeAndPlay);
      }
    };

    audio.addEventListener("loadedmetadata", setTimeAndPlay);
  }

  pause(): void {
    if (!this.isClient()) {
      return;
    }
    const audio = this.ensureAudio();

    audio.pause();
  }

  setVolume(volume: number, fadeTime = 0): void {
    if (!this.isClient()) {
      return;
    }

    const audio = this.ensureAudio();

    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
      this.fadeTimeout = null;
    }

    if (fadeTime <= 0) {
      audio.volume = Math.max(0, Math.min(1, volume));
      if (volume > 0) {
        this.lastVolume = volume;
      }
      return;
    }

    this.fadeVolume(audio, volume, fadeTime);
  }

  private fadeVolume(
    audio: HTMLAudioElement,
    targetVolume: number,
    duration: number
  ): void {
    if (!this.isClient()) {
      return;
    }

    const startVolume = audio.volume;
    const endVolume = Math.max(0, Math.min(1, targetVolume));
    const startTime = performance.now();

    const updateVolume = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentVolume = startVolume + (endVolume - startVolume) * progress;

      audio.volume = currentVolume;

      if (progress < 1) {
        this.fadeTimeout = setTimeout(updateVolume, 16);
      } else {
        if (endVolume > 0) {
          this.lastVolume = endVolume;
        }
        this.fadeTimeout = null;
      }
    };

    updateVolume();
  }

  getVolume(): number {
    if (!this.isClient()) {
      return 0;
    }

    const audio = this.ensureAudio();
    return audio.volume;
  }

  setMuted(muted: boolean): void {
    if (!this.isClient()) {
      return;
    }
    const audio = this.ensureAudio();
    if (audio.muted === muted) {
      return;
    }

    if (muted) {
      if (audio.volume > 0) {
        this.lastVolume = audio.volume;
      }
      this.fadeVolume(audio, 0, 200);
      audio.muted = true;
    } else {
      audio.muted = false;
      this.fadeVolume(audio, this.lastVolume, 200);
    }
  }

  getDuration(): number {
    if (!this.isClient()) {
      return 0;
    }
    const audio = this.ensureAudio();
    return audio.duration;
  }

  getCurrentTime(): number {
    if (!this.isClient()) {
      return 0;
    }
    const audio = this.ensureAudio();
    return audio.currentTime;
  }

  setCurrentTime(time: number): void {
    if (!this.isClient()) {
      return;
    }
    const audio = this.ensureAudio();
    const duration = audio.duration;

    if (!Number.isNaN(duration) && time >= 0 && time <= duration) {
      if (audio.readyState >= audio.HAVE_METADATA) {
        audio.currentTime = time;
      }
    } else if (!Number.isNaN(duration)) {
      const validTime = Math.max(0, Math.min(time, duration));
      if (audio.readyState >= audio.HAVE_METADATA) {
        audio.currentTime = validTime;
      }
    }
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.eventTarget.addEventListener(type, listener, options);
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void {
    this.eventTarget.removeEventListener(type, callback, options);
  }

  getSource(): string {
    if (!this.isClient()) {
      return "";
    }
    const audio = this.ensureAudio();
    return audio.src;
  }

  isPaused(): boolean {
    if (!this.isClient()) {
      return true;
    }
    const audio = this.ensureAudio();
    return audio.paused;
  }

  getBufferedRanges(): TimeRanges | null {
    if (!(this.isClient() && this.audio)) {
      return null;
    }
    return this.audio.buffered;
  }
}

export const $audio = new AudioLib();

const MINUTE_IN_SECONDS = 60;

const LIVE_STREAM_PATTERNS = [
  /\/live\./i,
  /\/stream/i,
  /\/radio/i,
  /\.m3u8$/i,
  /\.pls$/i,
  /\.aac$/i,
  /icecast|shoutcast/i,
];

export function isLive(track: Track): boolean {
  if (!track.url) {
    return false;
  }

  const url = track.url.toLowerCase();

  for (const pattern of LIVE_STREAM_PATTERNS) {
    if (pattern.test(url)) {
      return true;
    }
  }

  if (track.live === true) {
    return true;
  }

  return false;
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / MINUTE_IN_SECONDS);
  const remainingSeconds = Math.floor(seconds % MINUTE_IN_SECONDS);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
