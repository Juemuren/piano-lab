import type { EffectConfig, FilterEffectConfig } from '../../types';

export class EffectChain {
  private audioContext: AudioContext | null = null;
  private destinationNode: AudioNode | null = null;
  private inputNode: GainNode | null = null;
  private outputNode: GainNode | null = null;
  private filterNodes: BiquadFilterNode[] = [];
  private effectConfig: EffectConfig = { filters: [] };

  configure(config: EffectConfig) {
    this.effectConfig = config;
    this.rebuild();
  }

  private applyFilterConfig(
    filterNode: BiquadFilterNode,
    filterConfig: FilterEffectConfig,
  ) {
    filterNode.type = filterConfig.type;
    filterNode.frequency.value = filterConfig.frequency;
    filterNode.Q.value = filterConfig.q;
  }

  private getFilterNode(index: number, filterConfig: FilterEffectConfig) {
    if (!this.audioContext) return null;

    if (!this.filterNodes[index]) {
      this.filterNodes[index] = this.audioContext.createBiquadFilter();
    }

    this.applyFilterConfig(this.filterNodes[index], filterConfig);
    return this.filterNodes[index];
  }

  private rebuild() {
    if (!this.inputNode || !this.outputNode) return;

    this.inputNode.disconnect();
    for (const filterNode of this.filterNodes) {
      filterNode.disconnect();
    }

    if (this.effectConfig.filters.length === 0) {
      this.filterNodes = [];
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
    this.outputNode?.disconnect();
    this.audioContext = null;
    this.destinationNode = null;
    this.inputNode = null;
    this.filterNodes = [];
    this.outputNode = null;
  }
}
