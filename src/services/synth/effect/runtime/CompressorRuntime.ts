import type { CompressorConfig } from '../Compressor';

export class CompressorRuntime {
  private node: DynamicsCompressorNode;

  constructor(audioContext: AudioContext) {
    this.node = audioContext.createDynamicsCompressor();
  }

  configure(config: CompressorConfig) {
    this.node.threshold.value = config.threshold;
    this.node.knee.value = config.knee;
    this.node.ratio.value = config.ratio;
    this.node.attack.value = config.attack;
    this.node.release.value = config.release;
  }

  connect(inputNode: AudioNode) {
    inputNode.connect(this.node);
    return this.node;
  }

  getReduction() {
    return this.node.reduction;
  }

  disconnect() {
    this.node.disconnect();
  }
}
