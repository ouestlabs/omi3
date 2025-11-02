import type { AudioEffect, AudioEffectsProcessor } from "../../core/effects";
import type { Queue } from "../../core/queue";
import type { AudioEngineActions } from "../store/types";

/**
 * Effects module state interface
 */
export type EffectsState = {
  processor: AudioEffectsProcessor | null;
  applyEffects: (effects: AudioEffect[]) => void;
  updateEffect: (effect: AudioEffect) => void;
  updateWetDry: (
    effectId: string,
    wet: number,
    dry: number,
    duration?: number
  ) => void;
};

/**
 * Visualization module state interface
 */
export type VisualizationState = {
  frequencyData: number[];
  rawFrequencyData: Uint8Array | null;
  isActive: boolean;
};

/**
 * Context value types
 */
export type ActionsContextValue = AudioEngineActions | null;
export type QueueContextValue = Queue | null;
export type EffectsContextValue = EffectsState | null;
export type VisualizationContextValue = VisualizationState | null;
