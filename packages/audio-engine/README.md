# `audio-engine`

A flexible audio engine, built on top of the Web Audio API, with a convenient React integration layer.

## Features

*   **Core Engine:** Simple API for audio playback control (`play`, `pause`, `seek`, `volume`), event-driven architecture, state/error reporting, and Web Audio analysis (`AnalyserNode`).
*   **React Integration:** `AudioProvider` and hooks (`useAudio`, `useAudioState`, `useAudioTime`) for easy state management and performance optimization in React applications.
*   **Media Session API:** Automatic integration for platform media controls.

## Installation

Install the package using your preferred package manager:

```bash
npm install audio-engine
# or
yarn add audio-engine
# or
pnpm add audio-engine
# or
bun add audio-engine
```

## Usage with React

This package provides React context and hooks for easy integration.

### 1. Wrap your application (or relevant part) with `AudioProvider`:

```jsx
// In your main layout or component tree root
import { AudioProvider } from 'audio-engine/react';

function App() {
  return (
    <AudioProvider>
      {/* Your application components */}
      <MyAudioPlayer />
    </AudioProvider>
  );
}
```

### 2. Use the hooks in your components:

Components wrapped by `AudioProvider` can access the audio state and controls using the provided hooks.

**Primary Hooks:**

*   `useAudio()`: Provides the most common states (playback, status, volume) and all actions (`play`, `pause`, `load`, `seek`, `setVolume`). Recommended for most components interacting with the player.
*   `useAudioState()`: Provides only the common states, useful for display components that don't need actions.
*   `useAudioTime()`: Provides only `currentTime` and `duration`. Use this specifically in components that need frequent time updates (like a seek bar) to avoid unnecessary re-renders.

**Example Component:**

```jsx
import React from 'react';
import { useAudio, PlaybackState } from 'audio-engine/react';

function MyAudioControls() {
  const { isPlaying, playbackState, play, pause } = useAudio();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (playbackState === PlaybackState.PAUSED || playbackState === PlaybackState.READY) {
      play();
    }
    // Add logic for loading/playing when IDLE if needed
  };

  return (
    <div>
      <button onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      {/* Add more controls: load button, seek bar using useAudioTime, etc. */}
    </div>
  );
}
```

### Available Hooks and State Slices

*   **`useAudio()`**: Returns memoized `{ ...state, ...actions }`
    *   `playbackState`: `PlaybackState` (enum)
    *   `currentMusic`: `Music | null`
    *   `isBuffering`: `boolean`
    *   `error`: `{ code?: number; message?: string } | null`
    *   `isPlaying`: `boolean`
    *   `isLoading`: `boolean`
    *   `engine`: `IAudioEngine | null` (Access to the core engine instance if needed)
    *   `isEngineInitialized`: `boolean`
    *   `analyserNode`: `AnalyserNode | null`
    *   `volume`: `number` (0-1)
    *   `isMuted`: `boolean`
    *   `load`: `(music: Music, startTime?: number) => void`
    *   `play`: `() => void`
    *   `pause`: `() => void`
    *   `seek`: `(time: number) => void`
    *   `setVolume`: `(volume: number) => void`
*   **`useAudioState()`**: Returns memoized subset of `useAudio()` containing only state properties.
*   **`useAudioTime()`**: Returns memoized `{ currentTime: number, duration: number }`

## API Reference (Core Engine)

This refers to the standalone `AudioEngine` class, which is also accessible via `useAudio().engine`.

### `AudioEngine` Class

The main class for managing audio playback.

#### Constructor

```typescript
// Core engine only
import { AudioEngine } from 'audio-engine';
const engine = new AudioEngine();
```

Creates a new `AudioEngine` instance. The `AudioContext` is initialized lazily.

#### Properties

- `playbackState: PlaybackState` (Readonly): Current state (`IDLE`, `LOADING`, `READY`, `PLAYING`, `PAUSED`, `ERROR`).
- `currentMusic: Music | null` (Readonly): Currently loaded track details.
- `volume: number` (Readonly): Volume level (0 to 1).
- `duration: number` (Readonly): Track duration in seconds.
- `currentTime: number` (Readonly): Current playback position in seconds.
- `isMuted: boolean` (Readonly): If audio is muted.
- `isBuffering: boolean` (Readonly): If the engine is buffering.
- `lastError: { code: number; message: string } | null` (Readonly): Last error details.
- `analyserNode: AnalyserNode | null` (Readonly): Web Audio `AnalyserNode` (after context init).
- `frequencyData: Uint8Array | null` (Readonly): Latest frequency data.

#### Methods

- `load(music: Music, startTime?: number): Promise<void>`: Loads a track.
- `play(): Promise<void>`: Starts/resumes playback (requires user interaction).
- `pause(): void`: Pauses playback.
- `seek(time: number): void`: Seeks to a specific time.
- `setVolume(volume: number): void`: Sets volume (0.0-1.0).
- `dispose(): void`: Cleans up resources.
- `addEventListener<K extends keyof AudioEngineEventMap>(...)`: Adds an event listener.
- `removeEventListener<K extends keyof AudioEngineEventMap>(...)`: Removes an event listener.

### Interfaces & Enums

*   **`Music` Interface:** Defines track data (`url`, `title`, `artist`, etc.). See `src/interfaces.ts`.
*   **`PlaybackState` Enum:** (`IDLE`, `LOADING`, `READY`, `PLAYING`, `PAUSED`, `ERROR`). See `src/interfaces.ts`.
*   **`AudioEngineEventMap`:** Defines available events and their details. See `src/interfaces.ts`.

## Advanced Usage

### Audio Analysis / Visualization (Using Core Engine)

Access the `analyserNode` for visualizations (typically after playback starts).

```typescript
const { engine, analyserNode, isPlaying } = useAudio(); // Or use standalone engine

React.useEffect(() => {
  if (isPlaying && analyserNode) {
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);
      // Use dataArray to draw visualization...
      // console.log(dataArray[0]);
    };
    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }
}, [isPlaying, analyserNode]);
```

*(Note: The `useAudioFrequency` hook provides direct access to `frequencyData` state if preferred)*

### Media Session API Integration

The `AudioEngine` automatically handles Media Session API interactions (metadata, playback state, actions) if available. Provide `title`, `artist`, and `artwork` in the `Music` object for best results.

## Browser Compatibility

- **Web Audio API**: Required. Supported in all modern browsers.
- **Media Session API**: Enhances experience. Supported in most modern browsers (check caniuse.com).

## Contributing

Contributions welcome! See the main [CONTRIBUTING.md](../CONTRIBUTING.md).

## License

MIT - see [LICENSE](./LICENSE).

---
