export type { IAudioEngine } from "../engine/types";
export type { QueueItem, QueueState } from "../queue/types";
export type { BaseMetadata } from "./base";
export { Track } from "./base";
export type { AudioEngineEventMap } from "./events";
export type { PlaybackStateType } from "./playback-state";
export { PlaybackState } from "./playback-state";

declare global {
  var webkitAudioContext: typeof AudioContext;
}
