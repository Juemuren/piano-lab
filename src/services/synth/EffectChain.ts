export class EffectChain {
  private audioContext: AudioContext | null = null;
  private destinationNode: AudioNode | null = null;
  private inputNode: GainNode | null = null;
  private outputNode: GainNode | null = null;

  connect(audioContext: AudioContext, destinationNode: AudioNode): AudioNode {
    if (this.audioContext !== audioContext) {
      this.dispose();
      this.audioContext = audioContext;
      this.inputNode = audioContext.createGain();
      this.outputNode = audioContext.createGain();
      this.inputNode.connect(this.outputNode);
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
    this.outputNode?.disconnect();
    this.audioContext = null;
    this.destinationNode = null;
    this.inputNode = null;
    this.outputNode = null;
  }
}
