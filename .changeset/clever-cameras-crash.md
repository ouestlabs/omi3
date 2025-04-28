---
"@omi3/typescript": major
"@omi3/audio": major
"@omi3/utils": major
"@omi3/ui": major
"@omi3/site": major
---

Major overhaul of the `@omi3/audio` package. 

- Renamed `AudioChannel` to `AudioEngine`.
- Replaced constructor-based `EventHandler` with standard `addEventListener`/`removeEventListener` pattern for events.
- Updated the `Music` interface to better support Media Session API metadata (title, artist, album, artwork).
- Introduced new properties like `playbackState`, `isBuffering`, `lastError`, `frequencyData`.
- Removed `initialize()` and `isPlaying()` methods.
- Added explicit Media Session API integration.
- Simplified constructor, `AudioContext` is now initialized internally when needed.
- Added Reusable React components for building audio interfaces (details TBD).


This update introduces significant breaking changes to the API surface.

