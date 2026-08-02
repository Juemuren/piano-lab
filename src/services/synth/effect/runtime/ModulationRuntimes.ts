import type {
  AmplitudeModulationConfig,
  DelayModulationConfig,
  PhaseModulationConfig,
} from '../Modulation';

abstract class ModulationRuntime<Config> {
  protected oscillatorNode: OscillatorNode;
  protected depthGainNode: GainNode;

  constructor(audioContext: AudioContext) {
    this.oscillatorNode = audioContext.createOscillator();
    this.oscillatorNode.type = 'sine';
    this.oscillatorNode.start();
    this.depthGainNode = audioContext.createGain();
  }

  abstract configure(config: Config): void;
  abstract connect(inputNode: AudioNode): AudioNode;

  disconnect() {
    this.oscillatorNode.disconnect();
    this.depthGainNode.disconnect();
  }

  dispose() {
    this.disconnect();
    this.oscillatorNode.stop();
  }

  protected reconnectModulator(target: AudioParam) {
    this.oscillatorNode.disconnect();
    this.depthGainNode.disconnect();
    this.oscillatorNode.connect(this.depthGainNode);
    this.depthGainNode.connect(target);
  }
}

export class AmplitudeModulationRuntime extends ModulationRuntime<AmplitudeModulationConfig> {
  private gainNode: GainNode;

  constructor(audioContext: AudioContext) {
    super(audioContext);
    this.gainNode = audioContext.createGain();
  }

  configure(config: AmplitudeModulationConfig) {
    const depth = Math.min(Math.max(config.depth, 0), 0.5);
    this.oscillatorNode.frequency.value = Math.max(config.frequency, 0.01);
    this.gainNode.gain.value = 1 - depth;
    this.depthGainNode.gain.value = depth;
    this.reconnectModulator(this.gainNode.gain);
  }

  connect(inputNode: AudioNode) {
    inputNode.connect(this.gainNode);
    return this.gainNode;
  }

  override disconnect() {
    this.gainNode.disconnect();
    super.disconnect();
  }
}

export class PhaseModulationRuntime extends ModulationRuntime<PhaseModulationConfig> {
  private filterNode: BiquadFilterNode;

  constructor(audioContext: AudioContext) {
    super(audioContext);
    this.filterNode = audioContext.createBiquadFilter();
    this.filterNode.type = 'allpass';
  }

  configure(config: PhaseModulationConfig) {
    const depth = Math.min(Math.max(config.depth, 0), Math.PI);
    const depthRatio = depth / Math.PI;
    this.filterNode.frequency.value = 700;
    this.filterNode.Q.value = 1 + depthRatio * 8;
    this.oscillatorNode.frequency.value = Math.max(config.frequency, 0.01);
    this.depthGainNode.gain.value = depthRatio * 600;
    this.reconnectModulator(this.filterNode.frequency);
  }

  connect(inputNode: AudioNode) {
    inputNode.connect(this.filterNode);
    return this.filterNode;
  }

  override disconnect() {
    this.filterNode.disconnect();
    super.disconnect();
  }
}

export class DelayModulationRuntime extends ModulationRuntime<DelayModulationConfig> {
  private delayNode: DelayNode;

  constructor(audioContext: AudioContext) {
    super(audioContext);
    this.delayNode = audioContext.createDelay(0.05);
  }

  configure(config: DelayModulationConfig) {
    const depth = Math.min(Math.max(config.depth, 0), 0.05);
    this.delayNode.delayTime.value = depth / 2;
    this.oscillatorNode.frequency.value = Math.max(config.frequency, 0.01);
    this.depthGainNode.gain.value = depth / 2;
    this.reconnectModulator(this.delayNode.delayTime);
  }

  connect(inputNode: AudioNode) {
    inputNode.connect(this.delayNode);
    return this.delayNode;
  }

  override disconnect() {
    this.delayNode.disconnect();
    super.disconnect();
  }
}
