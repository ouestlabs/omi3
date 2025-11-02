import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { type QueueItem, type QueueState, queueStore } from "../../core/queue";
import { type BaseMetadata, PlaybackState } from "../../core/types";
import { useActions, useEffects, useVisualization } from "../provider";
import { audioStore } from "../store";
import type {
  AudioEffects,
  AudioPlaybackActions,
  AudioQueueActions,
  AudioVolumeActions,
  UseAudioReturn,
} from "./types";

/**
 * Helper function to calculate next index in queue
 */
function getNextQueueIndex(
  currentIndex: number | null,
  itemsLength: number,
  repeatMode: QueueState["repeatMode"],
  shuffleMode: boolean
): number | null {
  if (itemsLength === 0) {
    return null;
  }
  if (currentIndex === null) {
    return 0;
  }

  const current = currentIndex;
  const total = itemsLength;

  if (repeatMode === "one") {
    return current;
  }

  const isLastItem = current === total - 1;
  if (isLastItem && repeatMode === "all") {
    return shuffleMode ? Math.floor(Math.random() * total) : 0;
  }

  if (current < total - 1) {
    return shuffleMode ? Math.floor(Math.random() * total) : current + 1;
  }

  return repeatMode === "all" ? 0 : null;
}

/**
 * Helper function to calculate previous index in queue
 */
function getPreviousQueueIndex(
  currentIndex: number | null,
  itemsLength: number,
  repeatMode: QueueState["repeatMode"],
  shuffleMode: boolean
): number | null {
  if (itemsLength === 0) {
    return null;
  }
  if (currentIndex === null) {
    return itemsLength - 1;
  }

  const current = currentIndex;
  const total = itemsLength;

  if (repeatMode === "one") {
    return current;
  }

  const isFirstItem = current === 0;
  if (isFirstItem && repeatMode === "all") {
    return shuffleMode ? Math.floor(Math.random() * total) : total - 1;
  }

  if (current > 0) {
    return shuffleMode ? Math.floor(Math.random() * total) : current - 1;
  }

  return repeatMode === "all" ? total - 1 : null;
}

/**
 * Unified hook providing all audio engine functionality in a granular, organized structure.
 * This is the primary hook for interacting with the audio engine.
 *
 * @example
 * ```tsx
 * const audio = useAudio();
 *
 * // Access granular state
 * audio.state.playback.isPlaying
 * audio.state.status.audioContext
 * audio.state.volume.volume
 *
 * // Access granular actions
 * audio.actions.playback.play()
 * audio.actions.volume.setVolume(0.5)
 * audio.queue.actions.next()
 * ```
 */
export function useAudio<
  TData = unknown,
  TMetadata extends BaseMetadata = BaseMetadata,
>(): UseAudioReturn<TData, TMetadata> {
  const playbackState = useStore(audioStore, (state) => state.playbackState);
  const currentTime = useStore(audioStore, (state) => state.currentTime);
  const duration = useStore(audioStore, (state) => state.duration);
  const playbackRate = useStore(audioStore, (state) => state.playbackRate);
  const isBuffering = useStore(audioStore, (state) => state.isBuffering);
  const currentTrack = useStore(audioStore, (state) => state.currentTrack);
  const engine = useStore(audioStore, (state) => state.engineInstance);
  const analyserNode = useStore(audioStore, (state) => state.analyserNode);
  const volume = useStore(audioStore, (state) => state.volume);
  const isMuted = useStore(audioStore, (state) => state.isMuted);
  const error = useStore(audioStore, (state) => state.error);
  const activeItemId = useStore(audioStore, (state) => state.activeItemId);

  // Get queue state from queue store (items + metadata)
  const queueItems = useStore(queueStore, (state) => state.items);
  const queueCurrentIndex = useStore(queueStore, (state) => state.currentIndex);
  const queueHistory = useStore(queueStore, (state) => state.history);
  const queueRepeatMode = useStore(queueStore, (state) => state.repeatMode);
  const queueShuffleMode = useStore(queueStore, (state) => state.shuffleMode);

  // Get actions
  const engineActions = useActions();
  const effectsContext = useEffects();
  const visualizationContext = useVisualization();

  // Compute derived values
  const isPlaying = playbackState === PlaybackState.PLAYING;
  const isLoading = playbackState === PlaybackState.LOADING;
  const isInitialized = engine !== null;
  const audioContext = engine?.audioContext ?? null;
  const audioElement = engine?.audioElement ?? null;
  const sourceNode = engine?.sourceNode ?? null;

  // Get current queue item
  const queueCurrent = useMemo<QueueItem<TData, TMetadata> | null>(() => {
    if (
      queueCurrentIndex === null ||
      queueCurrentIndex < 0 ||
      queueCurrentIndex >= queueItems.length
    ) {
      return null;
    }
    return queueItems[queueCurrentIndex] as QueueItem<TData, TMetadata>;
  }, [queueCurrentIndex, queueItems]);

  // Create queue actions
  const queueActions = useMemo<AudioQueueActions<TData, TMetadata>>(
    () => ({
      setQueue: engineActions.setQueue,
      setActiveItem: engineActions.setActiveItem,
      next: async () => {
        const nextIndex = getNextQueueIndex(
          queueCurrentIndex,
          queueItems.length,
          queueRepeatMode,
          queueShuffleMode
        );
        if (nextIndex !== null && queueItems[nextIndex]) {
          const item = queueItems[nextIndex];
          if (item) {
            await engineActions.setActiveItem(item.id);
          }
        }
      },
      previous: async () => {
        const previousIndex = getPreviousQueueIndex(
          queueCurrentIndex,
          queueItems.length,
          queueRepeatMode,
          queueShuffleMode
        );
        if (previousIndex !== null && queueItems[previousIndex]) {
          const item = queueItems[previousIndex];
          if (item) {
            await engineActions.setActiveItem(item.id);
          }
        }
      },
      skipForward: (seconds: number) => {
        if (engine) {
          const newTime = Math.min(
            engine.currentTime + seconds,
            engine.duration
          );
          engineActions.seek(newTime);
        }
      },
      skipBackward: (seconds: number) => {
        if (engine) {
          const newTime = Math.max(engine.currentTime - seconds, 0);
          engineActions.seek(newTime);
        }
      },
    }),
    [
      engineActions,
      engine,
      queueItems,
      queueCurrentIndex,
      queueRepeatMode,
      queueShuffleMode,
    ]
  );

  // Create volume actions
  const volumeActions = useMemo<AudioVolumeActions>(
    () => ({
      setVolume: engineActions.setVolume,
      toggleMute: () => {
        if (engine) {
          const currentVolume = engine.volume;
          engineActions.setVolume(currentVolume === 0 ? 1 : 0);
        }
      },
    }),
    [engineActions, engine]
  );

  // Create playback actions
  const playbackActions = useMemo<AudioPlaybackActions>(
    () => ({
      play: engineActions.play,
      pause: engineActions.pause,
      seek: engineActions.seek,
      load: engineActions.load,
      setPlaybackRate: engineActions.setPlaybackRate,
    }),
    [engineActions]
  );

  // Create effects structure
  const effects = useMemo<AudioEffects>(
    () => ({
      apply: effectsContext.applyEffects,
      update: effectsContext.updateEffect,
      updateWetDry: effectsContext.updateWetDry,
      processor: effectsContext.processor,
    }),
    [effectsContext]
  );

  const playbackStateGroup = useMemo(
    () => ({
      playbackState,
      isPlaying,
      isLoading,
      isBuffering,
      currentTime,
      duration,
      playbackRate,
      currentTrack,
    }),
    [
      playbackState,
      isPlaying,
      isLoading,
      isBuffering,
      currentTime,
      duration,
      playbackRate,
      currentTrack,
    ]
  );

  const statusStateGroup = useMemo(
    () => ({
      engine,
      isInitialized,
      analyserNode,
      audioContext,
      audioElement,
      sourceNode,
    }),
    [
      engine,
      isInitialized,
      analyserNode,
      audioContext,
      audioElement,
      sourceNode,
    ]
  );

  const volumeStateGroup = useMemo(
    () => ({
      volume,
      isMuted,
    }),
    [volume, isMuted]
  );

  const visualizationStateGroup = useMemo(
    () => ({
      frequencyData: visualizationContext.frequencyData,
      rawFrequencyData: visualizationContext.rawFrequencyData,
      isActive: visualizationContext.isActive,
    }),
    [
      visualizationContext.frequencyData,
      visualizationContext.rawFrequencyData,
      visualizationContext.isActive,
    ]
  );

  const queueStateGroup = useMemo(
    () => ({
      items: queueItems as QueueItem<TData, TMetadata>[],
      current: queueCurrent,
      history: queueHistory as QueueItem<TData, TMetadata>[],
      activeItemId,
      config: {
        repeatMode: queueRepeatMode,
        shuffleMode: queueShuffleMode,
      },
    }),
    [
      queueItems,
      queueCurrent,
      queueHistory,
      activeItemId,
      queueRepeatMode,
      queueShuffleMode,
    ]
  );

  const queueWithActions = useMemo(
    () => ({
      ...queueStateGroup,
      actions: queueActions,
    }),
    [queueStateGroup, queueActions]
  );

  return useMemo<UseAudioReturn<TData, TMetadata>>(
    () => ({
      state: {
        playback: {
          state: playbackStateGroup.playbackState,
          isPlaying: playbackStateGroup.isPlaying,
          isLoading: playbackStateGroup.isLoading,
          isBuffering: playbackStateGroup.isBuffering,
          currentTime: playbackStateGroup.currentTime,
          duration: playbackStateGroup.duration,
          playbackRate: playbackStateGroup.playbackRate,
          currentTrack: playbackStateGroup.currentTrack,
        },
        status: {
          engine: statusStateGroup.engine,
          isInitialized: statusStateGroup.isInitialized,
          analyserNode: statusStateGroup.analyserNode,
          audioContext: statusStateGroup.audioContext,
          audioElement: statusStateGroup.audioElement,
          sourceNode: statusStateGroup.sourceNode,
        },
        volume: {
          volume: volumeStateGroup.volume,
          isMuted: volumeStateGroup.isMuted,
        },
        visualization: {
          frequencyData: visualizationStateGroup.frequencyData,
          rawFrequencyData: visualizationStateGroup.rawFrequencyData,
          isActive: visualizationStateGroup.isActive,
        },
        error: {
          error,
        },
        queue: queueStateGroup,
      },
      actions: {
        playback: playbackActions,
        volume: volumeActions,
        queue: queueActions,
      },
      effects,
      queue: queueWithActions,
    }),
    [
      playbackStateGroup,
      statusStateGroup,
      volumeStateGroup,
      visualizationStateGroup,
      queueStateGroup,
      error,
      playbackActions,
      volumeActions,
      queueActions,
      effects,
      queueWithActions,
    ]
  );
}
