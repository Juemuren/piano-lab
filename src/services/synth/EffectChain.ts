import type { EffectConfig } from './config/EffectConfig';
import { createEffectConfig } from './config/EffectConfig';
import { CompressorRuntime } from './effect/runtime/CompressorRuntime';
import { FilterEqualizerRuntime } from './effect/runtime/FilterEqualizerRuntime';
import {
  AmplitudeModulationRuntime,
  DelayModulationRuntime,
  PhaseModulationRuntime,
} from './effect/runtime/ModulationRuntimes';
import { PannerRuntime } from './effect/runtime/PannerRuntime';
import { ReverbRuntime } from './effect/runtime/ReverbRuntime';
import { WaveShaperRuntime } from './effect/runtime/WaveShaperRuntime';

function hasEffectTopologyChanged(previous: EffectConfig, next: EffectConfig) {
  if (
    Boolean(previous.amplitudeModulation) !==
      Boolean(next.amplitudeModulation) ||
    Boolean(previous.phaseModulation) !== Boolean(next.phaseModulation) ||
    Boolean(previous.delayModulation) !== Boolean(next.delayModulation) ||
    Boolean(previous.waveShaper) !== Boolean(next.waveShaper) ||
    Boolean(previous.compressor) !== Boolean(next.compressor) ||
    Boolean(previous.panner) !== Boolean(next.panner) ||
    Boolean(previous.reverb) !== Boolean(next.reverb)
  ) {
    return true;
  }

  return (
    (previous.filterEqualizer?.filters.length ?? 0) !==
      (next.filterEqualizer?.filters.length ?? 0) ||
    (previous.filterEqualizer?.equalizers.length ?? 0) !==
      (next.filterEqualizer?.equalizers.length ?? 0)
  );
}

function hasAudioEffects(config: EffectConfig) {
  return (
    Boolean(
      config.filterEqualizer &&
        (config.filterEqualizer.filters.length > 0 ||
          config.filterEqualizer.equalizers.length > 0),
    ) ||
    Boolean(config.amplitudeModulation) ||
    Boolean(config.phaseModulation) ||
    Boolean(config.delayModulation) ||
    Boolean(config.waveShaper) ||
    Boolean(config.compressor) ||
    Boolean(config.panner) ||
    Boolean(config.reverb)
  );
}

export class EffectChain {
  private audioContext: AudioContext | null = null;
  private destinationNode: AudioNode | null = null;
  private inputNode: GainNode | null = null;
  private outputNode: GainNode | null = null;
  private filterEqualizer: FilterEqualizerRuntime | null = null;
  private amplitudeModulation: AmplitudeModulationRuntime | null = null;
  private phaseModulation: PhaseModulationRuntime | null = null;
  private delayModulation: DelayModulationRuntime | null = null;
  private waveShaper: WaveShaperRuntime | null = null;
  private compressor: CompressorRuntime | null = null;
  private panner: PannerRuntime | null = null;
  private reverb: ReverbRuntime | null = null;
  private effectConfig = createEffectConfig();

  configure(config: EffectConfig) {
    const previousConfig = this.effectConfig;
    this.effectConfig = config;

    if (hasEffectTopologyChanged(previousConfig, config)) {
      this.rebuild();
      return;
    }

    this.configureRuntimes(previousConfig);
  }

  getCompressorReduction() {
    return this.compressor?.getReduction() ?? 0;
  }

  connect(audioContext: AudioContext, destinationNode: AudioNode): AudioNode {
    if (this.audioContext !== audioContext) {
      this.dispose();
      this.initialize(audioContext);
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
    this.disposeRuntimes();
    this.outputNode?.disconnect();

    this.audioContext = null;
    this.destinationNode = null;
    this.inputNode = null;
    this.outputNode = null;
    this.filterEqualizer = null;
    this.amplitudeModulation = null;
    this.phaseModulation = null;
    this.delayModulation = null;
    this.waveShaper = null;
    this.compressor = null;
    this.panner = null;
    this.reverb = null;
  }

  private initialize(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.inputNode = audioContext.createGain();
    this.outputNode = audioContext.createGain();
  }

  private configureRuntimes(previousConfig?: EffectConfig) {
    if (!this.audioContext) return;

    const config = this.effectConfig;

    if (
      config.filterEqualizer &&
      config.filterEqualizer !== previousConfig?.filterEqualizer
    ) {
      this.filterEqualizer ??= new FilterEqualizerRuntime(this.audioContext);
      this.filterEqualizer.configure(config.filterEqualizer);
    }
    if (
      config.amplitudeModulation &&
      config.amplitudeModulation !== previousConfig?.amplitudeModulation
    ) {
      this.amplitudeModulation ??= new AmplitudeModulationRuntime(
        this.audioContext,
      );
      this.amplitudeModulation.configure(config.amplitudeModulation);
    }
    if (
      config.phaseModulation &&
      config.phaseModulation !== previousConfig?.phaseModulation
    ) {
      this.phaseModulation ??= new PhaseModulationRuntime(this.audioContext);
      this.phaseModulation.configure(config.phaseModulation);
    }
    if (
      config.delayModulation &&
      config.delayModulation !== previousConfig?.delayModulation
    ) {
      this.delayModulation ??= new DelayModulationRuntime(this.audioContext);
      this.delayModulation.configure(config.delayModulation);
    }
    if (config.waveShaper && config.waveShaper !== previousConfig?.waveShaper) {
      this.waveShaper ??= new WaveShaperRuntime(this.audioContext);
      this.waveShaper.configure(config.waveShaper);
    }
    if (config.compressor && config.compressor !== previousConfig?.compressor) {
      this.compressor ??= new CompressorRuntime(this.audioContext);
      this.compressor.configure(config.compressor);
    }
    if (config.panner && config.panner !== previousConfig?.panner) {
      this.panner ??= new PannerRuntime(this.audioContext);
      this.panner.configure(config.panner);
    }
    if (config.reverb && config.reverb !== previousConfig?.reverb) {
      this.reverb ??= new ReverbRuntime(this.audioContext);
      this.reverb.configure(config.reverb);
    }
  }

  private rebuild() {
    if (!this.inputNode || !this.outputNode) return;

    this.inputNode.disconnect();
    this.disconnectRuntimes();

    if (!hasAudioEffects(this.effectConfig)) {
      this.inputNode.connect(this.outputNode);
      return;
    }

    this.configureRuntimes();
    this.connectRuntimes();
  }

  private connectRuntimes() {
    if (!this.inputNode || !this.outputNode) return;

    const config = this.effectConfig;
    let previousNode: AudioNode = this.inputNode;

    if (config.filterEqualizer) {
      previousNode =
        this.filterEqualizer?.connect(previousNode, config.filterEqualizer) ??
        previousNode;
    }
    if (config.amplitudeModulation) {
      previousNode =
        this.amplitudeModulation?.connect(previousNode) ?? previousNode;
    }
    if (config.phaseModulation) {
      previousNode =
        this.phaseModulation?.connect(previousNode) ?? previousNode;
    }
    if (config.delayModulation) {
      previousNode =
        this.delayModulation?.connect(previousNode) ?? previousNode;
    }
    if (config.waveShaper) {
      previousNode = this.waveShaper?.connect(previousNode) ?? previousNode;
    }
    if (config.compressor) {
      previousNode = this.compressor?.connect(previousNode) ?? previousNode;
    }
    if (config.panner) {
      previousNode = this.panner?.connect(previousNode) ?? previousNode;
    }
    if (config.reverb && this.reverb) {
      this.reverb.connect(previousNode, this.outputNode);
      return;
    }

    previousNode.connect(this.outputNode);
  }

  private disconnectRuntimes() {
    this.filterEqualizer?.disconnect();
    this.amplitudeModulation?.disconnect();
    this.phaseModulation?.disconnect();
    this.delayModulation?.disconnect();
    this.waveShaper?.disconnect();
    this.compressor?.disconnect();
    this.panner?.disconnect();
    this.reverb?.disconnect();
  }

  private disposeRuntimes() {
    this.filterEqualizer?.disconnect();
    this.amplitudeModulation?.dispose();
    this.phaseModulation?.dispose();
    this.delayModulation?.dispose();
    this.waveShaper?.disconnect();
    this.compressor?.disconnect();
    this.panner?.disconnect();
    this.reverb?.disconnect();
  }
}
