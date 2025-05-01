---
"@omi3/audio": patch
"@omi3/ui": patch
---

feat(audio): enhance audio engine interfaces and context management

- Expanded the PlaybackState enum to include additional states for better playback control.
- Introduced a comprehensive Music interface with detailed metadata properties for audio tracks.
- Updated the AudioEngine class to implement new event types and methods for improved audio handling.
- Refactored context management in the AudioProvider to utilize multiple specialized contexts for optimized performance.
- Added new hooks for accessing audio state and actions, enhancing the usability of the audio components.

These changes aim to provide a more robust and flexible audio playback experience, facilitating better integration and interaction within the application.
