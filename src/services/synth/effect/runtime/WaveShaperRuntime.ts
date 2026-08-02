import type { WaveShaperConfig } from '../WaveShaper';
import { createWaveShaperCurve } from '../WaveShaper';

export class WaveShaperRuntime {
  private node: WaveShaperNode;

  constructor(audioContext: AudioContext) {
    this.node = audioContext.createWaveShaper();
    this.node.oversample = '4x';
  }

  configure(config: WaveShaperConfig) {
    this.node.curve = createWaveShaperCurve(config);
  }

  connect(inputNode: AudioNode) {
    inputNode.connect(this.node);
    return this.node;
  }

  disconnect() {
    this.node.disconnect();
  }
}
