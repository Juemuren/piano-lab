import type { ReverbConfig } from '../Reverb';
import { createReverbImpulseResponse } from '../Reverb';

export class ReverbRuntime {
  private audioContext: AudioContext;
  private convolverNode: ConvolverNode;
  private dryGainNode: GainNode;
  private wetGainNode: GainNode;
  private config: ReverbConfig | null = null;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.convolverNode = audioContext.createConvolver();
    this.convolverNode.normalize = false;
    this.dryGainNode = audioContext.createGain();
    this.wetGainNode = audioContext.createGain();
  }

  configure(config: ReverbConfig) {
    if (
      !this.config ||
      this.config.earlyReflections !== config.earlyReflections ||
      this.config.lateTail !== config.lateTail
    ) {
      this.convolverNode.buffer = createReverbImpulseResponse(
        this.audioContext,
        config,
      );
    }

    const mix = Math.min(Math.max(config.mix, 0), 1);
    this.dryGainNode.gain.value = 1 - mix;
    this.wetGainNode.gain.value = mix;
    this.config = config;
  }

  connect(inputNode: AudioNode, outputNode: AudioNode) {
    inputNode.connect(this.dryGainNode);
    inputNode.connect(this.convolverNode);
    this.convolverNode.connect(this.wetGainNode);
    this.dryGainNode.connect(outputNode);
    this.wetGainNode.connect(outputNode);
  }

  disconnect() {
    this.convolverNode.disconnect();
    this.dryGainNode.disconnect();
    this.wetGainNode.disconnect();
  }
}
