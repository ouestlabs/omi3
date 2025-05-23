# @omi3/typescript

## 2.0.2

### Patch Changes

- 377072e: - chore(cleanup): remove obsolete GitHub workflow files for build, PR checks, and audio interfaces
  - chore(cleanup): remove obsolete GitHub workflow files for build, PR checks, and audio interfaces

## 2.0.1

### Patch Changes

- 3409e79: chore(cleanup): remove unused configuration files and component stories in the UI package

## 2.0.0

### Major Changes

- 20d70ee: Major overhaul of the `@omi3/audio` package.

  - Renamed `AudioChannel` to `AudioEngine`.
  - Replaced constructor-based `EventHandler` with standard `addEventListener`/`removeEventListener` pattern for events.
  - Updated the `Music` interface to better support Media Session API metadata (title, artist, album, artwork).
  - Introduced new properties like `playbackState`, `isBuffering`, `lastError`, `frequencyData`.
  - Removed `initialize()` and `isPlaying()` methods.
  - Added explicit Media Session API integration.
  - Simplified constructor, `AudioContext` is now initialized internally when needed.
  - Added Reusable React components for building audio interfaces (details TBD).

  This update introduces significant breaking changes to the API surface.

## 1.0.0

### Major Changes

- 2c0b3bf: Major overhaul of the `@omi3/audio` package.

  - Renamed `AudioChannel` to `AudioEngine`.
  - Replaced constructor-based `EventHandler` with standard `addEventListener`/`removeEventListener` pattern for events.
  - Updated the `Music` interface to better support Media Session API metadata (title, artist, album, artwork).
  - Introduced new properties like `playbackState`, `isBuffering`, `lastError`, `frequencyData`.
  - Removed `initialize()` and `isPlaying()` methods.
  - Added explicit Media Session API integration.
  - Simplified constructor, `AudioContext` is now initialized internally when needed.
  - Added Reusable React components for building audio interfaces (details TBD).

  This update introduces significant breaking changes to the API surface.

## 0.0.1

### Patch Changes

- a2895a9: .
