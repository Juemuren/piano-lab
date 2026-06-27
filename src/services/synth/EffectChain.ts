import type { CompressorConfig } from './effect/Compressor';
import type {
  EqualizerConfig,
  FilterConfig,
  FilterEqualizerConfig,
} from './effect/FilterEqualizer';
import type {
  AmplitudeModulationConfig,
  DelayModulationConfig,
  FrequencyModulationConfig,
  PhaseModulationConfig,
} from './effect/Modulation';
import type { PannerConfig } from './effect/Panner';
import type { ReverbConfig } from './effect/Reverb';
import { createReverbImpulseResponse } from './effect/Reverb';
import type { WaveShaperConfig } from './effect/WaveShaper';
import { createWaveShaperCurve } from './effect/WaveShaper';

export interface EffectConfig {
  amplitudeModulation: AmplitudeModulationConfig | null;
  compressor: CompressorConfig | null;
  delayModulation: DelayModulationConfig | null;
  filterEqualizer: FilterEqualizerConfig | null;
  frequencyModulation: FrequencyModulationConfig | null;
  panner: PannerConfig | null;
  phaseModulation: PhaseModulationConfig | null;
  reverb: ReverbConfig | null;
  waveShaper: WaveShaperConfig | null;
}

export class EffectChain {
  private audioContext: AudioContext | null = null;
  private destinationNode: AudioNode | null = null;
  private inputNode: GainNode | null = null;
  private outputNode: GainNode | null = null;
  private filterNodes: BiquadFilterNode[] = [];
  private equalizerNodes: BiquadFilterNode[] = [];
  private waveShaperNode: WaveShaperNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private amplitudeModulationGainNode: GainNode | null = null;
  private amplitudeModulationOscillatorNode: OscillatorNode | null = null;
  private amplitudeModulationDepthGainNode: GainNode | null = null;
  private phaseModulationNode: BiquadFilterNode | null = null;
  private phaseModulationOscillatorNode: OscillatorNode | null = null;
  private phaseModulationDepthGainNode: GainNode | null = null;
  private delayModulationNode: DelayNode | null = null;
  private delayModulationOscillatorNode: OscillatorNode | null = null;
  private delayModulationDepthGainNode: GainNode | null = null;
  private pannerNode: PannerNode | null = null;
  private convolverNode: ConvolverNode | null = null;
  private reverbDryGainNode: GainNode | null = null;
  private reverbWetGainNode: GainNode | null = null;
  private effectConfig: EffectConfig = {
    amplitudeModulation: null,
    compressor: null,
    delayModulation: null,
    filterEqualizer: null,
    frequencyModulation: null,
    panner: null,
    phaseModulation: null,
    reverb: null,
    waveShaper: null,
  };

  configure(config: EffectConfig) {
    this.effectConfig = config;
    this.rebuild();
  }

  getCompressorReduction() {
    return this.compressorNode?.reduction ?? 0;
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

  private resetReverbNodes() {
    this.disconnectReverbNodes();
    this.convolverNode = null;
    this.reverbDryGainNode = null;
    this.reverbWetGainNode = null;
  }

  private disconnectAmplitudeModulationNodes() {
    this.amplitudeModulationGainNode?.disconnect();
    this.amplitudeModulationOscillatorNode?.disconnect();
    this.amplitudeModulationDepthGainNode?.disconnect();
  }

  private disconnectPhaseModulationNodes() {
    this.phaseModulationNode?.disconnect();
    this.phaseModulationOscillatorNode?.disconnect();
    this.phaseModulationDepthGainNode?.disconnect();
  }

  private disconnectDelayModulationNodes() {
    this.delayModulationNode?.disconnect();
    this.delayModulationOscillatorNode?.disconnect();
    this.delayModulationDepthGainNode?.disconnect();
  }

  private disconnectEffectNodes() {
    this.inputNode?.disconnect();
    for (const filterNode of this.filterNodes) {
      filterNode.disconnect();
    }
    for (const equalizerNode of this.equalizerNodes) {
      equalizerNode.disconnect();
    }
    this.waveShaperNode?.disconnect();
    this.compressorNode?.disconnect();
    this.disconnectAmplitudeModulationNodes();
    this.disconnectPhaseModulationNodes();
    this.disconnectDelayModulationNodes();
    this.pannerNode?.disconnect();
    this.resetReverbNodes();
  }

  private connectBypass() {
    if (!this.inputNode || !this.outputNode) return;

    this.inputNode.connect(this.outputNode);
  }

  private applyAmplitudeModulationConfig(
    amplitudeModulationConfig: AmplitudeModulationConfig,
  ) {
    if (!this.audioContext) return null;

    if (!this.amplitudeModulationGainNode) {
      this.amplitudeModulationGainNode = this.audioContext.createGain();
    }
    if (!this.amplitudeModulationOscillatorNode) {
      this.amplitudeModulationOscillatorNode =
        this.audioContext.createOscillator();
      this.amplitudeModulationOscillatorNode.type = 'sine';
      this.amplitudeModulationOscillatorNode.start();
    }
    if (!this.amplitudeModulationDepthGainNode) {
      this.amplitudeModulationDepthGainNode = this.audioContext.createGain();
    }

    this.amplitudeModulationOscillatorNode.disconnect();
    this.amplitudeModulationDepthGainNode.disconnect();

    const depth = Math.min(Math.max(amplitudeModulationConfig.depth, 0), 0.5);
    this.amplitudeModulationOscillatorNode.frequency.value = Math.max(
      amplitudeModulationConfig.frequency,
      0.01,
    );
    this.amplitudeModulationGainNode.gain.value = 1 - depth;
    this.amplitudeModulationDepthGainNode.gain.value = depth;
    this.amplitudeModulationOscillatorNode.connect(
      this.amplitudeModulationDepthGainNode,
    );
    this.amplitudeModulationDepthGainNode.connect(
      this.amplitudeModulationGainNode.gain,
    );

    return this.amplitudeModulationGainNode;
  }

  private applyPhaseModulationConfig(
    phaseModulationConfig: PhaseModulationConfig,
  ) {
    if (!this.audioContext) return null;

    if (!this.phaseModulationNode) {
      this.phaseModulationNode = this.audioContext.createBiquadFilter();
      this.phaseModulationNode.type = 'allpass';
    }
    if (!this.phaseModulationOscillatorNode) {
      this.phaseModulationOscillatorNode = this.audioContext.createOscillator();
      this.phaseModulationOscillatorNode.type = 'sine';
      this.phaseModulationOscillatorNode.start();
    }
    if (!this.phaseModulationDepthGainNode) {
      this.phaseModulationDepthGainNode = this.audioContext.createGain();
    }

    this.phaseModulationOscillatorNode.disconnect();
    this.phaseModulationDepthGainNode.disconnect();

    const depth = Math.min(Math.max(phaseModulationConfig.depth, 0), Math.PI);
    const depthRatio = depth / Math.PI;
    this.phaseModulationNode.frequency.value = 700;
    this.phaseModulationNode.Q.value = 1 + depthRatio * 8;
    this.phaseModulationOscillatorNode.frequency.value = Math.max(
      phaseModulationConfig.frequency,
      0.01,
    );
    this.phaseModulationDepthGainNode.gain.value = depthRatio * 600;
    this.phaseModulationOscillatorNode.connect(
      this.phaseModulationDepthGainNode,
    );
    this.phaseModulationDepthGainNode.connect(
      this.phaseModulationNode.frequency,
    );

    return this.phaseModulationNode;
  }

  private applyDelayModulationConfig(
    delayModulationConfig: DelayModulationConfig,
  ) {
    if (!this.audioContext) return null;

    if (!this.delayModulationNode) {
      this.delayModulationNode = this.audioContext.createDelay(0.05);
    }
    if (!this.delayModulationOscillatorNode) {
      this.delayModulationOscillatorNode = this.audioContext.createOscillator();
      this.delayModulationOscillatorNode.type = 'sine';
      this.delayModulationOscillatorNode.start();
    }
    if (!this.delayModulationDepthGainNode) {
      this.delayModulationDepthGainNode = this.audioContext.createGain();
    }

    this.delayModulationOscillatorNode.disconnect();
    this.delayModulationDepthGainNode.disconnect();

    const depth = Math.min(Math.max(delayModulationConfig.depth, 0), 0.05);
    this.delayModulationNode.delayTime.value = depth / 2;
    this.delayModulationOscillatorNode.frequency.value = Math.max(
      delayModulationConfig.frequency,
      0.01,
    );
    this.delayModulationDepthGainNode.gain.value = depth / 2;
    this.delayModulationOscillatorNode.connect(
      this.delayModulationDepthGainNode,
    );
    this.delayModulationDepthGainNode.connect(
      this.delayModulationNode.delayTime,
    );

    return this.delayModulationNode;
  }

  private applyWaveShaperConfig(waveShaperConfig: WaveShaperConfig) {
    if (!this.audioContext) return null;

    if (!this.waveShaperNode) {
      this.waveShaperNode = this.audioContext.createWaveShaper();
    }

    this.waveShaperNode.curve = createWaveShaperCurve(waveShaperConfig);
    this.waveShaperNode.oversample = '4x';

    return this.waveShaperNode;
  }

  private applyCompressorConfig(compressorConfig: CompressorConfig) {
    if (!this.audioContext) return null;

    if (!this.compressorNode) {
      this.compressorNode = this.audioContext.createDynamicsCompressor();
    }

    this.compressorNode.threshold.value = compressorConfig.threshold;
    this.compressorNode.knee.value = compressorConfig.knee;
    this.compressorNode.ratio.value = compressorConfig.ratio;
    this.compressorNode.attack.value = compressorConfig.attack;
    this.compressorNode.release.value = compressorConfig.release;

    return this.compressorNode;
  }

  private applyPannerConfig(pannerConfig: PannerConfig) {
    if (!this.audioContext) return null;

    if (!this.pannerNode) {
      this.pannerNode = this.audioContext.createPanner();
    }

    this.pannerNode.panningModel = pannerConfig.panningModel;
    this.pannerNode.distanceModel = pannerConfig.distanceModel;
    this.pannerNode.refDistance = Math.max(pannerConfig.refDistance, 0.01);
    this.pannerNode.maxDistance = Math.max(pannerConfig.maxDistance, 0.01);
    this.pannerNode.rolloffFactor = Math.max(pannerConfig.rolloffFactor, 0);
    this.pannerNode.coneInnerAngle = Math.max(pannerConfig.coneInnerAngle, 0);
    this.pannerNode.coneOuterAngle = Math.max(pannerConfig.coneOuterAngle, 0);
    this.pannerNode.coneOuterGain = Math.min(
      Math.max(pannerConfig.coneOuterGain, 0),
      1,
    );
    this.pannerNode.positionX.value = pannerConfig.positionX;
    this.pannerNode.positionY.value = pannerConfig.positionY;
    this.pannerNode.positionZ.value = pannerConfig.positionZ;
    this.pannerNode.orientationX.value = pannerConfig.orientationX;
    this.pannerNode.orientationY.value = pannerConfig.orientationY;
    this.pannerNode.orientationZ.value = pannerConfig.orientationZ;

    return this.pannerNode;
  }

  private applyReverbConfig(reverbConfig: ReverbConfig) {
    if (!this.audioContext) return null;

    this.resetReverbNodes();
    this.convolverNode = this.audioContext.createConvolver();
    this.reverbDryGainNode = this.audioContext.createGain();
    this.reverbWetGainNode = this.audioContext.createGain();

    this.convolverNode.normalize = false;
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

    this.disconnectEffectNodes();

    if (
      (!this.effectConfig.filterEqualizer ||
        (this.effectConfig.filterEqualizer.filters.length === 0 &&
          this.effectConfig.filterEqualizer.equalizers.length === 0)) &&
      !this.effectConfig.amplitudeModulation &&
      !this.effectConfig.phaseModulation &&
      !this.effectConfig.delayModulation &&
      !this.effectConfig.waveShaper &&
      !this.effectConfig.compressor &&
      !this.effectConfig.panner &&
      !this.effectConfig.reverb
    ) {
      this.filterNodes = [];
      this.equalizerNodes = [];
      this.connectBypass();
      return;
    }

    try {
      this.connectEffectNodes();
    } catch {
      this.disconnectEffectNodes();
      this.connectBypass();
    }
  }

  private connectEffectNodes() {
    if (!this.inputNode || !this.outputNode) return;

    let previousNode: AudioNode = this.inputNode;
    if (this.effectConfig.filterEqualizer) {
      for (const [
        index,
        filterConfig,
      ] of this.effectConfig.filterEqualizer.filters.entries()) {
        const filterNode = this.getFilterNode(index, filterConfig);
        if (!filterNode) continue;

        previousNode.connect(filterNode);
        previousNode = filterNode;
      }

      this.filterNodes = this.filterNodes.slice(
        0,
        this.effectConfig.filterEqualizer.filters.length,
      );
      for (const [
        index,
        equalizerConfig,
      ] of this.effectConfig.filterEqualizer.equalizers.entries()) {
        const equalizerNode = this.getEqualizerNode(index, equalizerConfig);
        if (!equalizerNode) continue;

        previousNode.connect(equalizerNode);
        previousNode = equalizerNode;
      }

      this.equalizerNodes = this.equalizerNodes.slice(
        0,
        this.effectConfig.filterEqualizer.equalizers.length,
      );
    } else {
      this.filterNodes = [];
      this.equalizerNodes = [];
    }

    if (this.effectConfig.amplitudeModulation) {
      const amplitudeModulationNode = this.applyAmplitudeModulationConfig(
        this.effectConfig.amplitudeModulation,
      );
      if (amplitudeModulationNode) {
        previousNode.connect(amplitudeModulationNode);
        previousNode = amplitudeModulationNode;
      }
    }

    if (this.effectConfig.phaseModulation) {
      const phaseModulationNode = this.applyPhaseModulationConfig(
        this.effectConfig.phaseModulation,
      );
      if (phaseModulationNode) {
        previousNode.connect(phaseModulationNode);
        previousNode = phaseModulationNode;
      }
    }

    if (this.effectConfig.delayModulation) {
      const delayModulationNode = this.applyDelayModulationConfig(
        this.effectConfig.delayModulation,
      );
      if (delayModulationNode) {
        previousNode.connect(delayModulationNode);
        previousNode = delayModulationNode;
      }
    }

    if (this.effectConfig.waveShaper) {
      const waveShaperNode = this.applyWaveShaperConfig(
        this.effectConfig.waveShaper,
      );
      if (waveShaperNode) {
        previousNode.connect(waveShaperNode);
        previousNode = waveShaperNode;
      }
    }

    if (this.effectConfig.compressor) {
      const compressorNode = this.applyCompressorConfig(
        this.effectConfig.compressor,
      );
      if (compressorNode) {
        previousNode.connect(compressorNode);
        previousNode = compressorNode;
      }
    }

    if (this.effectConfig.panner) {
      const pannerNode = this.applyPannerConfig(this.effectConfig.panner);
      if (pannerNode) {
        previousNode.connect(pannerNode);
        previousNode = pannerNode;
      }
    }

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
    this.waveShaperNode?.disconnect();
    this.compressorNode?.disconnect();
    this.disconnectAmplitudeModulationNodes();
    this.amplitudeModulationOscillatorNode?.stop();
    this.disconnectPhaseModulationNodes();
    this.phaseModulationOscillatorNode?.stop();
    this.disconnectDelayModulationNodes();
    this.delayModulationOscillatorNode?.stop();
    this.pannerNode?.disconnect();
    this.resetReverbNodes();
    this.outputNode?.disconnect();
    this.audioContext = null;
    this.destinationNode = null;
    this.inputNode = null;
    this.filterNodes = [];
    this.equalizerNodes = [];
    this.waveShaperNode = null;
    this.compressorNode = null;
    this.amplitudeModulationGainNode = null;
    this.amplitudeModulationOscillatorNode = null;
    this.amplitudeModulationDepthGainNode = null;
    this.phaseModulationNode = null;
    this.phaseModulationOscillatorNode = null;
    this.phaseModulationDepthGainNode = null;
    this.delayModulationNode = null;
    this.delayModulationOscillatorNode = null;
    this.delayModulationDepthGainNode = null;
    this.pannerNode = null;
    this.outputNode = null;
  }
}
