import type {
  AudioEffect,
  CompressorEffect,
  DelayEffect,
  EffectNodes,
  FilterEffect,
  GainEffect,
  ReverbEffect,
} from "./types";

const DEFAULT_REVERB_ROOM_SIZE = 6;
const DEFAULT_REVERB_DECAY = 1.5;
const DEFAULT_REVERB_WET = 0.85;
const DEFAULT_REVERB_DRY = 0.4;
const DEFAULT_DELAY_TIME = 0.001;
const DEFAULT_DELAY_FEEDBACK = 0.05;
const DEFAULT_DELAY_MAX_DURATION = 2;
const DEFAULT_LOWPASS_FREQUENCY = 1500;
const DEFAULT_LOWPASS_Q = 0.5;
const DEFAULT_HIGHPASS_FREQUENCY = 100;
const DEFAULT_HIGHPASS_Q = 0.7;
const DEFAULT_COMPRESSOR_THRESHOLD = -12;
const DEFAULT_COMPRESSOR_KNEE = 2;
const DEFAULT_COMPRESSOR_RATIO = 8;
const DEFAULT_COMPRESSOR_ATTACK = 0.003;
const DEFAULT_COMPRESSOR_RELEASE = 0.1;
const DEFAULT_GAIN = 1;
const DEFAULT_WET_DRY_DURATION = 0.5;

/**
 * Audio effects processor
 * Manages audio effect nodes and routing
 */
export class AudioEffectsProcessor {
  private readonly audioContext: AudioContext;
  private readonly sourceNode: MediaElementAudioSourceNode;
  private readonly analyserNode: AnalyserNode;
  private readonly effects: Map<string, AudioEffect> = new Map();
  private readonly nodes: Map<string, EffectNodes> = new Map();

  constructor(
    audioContext: AudioContext,
    sourceNode: MediaElementAudioSourceNode,
    analyserNode: AnalyserNode
  ) {
    this.audioContext = audioContext;
    this.sourceNode = sourceNode;
    this.analyserNode = analyserNode;
  }

  /**
   * Apply effects configuration
   */
  applyEffects(effects: AudioEffect[]): void {
    // Store effects
    for (const effect of effects) {
      this.effects.set(effect.id, effect);
    }

    // Remove effects that are no longer in the list
    const currentIds = new Set(effects.map((e) => e.id));
    for (const id of this.effects.keys()) {
      if (!currentIds.has(id)) {
        this.removeEffect(id);
      }
    }

    // Rebuild effect chain
    this.rebuildChain();
  }

  /**
   * Update a specific effect
   */
  updateEffect(effect: AudioEffect): void {
    this.effects.set(effect.id, effect);
    this.applyEffect(effect);
  }

  /**
   * Remove an effect
   */
  removeEffect(id: string): void {
    const nodes = this.nodes.get(id);
    if (nodes) {
      this.disconnectNodes(nodes);
      this.nodes.delete(id);
    }
    this.effects.delete(id);
    this.rebuildChain();
  }

  /**
   * Rebuild the entire effect chain
   */
  private rebuildChain(): void {
    this.disconnectAll();
    this.nodes.clear();

    const enabledEffects = Array.from(this.effects.values()).filter(
      (e) => e.enabled
    );

    if (enabledEffects.length === 0) {
      // Direct connection: source -> analyser -> destination
      try {
        this.sourceNode.disconnect();
        this.analyserNode.disconnect();
      } catch {
        // Already disconnected
      }
      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioContext.destination);
      return;
    }

    // Create nodes for all effects
    for (const effect of enabledEffects) {
      this.createEffectNodes(effect);
    }

    // Connect the chain
    this.connectChain(enabledEffects);
  }

  /**
   * Create audio nodes for an effect
   */
  private createEffectNodes(effect: AudioEffect): void {
    const nodes: EffectNodes = {};

    switch (effect.type) {
      case "reverb": {
        this.createReverbNodes(effect as ReverbEffect, nodes);
        break;
      }
      case "delay": {
        this.createDelayNodes(effect as DelayEffect, nodes);
        break;
      }
      case "filter": {
        this.createFilterNodes(effect as FilterEffect, nodes);
        break;
      }
      case "compressor": {
        this.createCompressorNodes(effect as CompressorEffect, nodes);
        break;
      }
      case "gain": {
        this.createGainNodes(effect as GainEffect, nodes);
        break;
      }
      default: {
        // Unknown effect type
        break;
      }
    }

    if (Object.keys(nodes).length > 0) {
      this.nodes.set(effect.id, nodes);
    }
  }

  private createReverbNodes(effect: ReverbEffect, nodes: EffectNodes): void {
    const convolver = this.audioContext.createConvolver();
    const impulseBuffer = this.createImpulseResponse(
      effect.roomSize ?? DEFAULT_REVERB_ROOM_SIZE,
      effect.decay ?? DEFAULT_REVERB_DECAY
    );
    convolver.buffer = impulseBuffer;
    nodes.convolver = convolver;
    nodes.wetGain = this.audioContext.createGain();
    nodes.wetGain.gain.value = effect.wet ?? DEFAULT_REVERB_WET;
    nodes.dryGain = this.audioContext.createGain();
    nodes.dryGain.gain.value = effect.dry ?? DEFAULT_REVERB_DRY;
  }

  private createDelayNodes(effect: DelayEffect, nodes: EffectNodes): void {
    nodes.delay = this.audioContext.createDelay(DEFAULT_DELAY_MAX_DURATION);
    nodes.delay.delayTime.value = effect.delayTime ?? DEFAULT_DELAY_TIME;
    nodes.feedback = this.audioContext.createGain();
    nodes.feedback.gain.value = effect.feedback ?? DEFAULT_DELAY_FEEDBACK;
    if (effect.wet !== undefined) {
      nodes.wetGain = this.audioContext.createGain();
      nodes.wetGain.gain.value = effect.wet;
    }
    if (effect.dry !== undefined) {
      nodes.dryGain = this.audioContext.createGain();
      nodes.dryGain.gain.value = effect.dry;
    }
  }

  private createFilterNodes(effect: FilterEffect, nodes: EffectNodes): void {
    if (effect.filterType === "lowpass" || !effect.filterType) {
      nodes.lowPassFilter = this.audioContext.createBiquadFilter();
      nodes.lowPassFilter.type = "lowpass";
      nodes.lowPassFilter.frequency.value =
        effect.frequency ?? DEFAULT_LOWPASS_FREQUENCY;
      nodes.lowPassFilter.Q.value = effect.Q ?? DEFAULT_LOWPASS_Q;
    }
    if (
      effect.filterType === "highpass" ||
      (!effect.filterType && effect.frequency)
    ) {
      nodes.highPassFilter = this.audioContext.createBiquadFilter();
      nodes.highPassFilter.type = "highpass";
      nodes.highPassFilter.frequency.value =
        effect.frequency ?? DEFAULT_HIGHPASS_FREQUENCY;
      nodes.highPassFilter.Q.value = effect.Q ?? DEFAULT_HIGHPASS_Q;
    }
    if (effect.wet !== undefined) {
      nodes.wetGain = this.audioContext.createGain();
      nodes.wetGain.gain.value = effect.wet;
    }
    if (effect.dry !== undefined) {
      nodes.dryGain = this.audioContext.createGain();
      nodes.dryGain.gain.value = effect.dry;
    }
  }

  private createCompressorNodes(
    effect: CompressorEffect,
    nodes: EffectNodes
  ): void {
    nodes.compressor = this.audioContext.createDynamicsCompressor();
    nodes.compressor.threshold.value =
      effect.threshold ?? DEFAULT_COMPRESSOR_THRESHOLD;
    nodes.compressor.knee.value = effect.knee ?? DEFAULT_COMPRESSOR_KNEE;
    nodes.compressor.ratio.value = effect.ratio ?? DEFAULT_COMPRESSOR_RATIO;
    nodes.compressor.attack.value = effect.attack ?? DEFAULT_COMPRESSOR_ATTACK;
    nodes.compressor.release.value =
      effect.release ?? DEFAULT_COMPRESSOR_RELEASE;
  }

  private createGainNodes(effect: GainEffect, nodes: EffectNodes): void {
    nodes.gain = this.audioContext.createGain();
    nodes.gain.gain.value = effect.gain ?? DEFAULT_GAIN;
  }

  /**
   * Connect the effect chain
   */
  private connectChain(effects: AudioEffect[]): void {
    this.disconnectExisting();
    const masterGain = this.createMasterGain();
    this.connectDryPath(masterGain, effects);
    this.connectWetPath(masterGain, effects);
    this.connectCompressor(masterGain, effects);
    this.analyserNode.connect(this.audioContext.destination);
  }

  private disconnectExisting(): void {
    try {
      this.sourceNode.disconnect();
      this.analyserNode.disconnect();
    } catch {
      // Already disconnected
    }
  }

  private createMasterGain(): GainNode {
    const masterGain = this.audioContext.createGain();
    masterGain.gain.value = DEFAULT_GAIN;
    return masterGain;
  }

  private connectDryPath(masterGain: GainNode, effects: AudioEffect[]): void {
    const reverbEffect = effects.find((e) => e.type === "reverb") as
      | ReverbEffect
      | undefined;
    const reverbNodes = reverbEffect
      ? this.nodes.get(reverbEffect.id)
      : undefined;
    if (reverbNodes?.dryGain) {
      this.sourceNode.connect(reverbNodes.dryGain);
      reverbNodes.dryGain.connect(masterGain);
    } else {
      this.sourceNode.connect(masterGain);
    }
  }

  private connectWetPath(masterGain: GainNode, effects: AudioEffect[]): void {
    const reverbEffect = this.findEffect<ReverbEffect>(effects, "reverb");
    const delayEffect = this.findEffect<DelayEffect>(effects, "delay");
    const filterEffects = effects.filter(
      (e) => e.type === "filter"
    ) as FilterEffect[];

    if (!(reverbEffect || delayEffect)) {
      return;
    }

    const reverbNodes = reverbEffect
      ? this.nodes.get(reverbEffect.id)
      : undefined;
    let lastNode: AudioNode = this.sourceNode;

    lastNode = this.connectHighPassFilter(lastNode, filterEffects);
    lastNode = this.connectConvolver(lastNode, reverbNodes);
    lastNode = this.connectDelayChain(lastNode, delayEffect);
    lastNode = this.connectLowPassFilterChain(
      lastNode,
      filterEffects,
      delayEffect
    );
    this.connectWetGainToMaster(lastNode, masterGain, reverbNodes, delayEffect);
  }

  private findEffect<T extends AudioEffect>(
    effects: AudioEffect[],
    type: AudioEffect["type"]
  ): T | undefined {
    return effects.find((e) => e.type === type) as T | undefined;
  }

  private connectHighPassFilter(
    lastNode: AudioNode,
    filterEffects: FilterEffect[]
  ): AudioNode {
    const highPassFilterEffect = filterEffects.find(
      (f) => f.filterType === "highpass" || (!f.filterType && f.frequency)
    );
    if (highPassFilterEffect) {
      const filterNodes = this.nodes.get(highPassFilterEffect.id);
      if (filterNodes?.highPassFilter) {
        lastNode.connect(filterNodes.highPassFilter);
        return filterNodes.highPassFilter;
      }
    }
    return lastNode;
  }

  private connectConvolver(
    lastNode: AudioNode,
    reverbNodes: EffectNodes | undefined
  ): AudioNode {
    if (reverbNodes?.convolver) {
      lastNode.connect(reverbNodes.convolver);
      return reverbNodes.convolver;
    }
    return lastNode;
  }

  private connectDelayChain(
    lastNode: AudioNode,
    delayEffect: DelayEffect | undefined
  ): AudioNode {
    if (!delayEffect) {
      return lastNode;
    }
    const delayNodes = this.nodes.get(delayEffect.id);
    if (delayNodes?.delay) {
      lastNode.connect(delayNodes.delay);
      // Delay feedback loop
      if (delayNodes.feedback) {
        delayNodes.delay.connect(delayNodes.feedback);
        delayNodes.feedback.connect(delayNodes.delay);
      }
      return delayNodes.delay;
    }
    return lastNode;
  }

  private connectLowPassFilterChain(
    lastNode: AudioNode,
    filterEffects: FilterEffect[],
    delayEffect: DelayEffect | undefined
  ): AudioNode {
    const lowPassFilterEffect = filterEffects.find(
      (f) => f.filterType === "lowpass"
    );
    if (lowPassFilterEffect || delayEffect) {
      let filterNodes: EffectNodes | undefined;
      if (lowPassFilterEffect) {
        filterNodes = this.nodes.get(lowPassFilterEffect.id);
      } else if (delayEffect) {
        filterNodes = this.nodes.get(delayEffect.id);
      }
      if (filterNodes?.lowPassFilter && delayEffect) {
        const delayNodes = this.nodes.get(delayEffect.id);
        if (delayNodes?.delay) {
          delayNodes.delay.connect(filterNodes.lowPassFilter);
          return filterNodes.lowPassFilter;
        }
      }
    }
    return lastNode;
  }

  private connectWetGainToMaster(
    lastNode: AudioNode,
    masterGain: GainNode,
    reverbNodes: EffectNodes | undefined,
    delayEffect: DelayEffect | undefined
  ): void {
    const delayNodes = delayEffect ? this.nodes.get(delayEffect.id) : undefined;
    const wetGain = reverbNodes?.wetGain || delayNodes?.wetGain;
    if (wetGain) {
      lastNode.connect(wetGain);
      wetGain.connect(masterGain);
    } else {
      lastNode.connect(masterGain);
    }
  }

  private connectCompressor(
    masterGain: GainNode,
    effects: AudioEffect[]
  ): void {
    const compressorEffect = effects.find((e) => e.type === "compressor") as
      | CompressorEffect
      | undefined;
    if (compressorEffect) {
      const compressorNodes = this.nodes.get(compressorEffect.id);
      if (compressorNodes?.compressor) {
        masterGain.connect(compressorNodes.compressor);
        compressorNodes.compressor.connect(this.analyserNode);
      } else {
        masterGain.connect(this.analyserNode);
      }
    } else {
      masterGain.connect(this.analyserNode);
    }
  }

  /**
   * Apply updates to a specific effect
   */
  private applyEffect(effect: AudioEffect): void {
    const nodes = this.nodes.get(effect.id);
    if (!nodes) {
      return;
    }

    switch (effect.type) {
      case "reverb": {
        this.updateReverbEffect(effect as ReverbEffect, nodes);
        break;
      }
      case "delay": {
        this.updateDelayEffect(effect as DelayEffect, nodes);
        break;
      }
      case "filter": {
        this.updateFilterEffect(effect as FilterEffect, nodes);
        break;
      }
      case "compressor": {
        this.updateCompressorEffect(effect as CompressorEffect, nodes);
        break;
      }
      case "gain": {
        this.updateGainEffect(effect as GainEffect, nodes);
        break;
      }
      default: {
        // Unknown effect type
        break;
      }
    }
  }

  private updateReverbEffect(effect: ReverbEffect, nodes: EffectNodes): void {
    if (nodes.wetGain) {
      nodes.wetGain.gain.value = effect.wet ?? DEFAULT_REVERB_WET;
    }
    if (nodes.dryGain) {
      nodes.dryGain.gain.value = effect.dry ?? DEFAULT_REVERB_DRY;
    }
  }

  private updateDelayEffect(effect: DelayEffect, nodes: EffectNodes): void {
    if (nodes.delay) {
      nodes.delay.delayTime.value = effect.delayTime ?? DEFAULT_DELAY_TIME;
    }
    if (nodes.feedback) {
      nodes.feedback.gain.value = effect.feedback ?? DEFAULT_DELAY_FEEDBACK;
    }
  }

  private updateFilterEffect(effect: FilterEffect, nodes: EffectNodes): void {
    if (nodes.lowPassFilter) {
      nodes.lowPassFilter.frequency.value =
        effect.frequency ?? DEFAULT_LOWPASS_FREQUENCY;
      nodes.lowPassFilter.Q.value = effect.Q ?? DEFAULT_LOWPASS_Q;
    }
    if (nodes.highPassFilter) {
      nodes.highPassFilter.frequency.value =
        effect.frequency ?? DEFAULT_HIGHPASS_FREQUENCY;
      nodes.highPassFilter.Q.value = effect.Q ?? DEFAULT_HIGHPASS_Q;
    }
  }

  private updateCompressorEffect(
    effect: CompressorEffect,
    nodes: EffectNodes
  ): void {
    if (nodes.compressor) {
      nodes.compressor.threshold.value =
        effect.threshold ?? DEFAULT_COMPRESSOR_THRESHOLD;
      nodes.compressor.knee.value = effect.knee ?? DEFAULT_COMPRESSOR_KNEE;
      nodes.compressor.ratio.value = effect.ratio ?? DEFAULT_COMPRESSOR_RATIO;
      nodes.compressor.attack.value =
        effect.attack ?? DEFAULT_COMPRESSOR_ATTACK;
      nodes.compressor.release.value =
        effect.release ?? DEFAULT_COMPRESSOR_RELEASE;
    }
  }

  private updateGainEffect(effect: GainEffect, nodes: EffectNodes): void {
    if (nodes.gain) {
      nodes.gain.gain.value = effect.gain ?? DEFAULT_GAIN;
    }
  }

  /**
   * Smoothly update wet/dry gains (for ambience toggle)
   */
  updateWetDry(
    effectId: string,
    wet: number,
    dry: number,
    duration = DEFAULT_WET_DRY_DURATION
  ): void {
    const nodes = this.nodes.get(effectId);
    if (!nodes) {
      return;
    }

    const currentTime = this.audioContext.currentTime;

    if (nodes.wetGain) {
      nodes.wetGain.gain.cancelScheduledValues(currentTime);
      nodes.wetGain.gain.setValueAtTime(nodes.wetGain.gain.value, currentTime);
      nodes.wetGain.gain.linearRampToValueAtTime(wet, currentTime + duration);
    }

    if (nodes.dryGain) {
      nodes.dryGain.gain.cancelScheduledValues(currentTime);
      nodes.dryGain.gain.setValueAtTime(nodes.dryGain.gain.value, currentTime);
      nodes.dryGain.gain.linearRampToValueAtTime(dry, currentTime + duration);
    }
  }

  /**
   * Create impulse response for reverb
   */
  private createImpulseResponse(duration: number, decay: number): AudioBuffer {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = length - i;
        channelData[i] = (Math.random() * 2 - 1) * (n / length) ** decay;
      }
    }

    return impulse;
  }

  /**
   * Disconnect all nodes
   */
  private disconnectAll(): void {
    for (const nodes of this.nodes.values()) {
      this.disconnectNodes(nodes);
    }
  }

  /**
   * Disconnect effect nodes
   */
  private disconnectNodes(nodes: EffectNodes): void {
    try {
      nodes.convolver?.disconnect();
      nodes.delay?.disconnect();
      nodes.feedback?.disconnect();
      nodes.lowPassFilter?.disconnect();
      nodes.highPassFilter?.disconnect();
      nodes.wetGain?.disconnect();
      nodes.dryGain?.disconnect();
      nodes.masterGain?.disconnect();
      nodes.compressor?.disconnect();
      nodes.gain?.disconnect();
    } catch {
      // Already disconnected
    }
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.disconnectAll();
    this.effects.clear();
    this.nodes.clear();
  }
}
