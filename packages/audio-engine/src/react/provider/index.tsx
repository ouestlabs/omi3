"use client";

import React from "react";
import { AudioEngine } from "../../core";
import {
  type AudioEngineEventMap,
  type IAudioEngine,
  type Music,
  PlaybackState,
} from "../../types";
import {
  AudioActionsContext,
  AudioFrequencyContext,
  AudioPlaybackContext,
  AudioStatusContext,
  AudioTimeContext,
  AudioVolumeContext,
} from "../context";
import { initialState, reducer } from "./state";

const canUseDOM = () =>
  typeof window !== "undefined" && window.document?.createElement !== undefined;

/**
 * Provides the audio engine contexts to its children.
 *
 * Initializes the AudioEngine instance and sets up listeners to update context states.
 * Uses multiple specialized contexts and memoized values to optimize performance
 * and prevent unnecessary re-renders in consuming components.
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const engineRef = React.useRef<IAudioEngine | null>(null);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    let currentEngine: IAudioEngine | null = null;
    const unsubscribeCallbacks: (() => void)[] = [];

    if (engineRef.current === null && canUseDOM()) {
      try {
        const newEngine = new AudioEngine();
        engineRef.current = newEngine;
        currentEngine = newEngine;
        dispatch({ type: "SET_ENGINE_INSTANCE", payload: currentEngine });

        dispatch({
          type: "SET_CURRENT_TIME",
          payload: currentEngine.currentTime,
        });
        dispatch({ type: "SET_DURATION", payload: currentEngine.duration });
        dispatch({
          type: "SET_VOLUME",
          payload: {
            volume: currentEngine.volume,
            muted: currentEngine.isMuted,
          },
        });
        dispatch({
          type: "SET_PLAYBACK_STATE",
          payload: currentEngine.playbackState,
        });
        dispatch({ type: "SET_BUFFERING", payload: currentEngine.isBuffering });
        dispatch({ type: "SET_ERROR", payload: currentEngine.lastError });
        dispatch({
          type: "SET_CURRENT_MUSIC",
          payload: currentEngine.currentMusic,
        });
        dispatch({
          type: "SET_ANALYSER_NODE",
          payload: currentEngine.analyserNode,
        });

        const listeners: {
          [K in keyof AudioEngineEventMap]?: (
            event: AudioEngineEventMap[K]
          ) => void;
        } = {
          timeUpdate: (e) =>
            dispatch({
              type: "SET_CURRENT_TIME",
              payload: e.detail.currentTime,
            }),
          durationChange: (e) =>
            dispatch({ type: "SET_DURATION", payload: e.detail.duration }),
          volumeChange: (e) =>
            dispatch({
              type: "SET_VOLUME",
              payload: { volume: e.detail.volume, muted: e.detail.muted },
            }),
          playbackStateChange: (e) =>
            dispatch({ type: "SET_PLAYBACK_STATE", payload: e.detail.state }),
          bufferingStateChange: (e) =>
            dispatch({ type: "SET_BUFFERING", payload: e.detail.buffering }),
          error: (e) => dispatch({ type: "SET_ERROR", payload: e.detail }),
          trackChange: (e) =>
            dispatch({ type: "SET_CURRENT_MUSIC", payload: e.detail.music }),
          frequencyDataUpdate: (e) =>
            dispatch({ type: "SET_FREQUENCY_DATA", payload: e.detail.data }),
          contextInitialized: (e) =>
            dispatch({
              type: "SET_ANALYSER_NODE",
              payload: e.detail.analyserNode,
            }),
        };

        for (const [eventName, listener] of Object.entries(listeners)) {
          if (listener && currentEngine) {
            const typedEventName = eventName as keyof AudioEngineEventMap;
            currentEngine.addEventListener(
              typedEventName,
              listener as EventListener
            );
            unsubscribeCallbacks.push(() => {
              currentEngine?.removeEventListener(
                typedEventName,
                listener as EventListener
              );
            });
          }
        }
      } catch (err) {
        console.error("Failed to initialize AudioEngine:", err);
        dispatch({ type: "SET_ENGINE_INSTANCE", payload: null });
      }
    }

    return () => {
      for (const callback of unsubscribeCallbacks) {
        callback();
      }
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
      dispatch({ type: "RESET_STATE" });
    };
  }, []);

  const load = React.useCallback((music: Music, startTime?: number) => {
    if (engineRef.current) {
      engineRef.current.load(music, startTime);
    }
  }, []);

  const play = React.useCallback(() => {
    if (engineRef.current) {
      engineRef.current.play();
    }
  }, []);

  const pause = React.useCallback(() => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
  }, []);

  const seek = React.useCallback((time: number) => {
    if (engineRef.current) {
      engineRef.current.seek(time);
    }
  }, []);

  const setEngineVolume = React.useCallback((newVolume: number) => {
    if (engineRef.current) {
      engineRef.current.setVolume(newVolume);
    }
  }, []);

  const isEngineInitialized = state.engineInstance !== null;
  const isLoading = state.playbackState === PlaybackState.LOADING;
  const isPlaying = state.playbackState === PlaybackState.PLAYING;

  const timeContextValue = React.useMemo(
    () => ({
      currentTime: state.currentTime,
      duration: state.duration,
    }),
    [state.currentTime, state.duration]
  );

  const playbackContextValue = React.useMemo(
    () => ({
      playbackState: state.playbackState,
      currentMusic: state.currentMusic,
      isBuffering: state.isBuffering,
      error: state.error,
      isLoading,
      isPlaying,
    }),
    [
      state.playbackState,
      state.currentMusic,
      state.isBuffering,
      state.error,
      isLoading,
      isPlaying,
    ]
  );

  const volumeContextValue = React.useMemo(
    () => ({
      volume: state.volume,
      isMuted: state.isMuted,
    }),
    [state.volume, state.isMuted]
  );

  const frequencyContextValue = React.useMemo(
    () => ({
      frequencyData: state.frequencyData,
    }),
    [state.frequencyData]
  );

  const actionsContextValue = React.useMemo(
    () => ({
      load,
      play,
      pause,
      seek,
      setVolume: setEngineVolume,
    }),
    [load, play, pause, seek, setEngineVolume]
  );

  const statusContextValue = React.useMemo(
    () => ({
      engine: state.engineInstance,
      isEngineInitialized,
      analyserNode: state.analyserNode,
    }),
    [state.engineInstance, isEngineInitialized, state.analyserNode]
  );

  return (
    <AudioActionsContext.Provider value={actionsContextValue}>
      <AudioStatusContext.Provider value={statusContextValue}>
        <AudioVolumeContext.Provider value={volumeContextValue}>
          <AudioPlaybackContext.Provider value={playbackContextValue}>
            <AudioFrequencyContext.Provider value={frequencyContextValue}>
              <AudioTimeContext.Provider value={timeContextValue}>
                {children}
              </AudioTimeContext.Provider>
            </AudioFrequencyContext.Provider>
          </AudioPlaybackContext.Provider>
        </AudioVolumeContext.Provider>
      </AudioStatusContext.Provider>
    </AudioActionsContext.Provider>
  );
}
