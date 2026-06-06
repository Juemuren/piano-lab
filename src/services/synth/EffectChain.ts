import type {
  EffectConfig,
  EqualizerConfig,
  FilterConfig,
  ReverbConfig,
} from '../../types';
import { createReverbImpulseResponse } from './ReverbImpulse';

export class EffectChain {
  private audioContext: AudioContext | null = null;
  private destinationNode: AudioNode | null = null;
  private inputNode: GainNode | null = null;
  private outputNode: GainNode | null = null;
  private filterNodes: BiquadFilterNode[] = [];
  private equalizerNodes: BiquadFilterNode[] = [];
  private convolverNode: ConvolverNode | null = null;
  private reverbDryGainNode: GainNode | null = null;
  private reverbWetGainNode: GainNode | null = null;
  private effectConfig: EffectConfig = {
    filters: [],
    equalizers: [],
    reverb: null,
  };

  configure(config: EffectConfig) {
    this.effectConfig = config;
    this.rebuild();
  }

  private applyFilterConfig(
    filterNode: BiquadFilterNode,
    filterConfig: FilterConfig,
  ) {
    filterNode.type = filterConfig.type;
    filterNode.frequency.value = filterConfig.frequency;
    filterNode.Q.value = filterConfig.q;
  }

  private getFilterNode(index: number, filterConfig: FilterConfig) {
    if (!this.audioContext) return null;

    if (!this.filterNodes[index]) {
      this.filterNodes[index] = this.audioContext.createBiquadFilter();
    }

    this.applyFilterConfig(this.filterNodes[index], filterConfig);
    return this.filterNodes[index];
  }

  private applyEqualizerConfig(
    equalizerNode: BiquadFilterNode,
    equalizerConfig: EqualizerConfig,
  ) {
    equalizerNode.type = equalizerConfig.type;
    equalizerNode.frequency.value = equalizerConfig.frequency;
    equalizerNode.Q.value = equalizerConfig.q;
    equalizerNode.gain.value = equalizerConfig.gain;
  }

  private getEqualizerNode(index: number, equalizerConfig: EqualizerConfig) {
    if (!this.audioContext) return null;

    if (!this.equalizerNodes[index]) {
      this.equalizerNodes[index] = this.audioContext.createBiquadFilter();
    }

    this.applyEqualizerConfig(this.equalizerNodes[index], equalizerConfig);
    return this.equalizerNodes[index];
  }

  private disconnectReverbNodes() {
    this.convolverNode?.disconnect();
    this.reverbDryGainNode?.disconnect();
    this.reverbWetGainNode?.disconnect();
  }

  private applyReverbConfig(reverbConfig: ReverbConfig) {
    if (!this.audioContext) return null;

    if (!this.convolverNode) {
      this.convolverNode = this.audioContext.createConvolver();
    }
    if (!this.reverbDryGainNode) {
      this.reverbDryGainNode = this.audioContext.createGain();
    }
    if (!this.reverbWetGainNode) {
      this.reverbWetGainNode = this.audioContext.createGain();
    }

    this.convolverNode.buffer = createReverbImpulseResponse(
      this.audioContext,
      reverbConfig,
    );

    const mix = Math.min(Math.max(reverbConfig.mix, 0), 1);
    this.reverbDryGainNode.gain.value = 1 - mix;
    this.reverbWetGainNode.gain.value = mix;

    return {
      convolverNode: this.convolverNode,
      dryGainNode: this.reverbDryGainNode,
      wetGainNode: this.reverbWetGainNode,
    };
  }

  private rebuild() {
    if (!this.inputNode || !this.outputNode) return;

    this.inputNode.disconnect();
    for (const filterNode of this.filterNodes) {
      filterNode.disconnect();
    }
    for (const equalizerNode of this.equalizerNodes) {
      equalizerNode.disconnect();
    }
    this.disconnectReverbNodes();

    if (
      this.effectConfig.filters.length === 0 &&
      this.effectConfig.equalizers.length === 0 &&
      !this.effectConfig.reverb
    ) {
      this.filterNodes = [];
      this.equalizerNodes = [];
      this.inputNode.connect(this.outputNode);
      return;
    }

    let previousNode: AudioNode = this.inputNode;
    for (const [index, filterConfig] of this.effectConfig.filters.entries()) {
      const filterNode = this.getFilterNode(index, filterConfig);
      if (!filterNode) continue;

      previousNode.connect(filterNode);
      previousNode = filterNode;
    }

    this.filterNodes = this.filterNodes.slice(
      0,
      this.effectConfig.filters.length,
    );
    for (const [
      index,
      equalizerConfig,
    ] of this.effectConfig.equalizers.entries()) {
      const equalizerNode = this.getEqualizerNode(index, equalizerConfig);
      if (!equalizerNode) continue;

      previousNode.connect(equalizerNode);
      previousNode = equalizerNode;
    }

    this.equalizerNodes = this.equalizerNodes.slice(
      0,
      this.effectConfig.equalizers.length,
    );

    if (this.effectConfig.reverb) {
      const reverbNodes = this.applyReverbConfig(this.effectConfig.reverb);
      if (reverbNodes) {
        previousNode.connect(reverbNodes.dryGainNode);
        previousNode.connect(reverbNodes.convolverNode);
        reverbNodes.convolverNode.connect(reverbNodes.wetGainNode);
        reverbNodes.dryGainNode.connect(this.outputNode);
        reverbNodes.wetGainNode.connect(this.outputNode);
        return;
      }
    }

    previousNode.connect(this.outputNode);
  }

  connect(audioContext: AudioContext, destinationNode: AudioNode): AudioNode {
    if (this.audioContext !== audioContext) {
      this.dispose();
      this.audioContext = audioContext;
      this.inputNode = audioContext.createGain();
      this.outputNode = audioContext.createGain();
      this.rebuild();
    }

    if (!this.inputNode || !this.outputNode) {
      throw new Error('EffectChain audio nodes were not initialized');
    }

    if (this.destinationNode !== destinationNode) {
      this.outputNode.disconnect();
      this.outputNode.connect(destinationNode);
      this.destinationNode = destinationNode;
    }

    return this.inputNode;
  }

  dispose() {
    this.inputNode?.disconnect();
    for (const filterNode of this.filterNodes) {
      filterNode.disconnect();
    }
    for (const equalizerNode of this.equalizerNodes) {
      equalizerNode.disconnect();
    }
    this.disconnectReverbNodes();
    this.outputNode?.disconnect();
    this.audioContext = null;
    this.destinationNode = null;
    this.inputNode = null;
    this.filterNodes = [];
    this.equalizerNodes = [];
    this.convolverNode = null;
    this.reverbDryGainNode = null;
    this.reverbWetGainNode = null;
    this.outputNode = null;
  }
}
