import type {
  CompressorConfig,
  EffectConfig,
  EqualizerConfig,
  FilterConfig,
  PannerConfig,
  ReverbConfig,
  TremoloConfig,
  WaveShaperConfig,
} from '../../types';
import { createReverbImpulseResponse } from './effect/Reverb';
import { createWaveShaperCurve } from './effect/WaveShaper';

export class EffectChain {
  private audioContext: AudioContext | null = null;
  private destinationNode: AudioNode | null = null;
  private inputNode: GainNode | null = null;
  private outputNode: GainNode | null = null;
  private filterNodes: BiquadFilterNode[] = [];
  private equalizerNodes: BiquadFilterNode[] = [];
  private waveShaperNode: WaveShaperNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private tremoloGainNode: GainNode | null = null;
  private tremoloOscillatorNode: OscillatorNode | null = null;
  private tremoloDepthGainNode: GainNode | null = null;
  private pannerNode: PannerNode | null = null;
  private convolverNode: ConvolverNode | null = null;
  private reverbDryGainNode: GainNode | null = null;
  private reverbWetGainNode: GainNode | null = null;
  private effectConfig: EffectConfig = {
    filters: [],
    equalizers: [],
    tremolo: null,
    vibrato: null,
    waveShaper: null,
    compressor: null,
    panner: null,
    reverb: null,
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

  private disconnectTremoloNodes() {
    this.tremoloGainNode?.disconnect();
    this.tremoloOscillatorNode?.disconnect();
    this.tremoloDepthGainNode?.disconnect();
  }

  private applyTremoloConfig(tremoloConfig: TremoloConfig) {
    if (!this.audioContext) return null;

    if (!this.tremoloGainNode) {
      this.tremoloGainNode = this.audioContext.createGain();
    }
    if (!this.tremoloOscillatorNode) {
      this.tremoloOscillatorNode = this.audioContext.createOscillator();
      this.tremoloOscillatorNode.type = 'sine';
      this.tremoloOscillatorNode.start();
    }
    if (!this.tremoloDepthGainNode) {
      this.tremoloDepthGainNode = this.audioContext.createGain();
    }

    this.tremoloOscillatorNode.disconnect();
    this.tremoloDepthGainNode.disconnect();

    const depth = Math.min(Math.max(tremoloConfig.depth, 0), 1);
    this.tremoloOscillatorNode.frequency.value = Math.max(
      tremoloConfig.frequency,
      0.01,
    );
    this.tremoloGainNode.gain.value = 1 - depth / 2;
    this.tremoloDepthGainNode.gain.value = depth / 2;
    this.tremoloOscillatorNode.connect(this.tremoloDepthGainNode);
    this.tremoloDepthGainNode.connect(this.tremoloGainNode.gain);

    return this.tremoloGainNode;
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

    if (!this.convolverNode) {
      this.convolverNode = this.audioContext.createConvolver();
    }
    if (!this.reverbDryGainNode) {
      this.reverbDryGainNode = this.audioContext.createGain();
    }
    if (!this.reverbWetGainNode) {
      this.reverbWetGainNode = this.audioContext.createGain();
    }

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

    this.inputNode.disconnect();
    for (const filterNode of this.filterNodes) {
      filterNode.disconnect();
    }
    for (const equalizerNode of this.equalizerNodes) {
      equalizerNode.disconnect();
    }
    this.waveShaperNode?.disconnect();
    this.compressorNode?.disconnect();
    this.disconnectTremoloNodes();
    this.pannerNode?.disconnect();
    this.disconnectReverbNodes();

    if (
      this.effectConfig.filters.length === 0 &&
      this.effectConfig.equalizers.length === 0 &&
      !this.effectConfig.tremolo &&
      !this.effectConfig.waveShaper &&
      !this.effectConfig.compressor &&
      !this.effectConfig.panner &&
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

    if (this.effectConfig.tremolo) {
      const tremoloNode = this.applyTremoloConfig(this.effectConfig.tremolo);
      if (tremoloNode) {
        previousNode.connect(tremoloNode);
        previousNode = tremoloNode;
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
    this.disconnectTremoloNodes();
    this.tremoloOscillatorNode?.stop();
    this.pannerNode?.disconnect();
    this.disconnectReverbNodes();
    this.outputNode?.disconnect();
    this.audioContext = null;
    this.destinationNode = null;
    this.inputNode = null;
    this.filterNodes = [];
    this.equalizerNodes = [];
    this.waveShaperNode = null;
    this.compressorNode = null;
    this.tremoloGainNode = null;
    this.tremoloOscillatorNode = null;
    this.tremoloDepthGainNode = null;
    this.pannerNode = null;
    this.convolverNode = null;
    this.reverbDryGainNode = null;
    this.reverbWetGainNode = null;
    this.outputNode = null;
  }
}
