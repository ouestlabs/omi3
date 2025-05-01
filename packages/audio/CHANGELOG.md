# @omi3/audio

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

## 0.0.5

### Patch Changes

- ae33cb4: .

  This changeset includes minor updates and improvements across multiple packages in the Omi3 project:

  - @omi3/audio: Add classNames to the audio visualizer.
  - @omi3/ui: Add DropdownMenu, Skeleton.
  - @omi3/site: Add theme widget to the player.

  These patch updates aim to enhance stability, performance, and user experience without introducing major new features or breaking existing functionality.

## 0.0.4

### Patch Changes

- 66ce409: optmisation
- 65b41df: formating

## 0.0.3

### Patch Changes

- 5cfdef7: update readme

## 0.0.2

### Patch Changes

- 537f255: .

## 0.0.1

### Patch Changes

- 203f78f: init changeset
