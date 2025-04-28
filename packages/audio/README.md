# `@omi3/audio`

A flexible audio management library for web applications using the Web Audio API.

## Features

- Simple API for audio playback control (`play`, `pause`, `seek`, `volume`).
- Support for loading audio files (`load`).
- Event-driven architecture (`addEventListener`, `removeEventListener`).
- Provides playback state (`PlaybackState`), buffering status, and error information.
- Built-in audio analysis capabilities via `AnalyserNode` and frequency data events.
- Automatic integration with the Media Session API for platform media controls.

## Installation

Install the package using npm, yarn or pnpm:

```bash
npm install @omi3/audio
```

```bash
yarn add @omi3/audio
```

```bash
pnpm add @omi3/audio
```

## Usage

Here's a basic example of how to use the library:

```ts
import { AudioEngine, PlaybackState, type Music, type AudioEngineEventMap } from '@omi3/audio';

// Create an instance of the AudioEngine
const audioEngine = new AudioEngine();

// Define the music track
const music: Music = {
  // id: 'unique-track-id', // Optional: Provide an ID if needed
  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Required: URL of the audio source
  title: 'SoundHelix Song 1', // Recommended for Media Session
  artist: 'SoundHelix',        // Recommended for Media Session
  album: 'Examples',           // Optional
  artwork: [                   // Optional: For Media Session artwork
    { src: 'https://via.placeholder.com/96', sizes: '96x96', type: 'image/png' },
    { src: 'https://via.placeholder.com/128', sizes: '128x128', type: 'image/png' },
  ]
};

// --- Event Listeners ---
audioEngine.addEventListener('playbackStateChange', (event) => {
  console.log('Playback State Changed:', event.detail.state);
  // Example: Update UI based on state (PLAYING, PAUSED, LOADING, etc.)
});

audioEngine.addEventListener('timeUpdate', (event) => {
  console.log(`Current Time: ${event.detail.currentTime.toFixed(2)}s`);
});

audioEngine.addEventListener('durationChange', (event) => {
  console.log(`Duration: ${event.detail.duration.toFixed(2)}s`);
});

audioEngine.addEventListener('bufferLoaded', () => {
  console.log('Audio buffer loaded, ready to play.');
});

audioEngine.addEventListener('bufferingStateChange', (event) => {
  console.log('Buffering:', event.detail.buffering);
  // Example: Show/hide a loading indicator
});

audioEngine.addEventListener('error', (event) => {
  console.error('Audio Engine Error:', event.detail.code, event.detail.message);
});

audioEngine.addEventListener('ended', () => {
  console.log('Playback ended.');
});

// --- Control Functions ---
async function controlAudio() {
  try {
    console.log('Loading music...');
    // Load the music (AudioContext is initialized implicitly on first interaction)
    await audioEngine.load(music);
    // Note: Playback might require user interaction (e.g., a button click)
    // to start due to browser autoplay policies.
    console.log('Music loaded. Ready to play (may require user interaction).');

    // Example: Simulate playing after a user interaction (e.g., button click)
    // In a real app, call play() inside a user event handler.
    document.getElementById('playButton')?.addEventListener('click', async () => {
       if (audioEngine.playbackState !== PlaybackState.PLAYING) {
          console.log('Playing...');
          await audioEngine.play();
       }
    });
     document.getElementById('pauseButton')?.addEventListener('click', () => {
        if (audioEngine.playbackState === PlaybackState.PLAYING) {
           console.log('Pausing...');
           audioEngine.pause();
        }
     });
     document.getElementById('seekButton')?.addEventListener('click', () => {
         const seekTime = 30; // Seek to 30 seconds
         console.log(`Seeking to ${seekTime}s...`);
         audioEngine.seek(seekTime);
     });


  } catch (error) {
    console.error('Failed to load or play audio:', error);
  }
}

// Call the control function (ensure necessary DOM elements exist if using buttons)
controlAudio();

// --- Don't forget to clean up ---
// When the component unmounts or the engine is no longer needed:
// audioEngine.dispose();
```

*(Note: The example above includes simulated button clicks. In a real application, ensure `play()` is initiated by a user gesture like a click.)*

## API Reference

### `AudioEngine`

The main class for managing audio playback.

#### Constructor

```typescript
constructor()
```

Creates a new `AudioEngine` instance. The `AudioContext` is initialized lazily when needed (e.g., on the first call to `play()` or `load()` that requires context interaction).

#### Properties

- `playbackState: PlaybackState` (Readonly): The current playback state (e.g., `IDLE`, `LOADING`, `READY`, `PLAYING`, `PAUSED`, `ERROR`).
- `currentMusic: Music | null` (Readonly): The currently loaded music track details.
- `volume: number` (Readonly): The current volume level (0 to 1).
- `duration: number` (Readonly): The total duration of the current track in seconds (returns 0 if unavailable).
- `currentTime: number` (Readonly): The current playback position in seconds (returns 0 if unavailable).
- `isMuted: boolean` (Readonly): True if the audio is muted (either volume is 0 or muted property is set).
- `isBuffering: boolean` (Readonly): True if the engine is currently buffering data.
- `lastError: { code: number; message: string } | null` (Readonly): Details of the last error encountered.
- `analyserNode: AnalyserNode | null` (Readonly): The Web Audio `AnalyserNode` used for frequency analysis (available after context initialization).
- `frequencyData: Uint8Array | null` (Readonly): The latest frequency data obtained from the `analyserNode`.

#### Methods

- `load(music: Music, startTime?: number): Promise<void>`: Loads a new audio track. Rejects if loading fails. `startTime` allows seeking upon loading.
- `play(): Promise<void>`: Starts or resumes playback. Requires user interaction on many browsers. Rejects on playback errors (e.g., decode errors, context issues).
- `pause(): void`: Pauses the current playback.
- `seek(time: number): void`: Seeks to a specific time (in seconds) in the audio track.
- `setVolume(volume: number): void`: Sets the playback volume (0.0 to 1.0). Values outside this range are clamped. Setting volume to 0 also sets `muted` to true.
- `dispose(): void`: Stops playback, releases audio resources (including `AudioContext` nodes), and removes event listeners. Call this when the engine is no longer needed.
- `addEventListener<K extends keyof AudioEngineEventMap>(type: K, listener: (ev: AudioEngineEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void`: Adds an event listener for specified event types.
- `removeEventListener<K extends keyof AudioEngineEventMap>(type: K, listener: (ev: AudioEngineEventMap[K]) => any, options?: boolean | EventListenerOptions): void`: Removes a previously added event listener.

### `Music` Interface

Represents the data for a music track.

```typescript
interface Music {
  url: string; // REQUIRED: Path or URL to the audio file
  id?: string; // Optional: Unique identifier for the track
  title?: string; // Optional, Recommended for Media Session
  artist?: string; // Optional, Recommended for Media Session
  album?: string; // Optional, Recommended for Media Session
  artwork?: MediaImage[]; // Optional, Recommended for Media Session (Array of { src, sizes?, type? })
}

// Example MediaImage structure (used in artwork)
// interface MediaImage {
//   src: string; // URL of the image
//   sizes?: string; // e.g., '96x96'
//   type?: string; // e.g., 'image/png'
// }
```

### Events (`AudioEngineEventMap`)

Listen to events using `audioEngine.addEventListener(eventType, callback)`. Events are `CustomEvent` instances; access details via `event.detail`.

- `playbackStateChange`: Fired when `playbackState` changes. `detail: { state: PlaybackState }`
- `trackChange`: Fired when a new track starts loading via `load()`. `detail: { music: Music | null }`
- `timeUpdate`: Fired frequently during playback. `detail: { currentTime: number }`
- `durationChange`: Fired when the duration becomes available or changes. `detail: { duration: number }`
- `volumeChange`: Fired when volume or mute status changes. `detail: { volume: number; muted: boolean }`
- `error`: Fired on playback or loading errors. `detail: { code: number; message: string }`
- `bufferingStateChange`: Fired when buffering starts or stops. `detail: { buffering: boolean }`
- `bufferLoaded`: Fired when enough data is buffered to start or resume playback without interruption.
- `frequencyDataUpdate`: Fired repeatedly when frequency analysis is active (during playback). `detail: { data: Uint8Array }`
- `ended`: Fired when playback reaches the end of the track.
- `play`: Fired when playback successfully starts or resumes.
- `pause`: Fired when playback is successfully paused.
- `seek`: Fired after a seek operation completes. `detail: { time: number }`
- `requestPreviousTrack`: Fired when the Media Session 'previous track' action is invoked.
- `requestNextTrack`: Fired when the Media Session 'next track' action is invoked.

### `PlaybackState` Enum

Indicates the current status of the audio engine.

```typescript
enum PlaybackState {
  IDLE = "idle",         // No music loaded or playback finished/stopped.
  LOADING = "loading",   // Music is being loaded.
  READY = "ready",       // Music loaded and ready to play.
  PLAYING = "playing",   // Music is actively playing.
  PAUSED = "paused",     // Music is paused.
  ERROR = "error",       // An error occurred.
}
```

## Advanced Usage

### Audio Analysis / Visualization

Access the `AnalyserNode` and frequency data for visualizations.

```ts
import { AudioEngine } from '@omi3/audio';

const audioEngine = new AudioEngine();

// Wait for context/analyser to be ready (e.g., after load or play)
audioEngine.addEventListener('playbackStateChange', (event) => {
  if (event.detail.state === PlaybackState.PLAYING && audioEngine.analyserNode) {
    const analyser = audioEngine.analyserNode;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function draw() {
      requestAnimationFrame(draw);
      // Use latest data from the event or property
      const currentFreqData = audioEngine.frequencyData;
      if (currentFreqData) {
        // Or use analyser.getByteFrequencyData(dataArray) if preferred
        // Use currentFreqData (or dataArray) to draw visualization...
        console.log(currentFreqData[0]); // Example: log first frequency bin value
      }
    }
    draw();

    // Alternative: Use the frequencyDataUpdate event
    audioEngine.addEventListener('frequencyDataUpdate', (freqEvent) => {
        // Use freqEvent.detail.data for visualization
        // console.log(freqEvent.detail.data[0]);
    });

  }
});

// Load and play music as shown in the basic usage example...
```

### Media Session API Integration

The `AudioEngine` automatically interacts with the Media Session API when available:
- Sets metadata (`title`, `artist`, `album`, `artwork`) from the loaded `Music` object.
- Updates playback state (`playing`, `paused`).
- Handles playback actions (play, pause, seek backward/forward, stop, previous/next track).
- Listens for `requestPreviousTrack` and `requestNextTrack` events to implement track skipping logic in your application.

Ensure you provide relevant metadata in the `Music` object for the best integration.

## Browser Compatibility

This library relies on the **Web Audio API** and **Media Session API**.
- **Web Audio API**: Supported in all modern browsers.
- **Media Session API**: Supported in most modern browsers, particularly on mobile platforms and Chromium-based desktops. Check [caniuse.com](https://caniuse.com/mediasession) for details.

Consider fallbacks or graceful degradation if targeting browsers without full support.

## Contributing

Contributions are welcome! Please adhere to standard contribution guidelines (e.g., fork, branch, PR). Ensure code quality and add tests where appropriate.

## License

This package is licensed under Apache-2.0 - see the [LICENSE](LICENSE) file for details.

---

<div>
  <img alt="NPM" src="https://img.shields.io/npm/v/%40omi3%2Faudio?color=red&label=npm&logo=npm&logoColor=red">
  <img alt="NPM Unpacked Size" src="https://img.shields.io/npm/unpacked-size/%40omi3%2Faudio">
</div>
