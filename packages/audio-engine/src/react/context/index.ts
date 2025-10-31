"use client";

import React from "react";
import type { IAudioEngine, Music, PlaybackState } from "../../types";

export type AudioTimeState = {
  currentTime: number;
  duration: number;
};

export type AudioPlaybackState = {
  playbackState: PlaybackState;
  currentMusic: Music | null;
  isBuffering: boolean;
  error: { code?: number; message?: string } | null;
  isPlaying: boolean;
  isLoading: boolean;
};

export type AudioVolumeState = {
  volume: number;
  isMuted: boolean;
};

export type AudioActions = {
  load: (music: Music, startTime?: number) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
};

export type AudioStatusState = {
  engine: IAudioEngine | null;
  isEngineInitialized: boolean;
  analyserNode: AnalyserNode | null;
};

export type AudioFrequencyState = {
  frequencyData: Uint8Array | null;
};

const AudioTimeContext = React.createContext<AudioTimeState | null>(null);
const AudioPlaybackContext = React.createContext<AudioPlaybackState | null>(
  null
);
const AudioVolumeContext = React.createContext<AudioVolumeState | null>(null);
const AudioActionsContext = React.createContext<AudioActions | null>(null);
const AudioStatusContext = React.createContext<AudioStatusState | null>(null);
const AudioFrequencyContext = React.createContext<AudioFrequencyState | null>(
  null
);

/** Provides access to the time-related state (currentTime, duration). Optimized for frequent updates. */
export const useAudioTime = () => {
  const context = React.useContext(AudioTimeContext);
  if (!context) {
    throw new Error("useAudioTime must be used within an AudioProvider");
  }
  return context;
};

export const useAudioPlayback = () => {
  const context = React.useContext(AudioPlaybackContext);
  if (!context) {
    throw new Error("useAudioPlayback must be used within an AudioProvider");
  }
  return context;
};

export const useAudioVolume = () => {
  const context = React.useContext(AudioVolumeContext);
  if (!context) {
    throw new Error("useAudioVolume must be used within an AudioProvider");
  }
  return context;
};

export const useAudioActions = () => {
  const context = React.useContext(AudioActionsContext);
  if (!context) {
    throw new Error("useAudioActions must be used within an AudioProvider");
  }
  return context;
};

export const useAudioStatus = () => {
  const context = React.useContext(AudioStatusContext);
  if (!context) {
    throw new Error("useAudioStatus must be used within an AudioProvider");
  }
  return context;
};

/** Provides access to the frequency data state (Uint8Array or null). */
export const useAudioFrequency = () => {
  const context = React.useContext(AudioFrequencyContext);
  if (!context) {
    throw new Error("useAudioFrequency must be used within an AudioProvider");
  }
  return context;
};

/**
 * Hook providing common audio state properties (playback, status, volume).
 * This hook is memoized based on its underlying specific hooks.
 * Prefer this for accessing multiple state values that don't include currentTime.
 */
export const useAudioState = () => {
  const playback = useAudioPlayback();
  const status = useAudioStatus();
  const volume = useAudioVolume();

  return React.useMemo(
    () => ({
      ...playback,
      ...status,
      ...volume,
    }),
    [playback, status, volume]
  );
};

/**
 * Hook providing common audio states and all available actions.
 * This hook is memoized based on useAudioState and useAudioActions.
 * This is the primary recommended hook for most UI components interacting with the audio player.
 */
export const useAudio = () => {
  const state = useAudioState();
  const actions = useAudioActions();

  return React.useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions]
  );
};

// Export contexts for internal use by the Provider
export {
  AudioTimeContext,
  AudioPlaybackContext,
  AudioVolumeContext,
  AudioActionsContext,
  AudioStatusContext,
  AudioFrequencyContext,
};
