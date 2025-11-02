/// <reference lib="dom" />
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "bun:test";
import { AudioEngine } from "../core/engine/main";
import { PlaybackState, type Track } from "../core/types";

// Test constants
const TEST_DURATION_SHORT = 60;
const TEST_DURATION_MEDIUM = 100;
const TEST_DURATION_LONG = 120;
const TEST_DURATION_VERY_LONG = 180;
const TEST_DURATION_200 = 200;

const TEST_SEEK_TIME_SHORT = 10;
const TEST_SEEK_TIME_MEDIUM = 25;
const TEST_SEEK_TIME_NORMAL = 30;
const TEST_SEEK_TIME_LONG = 45.5;
const TEST_SEEK_TIME_50 = 50;
const TEST_SEEK_TIME_55 = 55;
const TEST_SEEK_TIME_75 = 75;
const TEST_SEEK_TIME_HIGH = 150;
const TEST_SEEK_TIME_NEGATIVE = -10;
const TEST_TIME_15_2 = 15.2;

const TEST_VOLUME_MIN = 0;
const TEST_VOLUME_HALF = 0.5;
const TEST_VOLUME_MAX = 1;
const TEST_VOLUME_OVER = 1.5;
const TEST_VOLUME_UNDER = -0.5;

const TEST_RETRY_ATTEMPT_1 = 1;
const TEST_RETRY_ATTEMPT_3 = 3;

const TEST_FFT_SIZE = 256;
const TEST_FREQUENCY_BIN_COUNT = 128;
const TEST_RAF_ID_START = 1;

let _currentTime = 0;
const mockAudioElement = {
  play: vi.fn(() => Promise.resolve()),
  pause: vi.fn(),
  load: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn((_event: Event) => true),
  removeAttribute: vi.fn(),
  volume: 1,
  muted: false,
  get currentTime() {
    return _currentTime;
  },
  set currentTime(value: number) {
    _currentTime = value;
  },
  duration: 0,
  paused: true,
  ended: false,
  readyState: 0,
  networkState: 0,
  HAVE_NOTHING: 0,
  HAVE_METADATA: 1,
  HAVE_CURRENT_DATA: 2,
  HAVE_FUTURE_DATA: 3,
  HAVE_ENOUGH_DATA: 4,
  NETWORK_EMPTY: 0,
  NETWORK_IDLE: 1,
  NETWORK_LOADING: 2,
  NETWORK_NO_SOURCE: 3,
  error: null as MediaError | null,
  src: "",
  crossOrigin: "",
  playbackRate: 1,
  _listeners: {} as Record<
    string,
    EventListenerOrEventListenerObject[] | undefined
  >,
  _simulateEvent(eventName: string) {
    const listeners = this._listeners[eventName];
    if (listeners) {
      const event = new Event(eventName);
      for (const listener of listeners) {
        if (typeof listener === "function") {
          listener(event);
        } else {
          listener.handleEvent(event);
        }
      }
    }
  },
};

mockAudioElement.addEventListener.mockImplementation((eventName, listener) => {
  if (!mockAudioElement._listeners[eventName]) {
    mockAudioElement._listeners[eventName] = [];
  }
  if (listener) {
    mockAudioElement._listeners[eventName]?.push(listener);
  }
});

mockAudioElement.removeEventListener.mockImplementation(
  (eventName, listener) => {
    const listeners = mockAudioElement._listeners[eventName];
    if (listeners && listener) {
      mockAudioElement._listeners[eventName] = listeners.filter(
        (l) => l !== listener
      );
    }
  }
);

const mockAnalyserNode = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  getByteFrequencyData: vi.fn(),
  fftSize: TEST_FFT_SIZE,
  frequencyBinCount: TEST_FREQUENCY_BIN_COUNT,
};
const mockSourceNode = {
  connect: vi.fn(),
  disconnect: vi.fn(),
};
const mockAudioContext = {
  createAnalyser: vi.fn(() => mockAnalyserNode),
  createMediaElementSource: vi.fn(() => mockSourceNode),
  destination: {},
  state: "running",
  resume: vi.fn(() => Promise.resolve()),
  close: vi.fn(() => Promise.resolve()),
};

let createdMetadataInstance: any = null;
const mockMediaMetadata = vi.fn((metadata) => {
  createdMetadataInstance = { ...metadata };
  mockMediaSession.metadata = createdMetadataInstance;
  return createdMetadataInstance;
});
const mockSetPositionState = vi.fn();
const mockMediaSession = {
  setActionHandler: vi.fn(),
  metadata: null as MediaMetadata | null,
  playbackState: "none" as MediaSessionPlaybackState,
  setPositionState: mockSetPositionState,
};

let rafId = TEST_RAF_ID_START;
const mockRequestAnimationFrame = vi.fn(
  (_callback: FrameRequestCallback): number => rafId++
);
const mockCancelAnimationFrame = vi.fn();

const mockMediaError = {
  MEDIA_ERR_ABORTED: 1,
  MEDIA_ERR_NETWORK: 2,
  MEDIA_ERR_DECODE: 3,
  MEDIA_ERR_SRC_NOT_SUPPORTED: 4,
};

const originalDescriptors: Record<string, PropertyDescriptor | undefined> = {};

function defineGlobalProperty(
  name: string,
  value: unknown,
  _originalValue: unknown
): void {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  originalDescriptors[name] = descriptor;

  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    configurable: true,
    enumerable: descriptor?.enumerable ?? true,
  });
}

function restoreGlobalProperty(name: string, _originalValue: unknown): void {
  const descriptor = originalDescriptors[name];
  if (descriptor) {
    Object.defineProperty(globalThis, name, descriptor);
  } else {
    // Si pas de descriptor, c'était probablement une propriété non configurée
    // Essayer de supprimer et laisser le système la recréer
    try {
      delete (globalThis as any)[name];
    } catch {
      // Ignorer si la suppression échoue
    }
  }
}

beforeEach(() => {
  // Sauvegarder et définir les mocks avec Object.defineProperty
  defineGlobalProperty(
    "Audio",
    vi.fn(() => mockAudioElement),
    globalThis.Audio
  );
  defineGlobalProperty(
    "AudioContext",
    vi.fn(() => mockAudioContext),
    globalThis.AudioContext
  );
  defineGlobalProperty(
    "webkitAudioContext",
    vi.fn(() => mockAudioContext),
    globalThis.webkitAudioContext
  );
  defineGlobalProperty(
    "MediaMetadata",
    mockMediaMetadata,
    globalThis.MediaMetadata
  );
  defineGlobalProperty(
    "navigator",
    { mediaSession: mockMediaSession },
    globalThis.navigator
  );
  defineGlobalProperty(
    "requestAnimationFrame",
    mockRequestAnimationFrame,
    globalThis.requestAnimationFrame
  );
  defineGlobalProperty(
    "cancelAnimationFrame",
    mockCancelAnimationFrame,
    globalThis.cancelAnimationFrame
  );
  defineGlobalProperty("MediaError", mockMediaError, globalThis.MediaError);

  vi.clearAllMocks();
  _currentTime = TEST_VOLUME_MIN;
  mockAudioElement.volume = TEST_VOLUME_MAX;
  mockAudioElement.muted = false;
  mockAudioElement.duration = TEST_VOLUME_MIN;
  mockAudioElement.paused = true;
  mockAudioElement.ended = false;
  mockAudioElement.readyState = TEST_VOLUME_MIN;
  mockAudioElement.networkState = TEST_VOLUME_MIN;
  mockAudioElement.error = null;
  mockAudioElement.src = "";
  mockAudioElement._listeners = {};
  mockMediaSession.metadata = null;
  mockMediaSession.playbackState = "none";
  createdMetadataInstance = null;
  rafId = TEST_RAF_ID_START;
  mockSetPositionState.mockClear();
});

afterEach(() => {
  // Restaurer les valeurs originales
  restoreGlobalProperty("Audio", undefined);
  restoreGlobalProperty("AudioContext", undefined);
  restoreGlobalProperty("webkitAudioContext", undefined);
  restoreGlobalProperty("MediaMetadata", undefined);
  restoreGlobalProperty("navigator", undefined);
  restoreGlobalProperty("requestAnimationFrame", undefined);
  restoreGlobalProperty("cancelAnimationFrame", undefined);
  restoreGlobalProperty("MediaError", undefined);
});

describe("AudioEngine", () => {
  it("should instantiate with default values", () => {
    const engine = new AudioEngine();
    expect(engine.playbackState).toBe(PlaybackState.IDLE);
    expect(engine.volume).toBe(1);
    expect(engine.isMuted).toBe(false);
    expect(engine.currentTime).toBe(0);
    expect(engine.duration).toBe(0);
    expect(engine.currentTrack).toBeNull();
    expect(engine.isBuffering).toBe(false);
    expect(engine.lastError).toBeNull();
    expect(engine.frequencyData).toBeNull();
    expect(engine.analyserNode).toBeNull();
    expect(globalThis.Audio).toHaveBeenCalledTimes(1);
  });

  it("should initialize AudioContext on first play", async () => {
    const engine = new AudioEngine();
    mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
    // @ts-expect-error Accessing private method for testing setup
    engine.setPlaybackState(PlaybackState.READY);

    await engine.play();

    expect(globalThis.AudioContext).toHaveBeenCalledTimes(1);
    expect(mockAudioContext.createAnalyser).toHaveBeenCalledTimes(1);
    expect(mockAudioContext.createMediaElementSource).toHaveBeenCalledWith(
      mockAudioElement
    );
    expect(mockSourceNode.connect).toHaveBeenCalledWith(mockAnalyserNode);
    expect(mockAnalyserNode.connect).toHaveBeenCalledWith(
      mockAudioContext.destination
    );
    expect(engine.analyserNode).toBe(mockAnalyserNode as any);
  });

  describe("load", () => {
    const testTrack: Track = { url: "test.mp3", title: "Test Title" };

    it("should set state to LOADING and update track info", () => {
      const engine = new AudioEngine();
      const trackChangeCallback = vi.fn();
      const bufferingCallback = vi.fn();
      engine.addEventListener("trackChange", trackChangeCallback);
      engine.addEventListener("bufferingStateChange", bufferingCallback);

      engine.load(testTrack);

      expect(engine.playbackState).toBe(PlaybackState.LOADING);
      expect(engine.currentTrack).toBe(testTrack);
      expect(engine.isBuffering).toBe(true);
      expect(mockAudioElement.src).toBe(testTrack.url);
      expect(mockAudioElement.load).toHaveBeenCalledTimes(1);
      expect(trackChangeCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { track: testTrack } })
      );
      expect(bufferingCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { buffering: true } })
      );
      expect(mockMediaMetadata).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Test Title" })
      );
      expect(navigator.mediaSession.metadata).toBeDefined();
    });

    it("should transition to READY when audio can play", () => {
      const engine = new AudioEngine();
      const bufferLoadedCallback = vi.fn();
      const durationChangeCallback = vi.fn();
      const bufferingCallback = vi.fn();
      engine.addEventListener("bufferLoaded", bufferLoadedCallback);
      engine.addEventListener("durationChange", durationChangeCallback);
      engine.addEventListener("bufferingStateChange", bufferingCallback);

      engine.load(testTrack);
      bufferingCallback.mockClear();

      mockAudioElement.readyState = mockAudioElement.HAVE_FUTURE_DATA;
      mockAudioElement.duration = TEST_DURATION_LONG;
      mockAudioElement._simulateEvent("canplay");

      expect(engine.playbackState).toBe(PlaybackState.READY);
      expect(engine.isBuffering).toBe(false);
      expect(bufferLoadedCallback).toHaveBeenCalledTimes(1);
      expect(durationChangeCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { duration: TEST_DURATION_LONG } })
      );
      expect(bufferingCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { buffering: false } })
      );
    });

    it("should seek to startTime when provided and audio becomes ready", () => {
      const engine = new AudioEngine();
      engine.load(testTrack, TEST_SEEK_TIME_NORMAL);
      expect(engine.playbackState).toBe(PlaybackState.LOADING);
      // Ensure src is set
      expect(mockAudioElement.src).toBe(testTrack.url);

      mockAudioElement.readyState = mockAudioElement.HAVE_METADATA;
      mockAudioElement.duration = TEST_DURATION_VERY_LONG;
      mockAudioElement._simulateEvent("canplay");

      expect(mockAudioElement.currentTime).toBe(TEST_SEEK_TIME_NORMAL);
      expect(engine.playbackState).toBe(PlaybackState.READY);
    });

    it("should not reload if the same track URL is loaded again while ready", () => {
      const engine = new AudioEngine();
      engine.load(testTrack);
      // Ensure src is set (load sets it, but we verify it's set)
      expect(mockAudioElement.src).toBe(testTrack.url);
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement.duration = TEST_DURATION_LONG;
      mockAudioElement._simulateEvent("canplay");
      expect(engine.playbackState).toBe(PlaybackState.READY);
      mockAudioElement.load.mockClear();

      engine.load(testTrack);

      expect(mockAudioElement.load).not.toHaveBeenCalled();
      expect(engine.playbackState).toBe(PlaybackState.READY);
    });
  });

  describe("playback controls", () => {
    let engine: AudioEngine;

    beforeEach(() => {
      engine = new AudioEngine();
      engine.load({ url: "play.mp3" });
      // Ensure src is set before setting duration/readyState
      mockAudioElement.src = "play.mp3";
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement.duration = TEST_DURATION_MEDIUM;
      mockAudioElement._simulateEvent("canplay");
    });

    it("play should call audio.play and set state to PLAYING", async () => {
      const playCallback = vi.fn();
      engine.addEventListener("play", playCallback);
      const bufferingCallback = vi.fn();
      engine.addEventListener("bufferingStateChange", bufferingCallback);

      await engine.play();
      mockAudioElement.play.mockClear();
      engine.pause();
      mockAudioElement._simulateEvent("pause");
      expect(engine.playbackState).toBe(PlaybackState.PAUSED);

      await engine.play();
      mockAudioElement._simulateEvent("playing");

      expect(mockAudioElement.play).toHaveBeenCalledTimes(1);
      expect(engine.playbackState).toBe(PlaybackState.PLAYING);
      expect(playCallback).toHaveBeenCalledTimes(1);
      expect(bufferingCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { buffering: false } })
      );
      expect(navigator.mediaSession.playbackState).toBe("playing");
    });

    it("pause should call audio.pause, stop analysis, dispatch event and set state to PAUSED", async () => {
      const pauseCallback = vi.fn();
      engine.addEventListener("pause", pauseCallback);

      await engine.play();
      mockAudioElement._simulateEvent("playing");
      expect(engine.playbackState).toBe(PlaybackState.PLAYING);
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
      mockRequestAnimationFrame.mockClear();

      engine.pause();
      mockAudioElement.paused = true;
      mockAudioElement._simulateEvent("pause");

      expect(mockAudioElement.pause).toHaveBeenCalledTimes(1);
      expect(engine.playbackState).toBe(PlaybackState.PAUSED);
      expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1);
      expect(pauseCallback).toHaveBeenCalledTimes(1);
      expect(navigator.mediaSession.playbackState).toBe("paused");
    });

    it("seek should set audio.currentTime", () => {
      // Ensure audio is ready before seeking (already set in beforeEach)
      // Just verify duration is set correctly
      expect(mockAudioElement.duration).toBe(TEST_DURATION_MEDIUM);

      const seekCallback = vi.fn();
      engine.addEventListener("seek", seekCallback);
      engine.seek(TEST_SEEK_TIME_LONG);
      expect(mockAudioElement.currentTime).toBe(TEST_SEEK_TIME_LONG);
      expect(seekCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { time: TEST_SEEK_TIME_LONG } })
      );
    });

    it("seek should clamp time within bounds [0, duration]", () => {
      // Ensure audio is ready before seeking (already set in beforeEach)

      engine.seek(TEST_SEEK_TIME_NEGATIVE);
      expect(mockAudioElement.currentTime).toBe(TEST_VOLUME_MIN);
      engine.seek(TEST_SEEK_TIME_HIGH);
      expect(mockAudioElement.currentTime).toBe(TEST_DURATION_MEDIUM);
    });

    it("seek should store seek time if audio not ready enough", () => {
      mockAudioElement.readyState = mockAudioElement.HAVE_NOTHING;
      mockAudioElement.duration = TEST_DURATION_MEDIUM;
      // Ensure src is set so duration getter works
      mockAudioElement.src = "play.mp3";
      engine.seek(TEST_SEEK_TIME_MEDIUM);
      expect(mockAudioElement.currentTime).toBe(TEST_VOLUME_MIN);

      mockAudioElement.readyState = mockAudioElement.HAVE_METADATA;
      mockAudioElement._simulateEvent("canplay");

      expect(mockAudioElement.currentTime).toBe(TEST_SEEK_TIME_MEDIUM);
    });

    it("setVolume should update audio.volume and audio.muted", () => {
      const volumeCallback = vi.fn();
      engine.addEventListener("volumeChange", volumeCallback);

      engine.setVolume(TEST_VOLUME_HALF);
      expect(mockAudioElement.volume).toBe(TEST_VOLUME_HALF);
      expect(mockAudioElement.muted).toBe(false);
      mockAudioElement._simulateEvent("volumechange");
      expect(volumeCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { volume: TEST_VOLUME_HALF, muted: false },
        })
      );

      volumeCallback.mockClear();
      engine.setVolume(TEST_VOLUME_MIN);
      expect(mockAudioElement.volume).toBe(TEST_VOLUME_MIN);
      expect(mockAudioElement.muted).toBe(true);
      mockAudioElement._simulateEvent("volumechange");
      expect(volumeCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { volume: TEST_VOLUME_MIN, muted: true },
        })
      );

      volumeCallback.mockClear();
      engine.setVolume(TEST_VOLUME_OVER);
      expect(mockAudioElement.volume).toBe(TEST_VOLUME_MAX);
      expect(mockAudioElement.muted).toBe(false);
      mockAudioElement._simulateEvent("volumechange");
      expect(volumeCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { volume: TEST_VOLUME_MAX, muted: false },
        })
      );

      volumeCallback.mockClear();
      engine.setVolume(TEST_VOLUME_UNDER);
      expect(mockAudioElement.volume).toBe(TEST_VOLUME_MIN);
      expect(mockAudioElement.muted).toBe(true);
      mockAudioElement._simulateEvent("volumechange");
      expect(volumeCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { volume: TEST_VOLUME_MIN, muted: true },
        })
      );
    });
  });

  describe("event handling", () => {
    let engine: AudioEngine;
    beforeEach(async () => {
      engine = new AudioEngine();
      engine.load({ url: "events.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement.duration = TEST_DURATION_SHORT;
      mockAudioElement._simulateEvent("canplay");
      // Play might not be needed for all event tests, but keep for consistency
      try {
        await engine.play();
        mockAudioElement._simulateEvent("playing");
      } catch (_e) {
        // Ignore potential context init errors in this specific setup
      }
    });

    it("should handle ended event", () => {
      const endedCallback = vi.fn();
      engine.addEventListener("ended", endedCallback);
      mockAudioElement.ended = true;
      mockAudioElement._simulateEvent("ended");
      expect(engine.playbackState).toBe(PlaybackState.IDLE);
      expect(endedCallback).toHaveBeenCalledTimes(1);
      expect(navigator.mediaSession.metadata).toBeNull();
    });

    it("should handle error event", () => {
      const errorCallback = vi.fn();
      engine.addEventListener("error", errorCallback);
      // Simulate an error object on the audio element
      mockAudioElement.error = {
        code: mockMediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
        message: "Test src not supported",
      } as any;
      mockAudioElement._simulateEvent("error");

      expect(engine.playbackState).toBe(PlaybackState.ERROR);
      // Use the mocked code value
      expect(engine.lastError).toEqual(
        expect.objectContaining({
          code: mockMediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
        })
      );
      expect(errorCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            code: mockMediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
          }),
        })
      );
    });

    it("should handle timeupdate event", () => {
      const timeUpdateCallback = vi.fn();
      engine.addEventListener("timeUpdate", timeUpdateCallback);
      mockAudioElement.currentTime = TEST_TIME_15_2;
      mockAudioElement._simulateEvent("timeupdate");
      expect(timeUpdateCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { currentTime: TEST_TIME_15_2 } })
      );
    });

    it("should handle durationchange event", () => {
      const durationChangeCallback = vi.fn();
      engine.addEventListener("durationChange", durationChangeCallback);
      mockAudioElement.duration = TEST_SEEK_TIME_75;
      mockAudioElement._simulateEvent("durationchange");
      expect(durationChangeCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { duration: TEST_SEEK_TIME_75 } })
      );
    });

    it("should handle waiting event (buffering true)", () => {
      const bufferingCallback = vi.fn();
      engine.addEventListener("bufferingStateChange", bufferingCallback);
      mockAudioElement._simulateEvent("waiting");
      expect(engine.isBuffering).toBe(true);
      expect(bufferingCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { buffering: true } })
      );
    });

    it("should handle canplaythrough event (buffering false)", () => {
      // First trigger waiting
      mockAudioElement._simulateEvent("waiting");
      expect(engine.isBuffering).toBe(true);

      const bufferingCallback = vi.fn();
      engine.addEventListener("bufferingStateChange", bufferingCallback);
      mockAudioElement._simulateEvent("canplaythrough");
      expect(engine.isBuffering).toBe(false);
      expect(bufferingCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { buffering: false } })
      );
    });

    it("should handle loadstart event (buffering true if IDLE/LOADING)", () => {
      const bufferingCallback = vi.fn();
      engine = new AudioEngine(); // New engine starts IDLE
      engine.addEventListener("bufferingStateChange", bufferingCallback);
      engine.load({ url: "loadstart.mp3" }); // This triggers load internally

      mockAudioElement._simulateEvent("loadstart");
      expect(engine.isBuffering).toBe(true);
      expect(bufferingCallback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { buffering: true } })
      );
    });
  });

  // --- Frequency Analysis Tests ---
  describe("frequency analysis", () => {
    let engine: AudioEngine;
    beforeEach(async () => {
      engine = new AudioEngine();
      engine.load({ url: "freq.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement._simulateEvent("canplay");
      await engine.play();
      mockAudioElement._simulateEvent("playing");
    });

    it("should start analysis on play by calling requestAnimationFrame and getByteFrequencyData once initially", () => {
      // Check rAF was called to schedule updates
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
      // Check getByteFrequencyData was called once during the initial synchronous startFrequencyAnalysis call
      expect(mockAnalyserNode.getByteFrequencyData).toHaveBeenCalledTimes(1);
    });

    it("should stop analysis on pause", () => {
      // Ensure it started
      expect(mockRequestAnimationFrame).toHaveBeenCalled();

      engine.pause();
      mockAudioElement._simulateEvent("pause");

      expect(mockCancelAnimationFrame).toHaveBeenCalled();
      // Cannot easily test the dispatched empty array without triggering rAF callback
    });

    it("should stop analysis on ended", () => {
      expect(mockRequestAnimationFrame).toHaveBeenCalled();

      mockAudioElement.ended = true;
      mockAudioElement._simulateEvent("ended");

      expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });
  });

  // --- Dispose Tests ---
  describe("dispose", () => {
    it("should clean up resources and reset state", async () => {
      const engine = new AudioEngine();
      const removeListenerSpy = vi.spyOn(
        mockAudioElement,
        "removeEventListener"
      );
      const cleanupMediaSpy = vi.spyOn(engine as any, "cleanupMediaSession");

      engine.load({ url: "dispose.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement._simulateEvent("canplay");
      await engine.play();
      mockAudioElement._simulateEvent("playing");

      // Capture expected listener count BEFORE dispose clears the internal map
      const expectedListenerCount = Object.keys(
        (engine as any).boundListeners
      ).length;
      expect(expectedListenerCount).toBeGreaterThan(0); // Sanity check

      engine.dispose();

      expect(mockAudioElement.pause).toHaveBeenCalled();
      expect(mockAudioElement.removeAttribute).toHaveBeenCalledWith("src");
      // Use the captured count for the assertion
      expect(removeListenerSpy).toHaveBeenCalledTimes(expectedListenerCount);
      expect(cleanupMediaSpy).toHaveBeenCalledTimes(1);
      expect(engine.playbackState).toBe(PlaybackState.IDLE);
      expect(engine.currentTrack).toBeNull();
      expect(mockCancelAnimationFrame).toHaveBeenCalled(); // Verify analysis stopped

      // Context cleanup checks
      expect(mockSourceNode.disconnect).toHaveBeenCalledTimes(1);
      expect(mockAnalyserNode.disconnect).toHaveBeenCalledTimes(1);
      // @ts-expect-error Accessing private property for test assertion
      expect(engine.isContextInitialized).toBe(false);
    });
  });

  // --- Media Session Tests ---
  describe("Media Session Integration", () => {
    let engine: AudioEngine;
    const track: Track = {
      url: "media.mp3",
      title: "Media Title",
      artist: "Media Artist",
      album: "Media Album",
      artwork: { src: "art.jpg" },
    };

    beforeEach(() => {
      engine = new AudioEngine();
    });

    it("should set up action handlers", () => {
      expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith(
        "play",
        expect.any(Function)
      );
      expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith(
        "pause",
        expect.any(Function)
      );
      expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith(
        "seekbackward",
        expect.any(Function)
      );
      expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith(
        "seekforward",
        expect.any(Function)
      );
      expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith(
        "stop",
        expect.any(Function)
      );
      expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith(
        "previoustrack",
        expect.any(Function)
      );
      expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith(
        "nexttrack",
        expect.any(Function)
      );
    });

    it("should update metadata on load", () => {
      engine.load(track);
      expect(navigator.mediaSession.metadata).toEqual({
        title: "Media Title",
        artist: "Media Artist",
        album: "Media Album",
        artwork: [{ src: "art.jpg" }],
      });
      expect(mockMediaMetadata).toHaveBeenCalledWith({
        title: "Media Title",
        artist: "Media Artist",
        album: "Media Album",
        artwork: [{ src: "art.jpg" }],
      });
    });

    it("should update playbackState on state change", async () => {
      engine.load(track);
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement._simulateEvent("canplay");

      await engine.play();
      mockAudioElement._simulateEvent("playing");
      expect(navigator.mediaSession.playbackState).toBe("playing");

      engine.pause();
      mockAudioElement._simulateEvent("pause");
      expect(navigator.mediaSession.playbackState).toBe("paused");

      mockAudioElement.ended = true;
      mockAudioElement._simulateEvent("ended");
      expect(navigator.mediaSession.playbackState).toBe("none");
    });

    it("should update positionState during playback", async () => {
      engine.load(track);
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement.duration = TEST_DURATION_200;
      mockAudioElement._simulateEvent("canplay");
      await engine.play();
      mockAudioElement._simulateEvent("playing");

      mockAudioElement.currentTime = TEST_SEEK_TIME_55;
      mockAudioElement._simulateEvent("timeupdate"); // Trigger internal update

      // Use as any for test call to private method
      (engine as any).updateMediaSessionPositionState();

      expect(navigator.mediaSession.setPositionState).toHaveBeenCalledWith({
        duration: TEST_DURATION_200,
        playbackRate: mockAudioElement.playbackRate,
        position: TEST_SEEK_TIME_55,
      });
    });

    it("should cleanup handlers and metadata on dispose", () => {
      engine.dispose();
      expect(navigator.mediaSession.metadata).toBeNull();
      expect(navigator.mediaSession.playbackState).toBe("none");
      expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith(
        "play",
        null
      );
      expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith(
        "pause",
        null
      );
      // ... check other handlers set to null
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle AudioContext initialization failure during play", async () => {
      const engine = new AudioEngine();
      const errorCallback = vi.fn();
      engine.addEventListener("error", errorCallback);

      // Mock AudioContext constructor to throw
      const _originalAudioContext = globalThis.AudioContext;
      const originalDescriptor = Object.getOwnPropertyDescriptor(
        globalThis,
        "AudioContext"
      );
      Object.defineProperty(globalThis, "AudioContext", {
        value: vi.fn(() => {
          throw new Error("Context init failed");
        }),
        writable: true,
        configurable: true,
        enumerable: originalDescriptor?.enumerable ?? true,
      });

      await engine.play();

      expect(engine.playbackState).toBe(PlaybackState.ERROR);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            code: -3,
            message: "Failed to initialize AudioContext, cannot play.",
          }),
        })
      );
      expect(engine.analyserNode).toBeNull();

      // Restore original
      if (originalDescriptor) {
        Object.defineProperty(globalThis, "AudioContext", originalDescriptor);
      }
    });

    it("should handle AudioContext resume failure during play", async () => {
      const engine = new AudioEngine();
      const errorCallback = vi.fn();
      engine.addEventListener("error", errorCallback);

      // Mock context state and resume method
      mockAudioContext.state = "suspended";
      mockAudioContext.resume.mockRejectedValueOnce(new Error("Resume failed"));

      await engine.play(); // Should attempt to resume

      expect(engine.playbackState).toBe(PlaybackState.ERROR);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            code: -4,
            message: "Failed to resume AudioContext.",
          }),
        })
      );

      // Reset mock state for other tests
      mockAudioContext.state = "running";
      mockAudioContext.resume.mockClear();
    });

    it("should handle audio.play() rejection", async () => {
      const engine = new AudioEngine();
      const errorCallback = vi.fn();
      engine.addEventListener("error", errorCallback);
      engine.load({ url: "error.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement._simulateEvent("canplay");

      // Mock audio.play to reject
      mockAudioElement.play.mockRejectedValueOnce(
        new Error("Play rejected by browser")
      );

      await engine.play();

      expect(engine.playbackState).toBe(PlaybackState.ERROR);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            code: -2,
            message: "Play rejected by browser",
          }),
        })
      );

      mockAudioElement.play.mockResolvedValue(undefined); // Restore default mock behavior
    });

    it("should handle error setting currentTime during seek", () => {
      const engine = new AudioEngine();
      engine.load({ url: "seekerror.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_METADATA;
      mockAudioElement.duration = TEST_DURATION_MEDIUM;
      mockAudioElement._simulateEvent("canplay");
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        // Mock implementation
      });
      const originalDescriptor = Object.getOwnPropertyDescriptor(
        mockAudioElement,
        "currentTime"
      );

      try {
        // Set up conditions for seek to work (duration > 0, readyState >= HAVE_METADATA)
        mockAudioElement.src = "seekerror.mp3";
        mockAudioElement.duration = TEST_DURATION_MEDIUM;
        mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;

        // Mock currentTime setter to throw
        Object.defineProperty(mockAudioElement, "currentTime", {
          set: vi.fn(() => {
            throw new Error("Invalid state for currentTime");
          }),
          get: originalDescriptor?.get,
          configurable: true,
        });

        engine.seek(TEST_SEEK_TIME_50);

        // State should not change, error should be logged
        expect(errorSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            "AudioEngine: Error setting currentTime during seek:"
          ),
          expect.any(Error)
        );
      } finally {
        // Ensure original descriptor is restored ALWAYS
        if (originalDescriptor) {
          Object.defineProperty(
            mockAudioElement,
            "currentTime",
            originalDescriptor
          );
        }
        errorSpy.mockRestore();
      }
    });

    it("should handle play called in invalid states", async () => {
      const engine = new AudioEngine();
      engine.load({ url: "invalidstate.mp3" });
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
        // Mock implementation
      });

      // State: LOADING
      // @ts-expect-error Accessing private method for test setup
      engine.setPlaybackState(PlaybackState.LOADING);
      await engine.play();
      expect(mockAudioElement.play).not.toHaveBeenCalled();
      // Use lowercase state name in expectation
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Play called in invalid state (loading)")
      );
      warnSpy.mockClear();

      // State: PLAYING
      // @ts-expect-error Accessing private method for test setup
      engine.setPlaybackState(PlaybackState.PLAYING);
      await engine.play();
      expect(mockAudioElement.play).not.toHaveBeenCalled();
      // Use lowercase state name in expectation
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Play called in invalid state (playing)")
      );
      warnSpy.mockClear();

      // State: ERROR
      // @ts-expect-error Accessing private method for test setup
      engine.setPlaybackState(PlaybackState.ERROR);
      await engine.play();
      expect(mockAudioElement.play).not.toHaveBeenCalled();
      // Use lowercase state name in expectation
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Play called in invalid state (error)")
      );
      warnSpy.mockRestore();
    });

    it("should handle seek with duration 0 or invalid time", () => {
      const engine = new AudioEngine();
      engine.load({ url: "invalidseek.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_METADATA;
      mockAudioElement.duration = TEST_VOLUME_MIN; // Duration is 0
      mockAudioElement._simulateEvent("canplay");
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
        // Mock implementation
      });

      // Case 1: Duration 0
      engine.seek(TEST_SEEK_TIME_SHORT);
      expect(mockAudioElement.currentTime).toBe(TEST_VOLUME_MIN);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Seek aborted: Invalid conditions - duration=0")
      );
      warnSpy.mockClear();

      // Case 2: NaN time
      mockAudioElement.duration = TEST_DURATION_MEDIUM; // Set valid duration
      engine.seek(Number.NaN);
      expect(mockAudioElement.currentTime).toBe(TEST_VOLUME_MIN);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Seek aborted: Invalid conditions - duration=${TEST_DURATION_MEDIUM}, seekableTime=NaN`
        )
      );
      warnSpy.mockClear();

      // Case 3: Infinity time (should NOT warn, should clamp)
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement.src = "invalidseek.mp3"; // Ensure src is set
      engine.seek(Number.POSITIVE_INFINITY);
      expect(mockAudioElement.currentTime).toBe(TEST_DURATION_MEDIUM);
      expect(warnSpy).not.toHaveBeenCalled(); // Warning should not be called here

      warnSpy.mockRestore();
    });

    it("should handle handleAudioError with ErrorEvent and string", () => {
      const engine = new AudioEngine();
      const errorCallback = vi.fn();
      engine.addEventListener("error", errorCallback);
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        // Mock implementation
      });

      // Simulate ErrorEvent
      const errorEvent = new ErrorEvent("error", {
        message: "Specific ErrorEvent message",
      });
      (engine as any).handleAudioError(errorEvent); // Call private method for test
      expect(errorCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            code: 0,
            message: "Specific ErrorEvent message",
          }),
        })
      );
      expect(engine.playbackState).toBe(PlaybackState.ERROR);
      errorCallback.mockClear();

      // Simulate string error
      (engine as any).handleAudioError("A string error message");
      expect(errorCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            code: 0,
            message: "A string error message",
          }),
        })
      );
      expect(engine.playbackState).toBe(PlaybackState.ERROR);

      errorSpy.mockRestore();
    });

    it("should attempt to reload on recoverable network error", () => {
      let setTimeoutCallback: (() => void) | null = null;
      const originalSetTimeout = globalThis.setTimeout;
      globalThis.setTimeout = vi.fn((fn: () => void, _delay: number) => {
        setTimeoutCallback = fn;
        return 1 as any;
      }) as any;

      const engine = new AudioEngine();
      engine.load({ url: "networkerror.mp3" }); // Need a loaded track
      const errorCallback = vi.fn();
      engine.addEventListener("error", errorCallback);
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        // Mock implementation
      });
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
        // Mock implementation
      });

      // Simulate network error
      mockAudioElement.error = {
        code: mockMediaError.MEDIA_ERR_NETWORK,
        message: "Network failed",
      } as any;
      mockAudioElement.networkState = mockAudioElement.NETWORK_LOADING; // Indicate network activity
      mockAudioElement._simulateEvent("error");

      expect(engine.playbackState).toBe(PlaybackState.ERROR); // Initially goes to error
      expect(errorCallback).not.toHaveBeenCalled(); // Shouldn't call final callback yet
      expect((engine as any).retryAttempts).toBe(TEST_RETRY_ATTEMPT_1);

      // Execute the setTimeout callback to trigger reload
      if (setTimeoutCallback) {
        (setTimeoutCallback as () => void)();
      }

      expect(warnSpy).toHaveBeenCalledWith(
        "AudioEngine: Attempting to reload audio source."
      );
      expect(mockAudioElement.load).toHaveBeenCalledTimes(2); // Initial load + reload
      expect(engine.playbackState).toBe(PlaybackState.LOADING); // State changes on reload attempt

      globalThis.setTimeout = originalSetTimeout;
      errorSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it("should not reload if max retries reached", () => {
      vi.useFakeTimers();
      const engine = new AudioEngine();
      engine.load({ url: "networkerror_max.mp3" });
      const errorCallback = vi.fn();
      engine.addEventListener("error", errorCallback);
      (engine as any).retryAttempts = TEST_RETRY_ATTEMPT_3; // Use dot notation

      mockAudioElement.error = {
        code: mockMediaError.MEDIA_ERR_NETWORK,
        message: "Network failed",
      } as any;
      mockAudioElement.networkState = mockAudioElement.NETWORK_LOADING;
      mockAudioElement._simulateEvent("error");

      expect(engine.playbackState).toBe(PlaybackState.ERROR);
      expect(errorCallback).toHaveBeenCalled(); // Final error dispatched
      expect(mockAudioElement.load).toHaveBeenCalledTimes(1); // No reload

      vi.useRealTimers();
    });

    it("should handle reloadAudio when currentTrack is null", () => {
      const engine = new AudioEngine();
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        // Mock implementation
      });
      // Don't load track, so _currentTrack is null
      (engine as any).reloadAudio(); // Call private method
      expect(errorSpy).toHaveBeenCalledWith(
        "AudioEngine: Cannot reload - no current source or track."
      );
      errorSpy.mockRestore();
    });
  });

  describe("Media Session and Global API Edge Cases", () => {
    beforeAll(() => {
      // Store original navigator if needed
      const _originalNavigator = globalThis.navigator;
    });

    afterAll(() => {
      // Restore original navigator
      const originalDescriptor = Object.getOwnPropertyDescriptor(
        globalThis,
        "navigator"
      );
      if (originalDescriptor) {
        Object.defineProperty(globalThis, "navigator", originalDescriptor);
      }
    });

    it("should handle missing Media Session API gracefully", () => {
      // Temporarily remove mediaSession
      const originalDescriptor = Object.getOwnPropertyDescriptor(
        globalThis,
        "navigator"
      );
      Object.defineProperty(globalThis, "navigator", {
        value: {
          /* no mediaSession */
        },
        writable: true,
        configurable: true,
        enumerable: originalDescriptor?.enumerable ?? true,
      });

      const engine = new AudioEngine(); // Constructor calls setupMediaSessionHandlers
      // No error should be thrown

      const track = { url: "nomedia.mp3", title: "No Media" };
      engine.load(track);
      // @ts-expect-error Accessing private method
      engine.setPlaybackState(PlaybackState.PLAYING);
      engine.seek(TEST_SEEK_TIME_SHORT); // Calls updateMediaSessionPositionState
      engine.dispose(); // Calls cleanupMediaSession

      // Just ensure no errors were thrown during the calls
      expect(true).toBe(true);
    });

    it("should handle updateMediaSessionMetadata when _currentTrack is null", () => {
      const engine = new AudioEngine();
      // Ensure metadata is initially something
      navigator.mediaSession.metadata = new MediaMetadata({ title: "temp" });
      expect(navigator.mediaSession.metadata).not.toBeNull();

      // Don't load track
      (engine as any).updateMediaSessionMetadata(); // Call private method

      expect(navigator.mediaSession.metadata).toBeNull();
    });

    it("should handle updateMediaSessionPositionState when not playing or data invalid", () => {
      const engine = new AudioEngine();
      engine.load({ url: "position.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement._simulateEvent("canplay");
      mockSetPositionState.mockClear();

      // State not PLAYING - Should not call
      // @ts-expect-error Accessing private method for test setup
      engine.setPlaybackState(PlaybackState.PAUSED);
      (engine as any).updateMediaSessionPositionState();
      expect(mockSetPositionState).not.toHaveBeenCalled();

      // State is PLAYING, but duration is NaN (getter returns 0)
      // @ts-expect-error Accessing private method for test setup
      engine.setPlaybackState(PlaybackState.PLAYING);
      const originalDurationDesc = Object.getOwnPropertyDescriptor(
        mockAudioElement,
        "duration"
      );
      const originalCurrentTimeDesc = Object.getOwnPropertyDescriptor(
        mockAudioElement,
        "currentTime"
      );

      // Mock underlying duration to NaN
      Object.defineProperty(mockAudioElement, "duration", {
        value: Number.NaN,
        configurable: true,
      });
      // Mock underlying currentTime to 0 for this case
      Object.defineProperty(mockAudioElement, "currentTime", {
        value: 0,
        configurable: true,
      });
      (engine as any).updateMediaSessionPositionState();
      // Expect call with duration 0 (due to getter conversion)
      expect(mockSetPositionState).toHaveBeenCalledWith(
        expect.objectContaining({ duration: 0, position: 0 })
      );
      mockSetPositionState.mockClear(); // Clear for next check

      // Restore duration descriptor AND explicitly set value
      if (originalDurationDesc) {
        Object.defineProperty(
          mockAudioElement,
          "duration",
          originalDurationDesc
        );
      }
      mockAudioElement.duration = TEST_DURATION_MEDIUM; // Explicitly set duration after restoring descriptor

      // Mock underlying currentTime to NaN
      Object.defineProperty(mockAudioElement, "currentTime", {
        value: Number.NaN,
        configurable: true,
      });
      (engine as any).updateMediaSessionPositionState();
      // Expect call with position 0 (due to getter conversion) and restored duration
      expect(mockSetPositionState).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: TEST_DURATION_MEDIUM,
          position: TEST_VOLUME_MIN,
        })
      );

      // Restore original currentTime descriptor
      if (originalCurrentTimeDesc) {
        Object.defineProperty(
          mockAudioElement,
          "currentTime",
          originalCurrentTimeDesc
        );
      }
    });

    it("should handle errors in updateMediaSessionMetadata and setPositionState", () => {
      const engine = new AudioEngine();
      engine.load({ url: "mediaerror.mp3", title: "Err" });
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        // Mock implementation
      });
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
        // Mock implementation
      });

      // Error setting metadata
      const _originalMediaMetadata = globalThis.MediaMetadata;
      const originalMetadataDescriptor = Object.getOwnPropertyDescriptor(
        globalThis,
        "MediaMetadata"
      );
      Object.defineProperty(globalThis, "MediaMetadata", {
        value: vi.fn(() => {
          throw new Error("Metadata constructor failed");
        }),
        writable: true,
        configurable: true,
        enumerable: originalMetadataDescriptor?.enumerable ?? true,
      });
      (engine as any).updateMediaSessionMetadata();
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error setting media session metadata"),
        expect.any(Error)
      );
      // Restore
      if (originalMetadataDescriptor) {
        Object.defineProperty(
          globalThis,
          "MediaMetadata",
          originalMetadataDescriptor
        );
      }
      errorSpy.mockClear();

      // Error setting position state
      // @ts-expect-error Accessing private method for test setup
      engine.setPlaybackState(PlaybackState.PLAYING);
      mockAudioElement.duration = TEST_DURATION_MEDIUM;
      mockAudioElement.currentTime = TEST_SEEK_TIME_SHORT;
      mockSetPositionState.mockImplementationOnce(() => {
        throw new Error("setPositionState failed");
      }); // Use the specific mock
      (engine as any).updateMediaSessionPositionState();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error setting media session position state"),
        expect.any(Error)
      );

      errorSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it("updateMediaSessionPositionState should return early if duration or position is not finite", () => {
      const engine = new AudioEngine();
      engine.load({ url: "pos_infinite.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement._simulateEvent("canplay");
      // @ts-expect-error Accessing private method for test setup
      engine.setPlaybackState(PlaybackState.PLAYING);
      mockSetPositionState.mockClear();

      const originalDurationDesc = Object.getOwnPropertyDescriptor(
        mockAudioElement,
        "duration"
      );
      const originalCurrentTimeDesc = Object.getOwnPropertyDescriptor(
        mockAudioElement,
        "currentTime"
      );

      try {
        // Case 1: Infinite Duration (getter returns 0, so setPositionState IS called)
        Object.defineProperty(mockAudioElement, "duration", {
          value: Number.POSITIVE_INFINITY,
          configurable: true,
        });
        Object.defineProperty(mockAudioElement, "currentTime", {
          value: TEST_SEEK_TIME_SHORT,
          configurable: true,
        });
        (engine as any).updateMediaSessionPositionState();
        expect(mockSetPositionState).toHaveBeenCalledWith(
          expect.objectContaining({
            duration: TEST_VOLUME_MIN,
            position: TEST_SEEK_TIME_SHORT,
          })
        );
        mockSetPositionState.mockClear(); // Clear for next cases

        // Case 2: Infinite Position (getter returns 0, but NaN check in original value might be relevant? No, getter handles it)
        // Actually, getter for position returns the value directly if not NaN. The isFinite check IS in the function.
        Object.defineProperty(mockAudioElement, "duration", {
          value: TEST_DURATION_MEDIUM,
          configurable: true,
        });
        Object.defineProperty(mockAudioElement, "currentTime", {
          value: Number.POSITIVE_INFINITY,
          configurable: true,
        });
        (engine as any).updateMediaSessionPositionState();
        // Position IS finite check should fail here.
        expect(mockSetPositionState).not.toHaveBeenCalled();

        // Case 3: Negative Infinite Position
        Object.defineProperty(mockAudioElement, "currentTime", {
          value: Number.NEGATIVE_INFINITY,
          configurable: true,
        });
        (engine as any).updateMediaSessionPositionState();
        // Position IS finite check should fail here.
        expect(mockSetPositionState).not.toHaveBeenCalled();
      } finally {
        // Restore original descriptors
        if (originalDurationDesc) {
          Object.defineProperty(
            mockAudioElement,
            "duration",
            originalDurationDesc
          );
        }
        if (originalCurrentTimeDesc) {
          Object.defineProperty(
            mockAudioElement,
            "currentTime",
            originalCurrentTimeDesc
          );
        }
      }
    });
  });

  describe("Frequency Analysis Edge Cases", () => {
    it("should not start analysis if context not initialized", () => {
      const engine = new AudioEngine();
      // Don't call play, so context is not initialized
      (engine as any).startFrequencyAnalysis();
      expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
    });

    it("should not start analysis if already running", async () => {
      const engine = new AudioEngine();
      engine.load({ url: "freqrun.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement._simulateEvent("canplay");
      await engine.play();
      mockAudioElement._simulateEvent("playing");

      expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
      mockRequestAnimationFrame.mockClear();

      // Call start again while it should be running
      (engine as any).startFrequencyAnalysis();
      expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
    });

    it("should stop updateFrequencyData loop if analyserNode becomes null", async () => {
      const engine = new AudioEngine();
      engine.load({ url: "freqnull1.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement._simulateEvent("canplay");
      await engine.play(); // Await play
      mockAudioElement._simulateEvent("playing");
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
      engine.analyserNode = null;
      (engine as any).updateFrequencyData();
      expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
      expect((engine as any).animationFrameId).toBeNull();
    });

    it("should stop updateFrequencyData loop if frequencyDataBuffer becomes null", async () => {
      const engine = new AudioEngine();
      engine.load({ url: "freqnull2.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement._simulateEvent("canplay");
      await engine.play(); // Await play
      mockAudioElement._simulateEvent("playing");
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
      (engine as any).frequencyDataBuffer = null;
      (engine as any).updateFrequencyData();
      expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
      expect((engine as any).animationFrameId).toBeNull();
    });
  });

  describe("Misc", () => {
    it("initAudioContext should return true immediately if already initialized", async () => {
      const engine = new AudioEngine();
      await engine.play(); // Initialize context
      expect((engine as any).isContextInitialized).toBe(true);
      const initSpy = vi.spyOn(engine as any, "initAudioContext");
      (engine as any).initAudioContext(); // Call again
      expect(initSpy).toHaveReturnedWith(true);
      expect(globalThis.AudioContext).toHaveBeenCalledTimes(1); // Constructor should only be called once
    });
  });

  describe("Event Handling Edge Cases", () => {
    it("handleAudioPause should return early if state is LOADING", () => {
      const engine = new AudioEngine();
      engine.load({ url: "pause_loading.mp3" });
      expect(engine.playbackState).toBe(PlaybackState.LOADING);
      const pauseCallback = vi.fn();
      engine.addEventListener("pause", pauseCallback);

      // Directly call the handler (or simulate event) while state is LOADING
      (engine as any).handleAudioPause();

      expect(engine.playbackState).toBe(PlaybackState.LOADING); // State should not change to PAUSED
      expect(pauseCallback).not.toHaveBeenCalled(); // Pause event should not be dispatched
    });

    it("handleAudioPause should return early if audio has ended", () => {
      const engine = new AudioEngine();
      engine.load({ url: "pause_ended.mp3" });
      mockAudioElement.readyState = mockAudioElement.HAVE_ENOUGH_DATA;
      mockAudioElement._simulateEvent("canplay");
      engine.play();
      mockAudioElement._simulateEvent("playing");
      mockAudioElement.ended = true; // Simulate ended state
      mockAudioElement._simulateEvent("ended"); // Trigger ended logic
      expect(engine.playbackState).toBe(PlaybackState.IDLE);

      const pauseCallback = vi.fn();
      engine.addEventListener("pause", pauseCallback);

      // Simulate pause event occurring after ended
      mockAudioElement.paused = true;
      mockAudioElement._simulateEvent("pause");

      expect(engine.playbackState).toBe(PlaybackState.IDLE); // State should remain IDLE
      expect(pauseCallback).not.toHaveBeenCalled();
    });

    it("handleAudioPause should return early if state is IDLE", () => {
      const engine = new AudioEngine();
      // Engine starts in IDLE state
      expect(engine.playbackState).toBe(PlaybackState.IDLE);
      const pauseCallback = vi.fn();
      engine.addEventListener("pause", pauseCallback);
      const stopAnalysisSpy = vi.spyOn(engine as any, "stopFrequencyAnalysis");

      // Directly call the handler while state is IDLE
      (engine as any).handleAudioPause();

      expect(engine.playbackState).toBe(PlaybackState.IDLE); // State should remain IDLE
      expect(pauseCallback).not.toHaveBeenCalled();
      // stopFrequencyAnalysis IS called at the start, regardless of the return
      expect(stopAnalysisSpy).toHaveBeenCalled();
      // But setPlaybackState(PAUSED) should not be called
      // (Difficult to assert non-call on private method directly, rely on state check)
    });
  });
});
