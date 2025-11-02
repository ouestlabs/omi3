"use client";

import { useEffect } from "react";
import type { AudioEffect, AudioEffectsProcessor } from "../../core/effects";
import { useEffects } from "../provider";

export interface UseAudioEffectsOptions {
  effects: AudioEffect[];
  enabled?: boolean;
}

export interface UseAudioEffectsReturn {
  updateEffect: (effect: AudioEffect) => void;
  updateWetDry: (effectId: string, wet: number, dry: number) => void;
  processor: AudioEffectsProcessor | null;
}

/**
 * Hook for applying audio effects.
 *
 * @example
 * ```tsx
 * const { updateEffect } = useAudioEffects({
 *   effects: [{ id: 'reverb', type: 'reverb', enabled: true }],
 * });
 * ```
 */
export function useAudioEffects(
  options: UseAudioEffectsOptions
): UseAudioEffectsReturn {
  const { processor, applyEffects, updateEffect, updateWetDry } = useEffects();

  useEffect(() => {
    if (!(processor && options.enabled !== false)) {
      return;
    }
    applyEffects(options.effects);
  }, [processor, applyEffects, options.effects, options.enabled]);

  return {
    updateEffect,
    updateWetDry,
    processor,
  };
}
