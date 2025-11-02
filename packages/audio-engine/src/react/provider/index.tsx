"use client";

import { useStore } from "@tanstack/react-store";
import React from "react";
import { type AudioEffect, AudioEffectsProcessor } from "../../core/effects";
import { AudioEngine, type IAudioEngine } from "../../core/engine";
import { Queue, type QueueItem } from "../../core/queue";
import type {
  AudioEngineEventMap,
  BaseMetadata,
  Track,
} from "../../core/types";
import { PlaybackState } from "../../core/types";
import { logger } from "../../core/utils/logger";
import {
  ActionsContext,
  EffectsContext,
  QueueContext,
  VisualizationContext,
} from "../context";
import type { VisualizationState } from "../context/types";
import { audioStore } from "../store";
import { audioStoreActions } from "../store/actions";
import type { AudioEngineActions } from "../store/types";

const canUseDOM = () =>
  typeof window !== "undefined" && window.document?.createElement !== undefined;

const DEFAULT_WET_DRY_DURATION = 0.5;
const MAX_BYTE_VALUE = 255;
const FADE_OUT_CONSTANT = 0.9;
const FADE_OUT_THRESHOLD = 0.01;

/**
 * Hook to access engine actions.
 */
export const useActions = (): AudioEngineActions => {
  const context = React.useContext(ActionsContext);
  if (!context) {
    throw new Error("useActions must be used within an AudioProvider");
  }
  return context;
};

/**
 * Hook to access audio effects.
 */
export const useEffects = () => {
  const context = React.useContext(EffectsContext);
  if (!context) {
    throw new Error("useEffects must be used within an AudioProvider");
  }
  return context;
};

/**
 * Hook to access audio visualization state.
 */
export const useVisualization = () => {
  const context = React.useContext(VisualizationContext);
  if (!context) {
    throw new Error("useVisualization must be used within an AudioProvider");
  }
  return context;
};

/**
 * Internal function to manage audio visualization logic.
 * Handles frequency data updates and fade-out animations.
 */
function useVisualizationState(): VisualizationState {
  const engine = useStore(audioStore, (state) => state.engineInstance);
  const analyserNode = useStore(audioStore, (state) => state.analyserNode);
  const playbackState = useStore(audioStore, (state) => state.playbackState);

  const [visualizationState, setVisualizationState] =
    React.useState<VisualizationState>({
      frequencyData: [],
      rawFrequencyData: null,
      isActive: false,
    });

  const animationFrameRef = React.useRef<number | null>(null);
  const previousFrequencyDataRef = React.useRef<number[]>([]);

  const engineRef = React.useRef(engine);
  const analyserNodeRef = React.useRef(analyserNode);
  const playbackStateRef = React.useRef(playbackState);

  React.useEffect(() => {
    engineRef.current = engine;
    analyserNodeRef.current = analyserNode;
    playbackStateRef.current = playbackState;
  }, [engine, analyserNode, playbackState]);

  React.useEffect(() => {
    const isActive =
      engine !== null &&
      analyserNode !== null &&
      playbackState === PlaybackState.PLAYING;

    if (!isActive) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setVisualizationState({
        frequencyData: [],
        rawFrequencyData: null,
        isActive: false,
      });
      return;
    }

    const updateFrequencyData = () => {
      const currentEngine = engineRef.current;
      const currentAnalyserNode = analyserNodeRef.current;
      const currentPlaybackState = playbackStateRef.current;

      const hasValidNodes = Boolean(currentAnalyserNode && currentEngine);
      const isPlaying = currentPlaybackState === PlaybackState.PLAYING;

      if (!(hasValidNodes && isPlaying)) {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        setVisualizationState({
          frequencyData: [],
          rawFrequencyData: null,
          isActive: false,
        });
        return;
      }

      const bufferLength = currentAnalyserNode?.frequencyBinCount ?? 0;
      const dataArray = new Uint8Array(bufferLength);
      currentAnalyserNode?.getByteFrequencyData(dataArray);

      const normalized = Array.from(dataArray).map(
        (value) => value / MAX_BYTE_VALUE
      );

      setVisualizationState({
        frequencyData: normalized,
        rawFrequencyData: dataArray,
        isActive: true,
      });
      previousFrequencyDataRef.current = normalized;

      animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    };

    updateFrequencyData();

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [engine, analyserNode, playbackState]);

  React.useEffect(() => {
    const shouldFadeOut =
      playbackState !== PlaybackState.PLAYING &&
      previousFrequencyDataRef.current.length > 0;

    if (!shouldFadeOut) {
      return;
    }

    const fadeOut = () => {
      const faded = previousFrequencyDataRef.current.map(
        (v) => v * FADE_OUT_CONSTANT
      );

      setVisualizationState({
        frequencyData: faded,
        rawFrequencyData: null,
        isActive: false,
      });
      previousFrequencyDataRef.current = faded;

      const hasSignificantValue = faded.some((v) => v > FADE_OUT_THRESHOLD);
      if (hasSignificantValue) {
        animationFrameRef.current = requestAnimationFrame(fadeOut);
      } else {
        setVisualizationState({
          frequencyData: [],
          rawFrequencyData: null,
          isActive: false,
        });
        previousFrequencyDataRef.current = [];
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(fadeOut);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [playbackState]);

  React.useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    },
    []
  );

  return visualizationState;
}

/**
 * Initializes the engine state by updating the store with all initial values.
 */
function initializeEngineState(engine: IAudioEngine): void {
  audioStoreActions.setEngineInstance(engine);
  audioStoreActions.setCurrentTime(engine.currentTime);
  audioStoreActions.setDuration(engine.duration);
  audioStoreActions.setVolume(engine.volume, engine.isMuted);
  audioStoreActions.setPlaybackRate(engine.playbackRate);
  audioStoreActions.setPlaybackState(engine.playbackState);
  audioStoreActions.setBuffering(engine.isBuffering);
  audioStoreActions.setError(engine.lastError);
  audioStoreActions.setCurrentTrack(engine.currentTrack);
  audioStoreActions.setQueue(engine.queue);
  audioStoreActions.setActiveItemId(engine.activeItemId);
  audioStoreActions.setAnalyserNode(engine.analyserNode);
}

/**
 * Sets up event listeners for the audio engine.
 */
function setupEngineListeners(engine: IAudioEngine): (() => void)[] {
  const unsubscribeCallbacks: (() => void)[] = [];

  const listeners: {
    [K in keyof AudioEngineEventMap]?: (event: AudioEngineEventMap[K]) => void;
  } = {
    timeUpdate: (e) => audioStoreActions.setCurrentTime(e.detail.currentTime),
    durationChange: (e) => audioStoreActions.setDuration(e.detail.duration),
    volumeChange: (e) =>
      audioStoreActions.setVolume(e.detail.volume, e.detail.muted),
    playbackRateChange: (e) =>
      audioStoreActions.setPlaybackRate(e.detail.playbackRate),
    playbackStateChange: (e) =>
      audioStoreActions.setPlaybackState(e.detail.state),
    bufferingStateChange: (e) =>
      audioStoreActions.setBuffering(e.detail.buffering),
    error: (e) => audioStoreActions.setError(e.detail),
    trackChange: (e) => audioStoreActions.setCurrentTrack(e.detail.track),
    queueChange: (e) => audioStoreActions.setQueue(e.detail.queue),
    activeItemChange: (e) =>
      audioStoreActions.setActiveItemId(e.detail.activeItemId),
    frequencyDataUpdate: (e) =>
      audioStoreActions.setFrequencyData(e.detail.data),
    contextInitialized: (e) =>
      audioStoreActions.setAnalyserNode(e.detail.analyserNode),
  };

  for (const [eventName, listener] of Object.entries(listeners)) {
    if (listener && engine) {
      const typedEventName = eventName as keyof AudioEngineEventMap;
      engine.addEventListener(typedEventName, listener as EventListener);
      unsubscribeCallbacks.push(() => {
        engine.removeEventListener(typedEventName, listener as EventListener);
      });
    }
  }

  return unsubscribeCallbacks;
}

/**
 * Provides the audio engine contexts to its children.
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const engineRef = React.useRef<IAudioEngine | null>(null);
  const audioElementRef = React.useRef<HTMLAudioElement | null>(null);
  const effectsProcessorRef = React.useRef<AudioEffectsProcessor | null>(null);
  const queueManagerRef = React.useRef<Queue | null>(null);

  const state = useStore(audioStore);

  const visualizationState = useVisualizationState();

  React.useEffect(() => {
    let currentEngine: IAudioEngine | null = null;
    let unsubscribeCallbacks: (() => void)[] = [];

    if (engineRef.current === null && canUseDOM()) {
      try {
        logger.info("Provider", "Initializing AudioEngine");
        const newEngine = new AudioEngine();
        engineRef.current = newEngine;
        currentEngine = newEngine;

        queueManagerRef.current = new Queue({
          engine: newEngine,
        });

        audioElementRef.current = currentEngine.audioElement;
        if (audioElementRef.current && !audioElementRef.current.parentElement) {
          audioElementRef.current.setAttribute("aria-label", "Audio Engine");
          audioElementRef.current.style.display = "none";
          document.body.appendChild(audioElementRef.current);
        }
        initializeEngineState(currentEngine);
        unsubscribeCallbacks = setupEngineListeners(currentEngine);
        logger.info("Provider", "AudioEngine initialized successfully");
      } catch (err) {
        logger.error("Provider", "Failed to initialize AudioEngine", { err });
        audioStoreActions.setEngineInstance(null);
      }
    }

    return () => {
      for (const callback of unsubscribeCallbacks) {
        callback();
      }
      if (effectsProcessorRef.current) {
        effectsProcessorRef.current.dispose();
        effectsProcessorRef.current = null;
      }
      if (audioElementRef.current?.parentElement) {
        audioElementRef.current.parentElement.removeChild(
          audioElementRef.current
        );
      }
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
      queueManagerRef.current = null;
      audioElementRef.current = null;
      audioStoreActions.reset();
    };
  }, []);

  React.useEffect(() => {
    const engine = state.engineInstance;
    if (
      !(
        engine?.audioContext &&
        engine.sourceNode &&
        engine.analyserNode &&
        !effectsProcessorRef.current
      )
    ) {
      return;
    }

    effectsProcessorRef.current = new AudioEffectsProcessor(
      engine.audioContext,
      engine.sourceNode,
      engine.analyserNode
    );

    return () => {
      if (effectsProcessorRef.current) {
        effectsProcessorRef.current.dispose();
        effectsProcessorRef.current = null;
      }
    };
  }, [state.engineInstance]);

  const engineActions = React.useMemo(
    (): AudioEngineActions => ({
      load: (track: Track, startTime?: number) => {
        if (engineRef.current) {
          engineRef.current.load(track, startTime);
        }
      },
      play: <TData = unknown, TMetadata extends BaseMetadata = BaseMetadata>(
        item?: QueueItem<TData, TMetadata> | null
      ) => {
        if (engineRef.current) {
          return engineRef.current.play(item);
        }
        return Promise.resolve();
      },
      pause: () => {
        if (engineRef.current) {
          engineRef.current.pause();
        }
      },
      seek: (time: number) => {
        if (engineRef.current) {
          engineRef.current.seek(time);
        }
      },
      setVolume: (newVolume: number) => {
        if (engineRef.current) {
          engineRef.current.setVolume(newVolume);
        }
      },
      setPlaybackRate: (rate: number) => {
        if (engineRef.current) {
          engineRef.current.setPlaybackRate(rate);
        }
      },
      setQueue: <
        TData = unknown,
        TMetadata extends BaseMetadata = BaseMetadata,
      >(
        queue: QueueItem<TData, TMetadata>[] | null
      ) => {
        if (engineRef.current) {
          engineRef.current.setQueue(queue);
        }
      },
      setActiveItem: (id: string | number | null) => {
        if (engineRef.current) {
          return engineRef.current.setActiveItem(id);
        }
        return Promise.resolve();
      },
      isItemActive: (id: string | number | null) => {
        if (engineRef.current) {
          return engineRef.current.isItemActive(id);
        }
        return false;
      },
    }),
    []
  );

  const applyEffects = React.useCallback((effects: AudioEffect[]) => {
    if (effectsProcessorRef.current) {
      effectsProcessorRef.current.applyEffects(effects);
    }
  }, []);

  const updateEffect = React.useCallback((effect: AudioEffect) => {
    if (effectsProcessorRef.current) {
      effectsProcessorRef.current.updateEffect(effect);
    }
  }, []);

  const updateWetDry = React.useCallback(
    (
      effectId: string,
      wet: number,
      dry: number,
      duration = DEFAULT_WET_DRY_DURATION
    ) => {
      if (effectsProcessorRef.current) {
        effectsProcessorRef.current.updateWetDry(effectId, wet, dry, duration);
      }
    },
    []
  );

  const effectsContextValue = React.useMemo(
    () => ({
      processor: effectsProcessorRef.current,
      applyEffects,
      updateEffect,
      updateWetDry,
    }),
    [applyEffects, updateEffect, updateWetDry]
  );

  const visualizationContextValue = React.useMemo(
    () => visualizationState,
    [visualizationState]
  );

  return (
    <ActionsContext.Provider value={engineActions}>
      <QueueContext.Provider value={queueManagerRef.current}>
        <EffectsContext.Provider value={effectsContextValue}>
          <VisualizationContext.Provider value={visualizationContextValue}>
            {children}
          </VisualizationContext.Provider>
        </EffectsContext.Provider>
      </QueueContext.Provider>
    </ActionsContext.Provider>
  );
}
