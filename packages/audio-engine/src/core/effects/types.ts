/**
 * Audio effects system types
 */
export type EffectType = "reverb" | "delay" | "filter" | "compressor" | "gain";

export interface BaseEffect {
  id: string;
  enabled: boolean;
}

export interface ReverbEffect extends BaseEffect {
  type: "reverb";
  /**
   * @description The room size of the reverb effect.
   * @default 6
   */
  roomSize?: number;
  /**
   * @description The decay of the reverb effect.
   * @default 1.5
   */
  decay?: number;
  /**
   * @description The wetness of the reverb effect.
   * @default 0.85
   */
  wet?: number;
  /**
   * @description The dryness of the reverb effect.
   * @default 0.4
   */
  dry?: number;
}

export interface DelayEffect extends BaseEffect {
  type: "delay";
  /**
   * @description The delay time of the delay effect.
   * @default 0.001
   */
  delayTime?: number;
  /**
   * @description The feedback of the delay effect.
   * @default 0.05
   */
  feedback?: number;
  /**
   * @description The wetness of the delay effect.
   * @default 0.85
   */
  wet?: number;
  /**
   * @description The dryness of the delay effect.
   * @default 0.4
   */
  dry?: number;
}

export interface FilterEffect extends BaseEffect {
  type: "filter";
  filterType?: "lowpass" | "highpass" | "bandpass" | "allpass";
  /**
   * @description The frequency of the filter effect.
   * @default 1500
   */
  frequency?: number;
  /**
   * @description The Q of the filter effect.
   * @default 0.5
   */
  Q?: number;
  /**
   * @description The wetness of the filter effect.
   * @default 0.85
   */
  wet?: number;
  /**
   * @description The dryness of the filter effect.
   * @default 0.4
   */
  dry?: number;
}

export interface CompressorEffect extends BaseEffect {
  type: "compressor";
  /**
   * @description The threshold of the compressor effect.
   * @default -12
   */
  threshold?: number;
  /**
   * @description The knee of the compressor effect.
   * @default 2
   */
  knee?: number;
  /**
   * @description The ratio of the compressor effect.
   * @default 8
   */
  ratio?: number;
  /**
   * @description The attack time of the compressor effect.
   * @default 0.003
   */
  attack?: number;
  /**
   * @description The release time of the compressor effect.
   * @default 0.1
   */
  release?: number;
}

export interface GainEffect extends BaseEffect {
  type: "gain";
  /**
   * @description The gain of the gain effect.
   * @default 1
   */
  gain?: number;
}

export type AudioEffect =
  | ReverbEffect
  | DelayEffect
  | FilterEffect
  | CompressorEffect
  | GainEffect;

export interface EffectNodes {
  convolver?: ConvolverNode;
  delay?: DelayNode;
  feedback?: GainNode;
  lowPassFilter?: BiquadFilterNode;
  highPassFilter?: BiquadFilterNode;
  wetGain?: GainNode;
  dryGain?: GainNode;
  masterGain?: GainNode;
  compressor?: DynamicsCompressorNode;
  gain?: GainNode;
}

export interface EffectConfig {
  effects: AudioEffect[];
}
