"use client";

import type { QueueItem } from "../../core/queue";
import type { BaseMetadata, Track } from "../../core/types";
import { initialState } from "../provider/state";
import type { AudioEngineState } from "../provider/types";
import { audioStore } from ".";
import type { AudioStoreActions } from "./types";

/**
 * Actions that update the audio store state directly.
 * These actions update the store without needing the engine instance.
 */
export const audioStoreActions: AudioStoreActions = {
  /**
   * Set the current playback time.
   */
  setCurrentTime: (time: number): void => {
    audioStore.setState((prev) => ({
      ...prev,
      currentTime: time,
    }));
  },

  /**
   * Set the duration of the current track.
   */
  setDuration: (duration: number): void => {
    audioStore.setState((prev) => ({
      ...prev,
      duration,
    }));
  },

  /**
   * Set the volume and mute state.
   */
  setVolume: (volume: number, muted: boolean): void => {
    audioStore.setState((prev) => ({
      ...prev,
      volume,
      isMuted: muted,
    }));
  },

  /**
   * Set the playback rate.
   */
  setPlaybackRate: (rate: number): void => {
    audioStore.setState((prev) => ({
      ...prev,
      playbackRate: rate,
    }));
  },

  /**
   * Set the playback state.
   */
  setPlaybackState: (state: AudioEngineState["playbackState"]): void => {
    audioStore.setState((prev) => ({
      ...prev,
      playbackState: state,
    }));
  },

  /**
   * Set the buffering state.
   */
  setBuffering: (buffering: boolean): void => {
    audioStore.setState((prev) => ({
      ...prev,
      isBuffering: buffering,
    }));
  },

  /**
   * Set the error state.
   */
  setError: (error: { code?: number; message?: string } | null): void => {
    audioStore.setState((prev) => ({
      ...prev,
      error,
    }));
  },

  /**
   * Set the current track.
   */
  setCurrentTrack: (track: Track | null): void => {
    audioStore.setState((prev) => ({
      ...prev,
      currentTrack: track,
    }));
  },

  /**
   * Set the queue.
   */
  setQueue: <TData = unknown, TMetadata extends BaseMetadata = BaseMetadata>(
    queue: QueueItem<TData, TMetadata>[] | null
  ): void => {
    audioStore.setState((prev) => ({
      ...prev,
      queue,
    }));
  },

  /**
   * Set the active item ID.
   */
  setActiveItemId: (id: string | number | null): void => {
    audioStore.setState((prev) => ({
      ...prev,
      activeItemId: id,
    }));
  },

  /**
   * Set the frequency data.
   */
  setFrequencyData: (data: Uint8Array | null): void => {
    audioStore.setState((prev) => ({
      ...prev,
      frequencyData: data,
    }));
  },

  /**
   * Set the analyser node.
   */
  setAnalyserNode: (node: AnalyserNode | null): void => {
    audioStore.setState((prev) => ({
      ...prev,
      analyserNode: node,
    }));
  },

  /**
   * Set the engine instance.
   */
  setEngineInstance: (engine: AudioEngineState["engineInstance"]): void => {
    audioStore.setState((prev) => ({
      ...prev,
      engineInstance: engine,
    }));
  },

  /**
   * Reset the store to initial state.
   */
  reset: (): void => {
    audioStore.setState(() => initialState);
  },
};
