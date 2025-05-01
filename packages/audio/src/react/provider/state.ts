import { type IAudioEngine, type Music, PlaybackState } from '../../interfaces';

// --- Initial State Values ---
const initialCurrentTime = 0;
const initialDuration = 0;
const initialVolume = 1;
const initialIsMuted = false;
const initialPlaybackState = PlaybackState.IDLE;
const initialIsBuffering = false;
const initialError = null;
const initialCurrentMusic = null;
const initialFrequencyData = null;
const initialAnalyserNode = null;

export interface AudioEngineState {
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
  engineInstance: IAudioEngine | null;
}

export const initialState: AudioEngineState = {
  currentTime: initialCurrentTime,
  duration: initialDuration,
  volume: initialVolume,
  isMuted: initialIsMuted,
  playbackState: initialPlaybackState,
  isBuffering: initialIsBuffering,
  error: initialError,
  currentMusic: initialCurrentMusic,
  frequencyData: initialFrequencyData,
  analyserNode: initialAnalyserNode,
  engineInstance: null,
};

type Action =
  | { type: 'SET_ENGINE_INSTANCE'; payload: IAudioEngine | null }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: { volume: number; muted: boolean } }
  | { type: 'SET_PLAYBACK_STATE'; payload: PlaybackState }
  | { type: 'SET_BUFFERING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { code?: number; message?: string } | null }
  | { type: 'SET_CURRENT_MUSIC'; payload: Music | null }
  | { type: 'SET_FREQUENCY_DATA'; payload: Uint8Array | null }
  | { type: 'SET_ANALYSER_NODE'; payload: AnalyserNode | null }
  | { type: 'RESET_STATE' };

/**
 * Reducer function to manage the state of the AudioProvider based on dispatched actions.
 * Takes the current state and an action, and returns the new state.
 */
export function reducer(state: AudioEngineState, action: Action): AudioEngineState {
  switch (action.type) {
    case 'SET_ENGINE_INSTANCE':
      return { ...state, engineInstance: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload.volume, isMuted: action.payload.muted };
    case 'SET_PLAYBACK_STATE':
      return { ...state, playbackState: action.payload };
    case 'SET_BUFFERING':
      return { ...state, isBuffering: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_MUSIC':
      return { ...state, currentMusic: action.payload };
    case 'SET_FREQUENCY_DATA':
      return { ...state, frequencyData: action.payload };
    case 'SET_ANALYSER_NODE':
      return { ...state, analyserNode: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}
