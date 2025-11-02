/**
 * Represents the possible playback states of the audio engine.
 */
export const PlaybackState = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  READY: "ready",
  PLAYING: "playing",
  PAUSED: "paused",
  ERROR: "error",
});

export type PlaybackStateType =
  (typeof PlaybackState)[keyof typeof PlaybackState];
