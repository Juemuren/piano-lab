import type { PannerConfig } from '../Panner';

export class PannerRuntime {
  private node: PannerNode;

  constructor(audioContext: AudioContext) {
    this.node = audioContext.createPanner();
  }

  configure(config: PannerConfig) {
    this.node.panningModel = config.panningModel;
    this.node.distanceModel = config.distanceModel;
    this.node.refDistance = Math.max(config.refDistance, 0.01);
    this.node.maxDistance = Math.max(config.maxDistance, 0.01);
    this.node.rolloffFactor = Math.max(config.rolloffFactor, 0);
    this.node.coneInnerAngle = Math.max(config.coneInnerAngle, 0);
    this.node.coneOuterAngle = Math.max(config.coneOuterAngle, 0);
    this.node.coneOuterGain = Math.min(Math.max(config.coneOuterGain, 0), 1);
    this.node.positionX.value = config.positionX;
    this.node.positionY.value = config.positionY;
    this.node.positionZ.value = config.positionZ;
    this.node.orientationX.value = config.orientationX;
    this.node.orientationY.value = config.orientationY;
    this.node.orientationZ.value = config.orientationZ;
  }

  connect(inputNode: AudioNode) {
    inputNode.connect(this.node);
    return this.node;
  }

  disconnect() {
    this.node.disconnect();
  }
}
