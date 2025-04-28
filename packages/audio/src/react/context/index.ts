"use client";

import React from 'react';
import { type IAudioEngine, type Music, PlaybackState } from '../../interfaces';

export const initialCurrentTime = 0;
export const initialDuration = 0;
export const initialVolume = 1;
export const initialIsMuted = false;
export const initialPlaybackState = PlaybackState.IDLE;
export const initialIsBuffering = false;
export const initialError = null;
export const initialCurrentMusic = null;
export const initialFrequencyData = null;
export const initialAnalyserNode = null;

export type AudioEngineContextType = {
  engine: IAudioEngine | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackState: PlaybackState;
  isBuffering: boolean;
  error: { code?: number; message?: string } | null;
  currentMusic: Music | null;
  frequencyData: Uint8Array | null;
  analyserNode: AnalyserNode | null;
  isEngineInitialized: boolean;
  isLoading: boolean;
  isPlaying: boolean;
  load: (music: Music, startTime?: number) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
};

export const AudioEngineContext = React.createContext<AudioEngineContextType | null>(null);

export const useAudioEngine = () => {
  const context = React.useContext(AudioEngineContext);
  if (!context) {
    throw new Error("useAudioEngine must be used within an AudioProvider");
  }
  return context;
};
