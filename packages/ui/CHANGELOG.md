# @omi3/ui

## 2.0.3

### Patch Changes

- 0663589: feat(audio): enhance audio engine interfaces and context management

  - Expanded the PlaybackState enum to include additional states for better playback control.
  - Introduced a comprehensive Music interface with detailed metadata properties for audio tracks.
  - Updated the AudioEngine class to implement new event types and methods for improved audio handling.
  - Refactored context management in the AudioProvider to utilize multiple specialized contexts for optimized performance.
  - Added new hooks for accessing audio state and actions, enhancing the usability of the audio components.

  These changes aim to provide a more robust and flexible audio playback experience, facilitating better integration and interaction within the application.

- Updated dependencies [0663589]
  - @omi3/audio@2.0.3

## 2.0.2

### Patch Changes

- 377072e: - chore(cleanup): remove obsolete GitHub workflow files for build, PR checks, and audio interfaces
  - chore(cleanup): remove obsolete GitHub workflow files for build, PR checks, and audio interfaces
- Updated dependencies [377072e]
  - @omi3/audio@2.0.2
  - @omi3/utils@2.0.2

## 2.0.1

### Patch Changes

- 3409e79: chore(cleanup): remove unused configuration files and component stories in the UI package
- Updated dependencies [3409e79]
  - @omi3/audio@2.0.1
  - @omi3/utils@2.0.1

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

### Patch Changes

- Updated dependencies [20d70ee]
  - @omi3/audio@2.0.0
  - @omi3/utils@2.0.0

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

### Patch Changes

- Updated dependencies [2c0b3bf]
  - @omi3/audio@1.0.0
  - @omi3/utils@1.0.0

## 0.0.8

### Patch Changes

- ba17827: optimize storybook configs

## 0.0.7

### Patch Changes

- d26435b: add storybook

## 0.0.6

### Patch Changes

- d7d5c61: Enhance project structure and functionality:

  - Integrate next-intl for internationalization
  - Simplify theme toggler logic and styling
  - Implement default locale redirection
  - Update Next.js, Playwright, and Tailwind configurations
  - Enhance UI components and global styles
  - Add utility files and update exports
  - Implement locale-specific routes
  - Remove obsolete e2e tests and add new ones

## 0.0.5

### Patch Changes

- 9f90909: This changeset includes minor updates and improvements to `@omi3/ui` package and `@omi3/site`:

  - `@omi3/ui`: Minor enhancements and bug fixes to UI components.
  - `@omi3/site`: Small improvements to the site's functionality and user interface.

  These patch updates aim to enhance stability and user experience without introducing major new features or breaking changes.

## 0.0.4

### Patch Changes

- ae33cb4: .

  This changeset includes minor updates and improvements across multiple packages in the Omi3 project:

  - @omi3/audio: Add classNames to the audio visualizer.
  - @omi3/ui: Add DropdownMenu, Skeleton.
  - @omi3/site: Add theme widget to the player.

  These patch updates aim to enhance stability, performance, and user experience without introducing major new features or breaking existing functionality.

## 0.0.3

### Patch Changes

- 66ce409: optmisation
- 65b41df: formating

## 0.0.2

### Patch Changes

- a2895a9: .

## 0.0.1

### Patch Changes

- ecb66e7: .
