export type SpectrumType =
  | 'ethereal'
  | 'metallic'
  | 'pure'
  | 'bright'
  | 'normal'
  | 'soft'
  | 'realistic'
  | 'custom';

export type BuiltInSpectrumType = Exclude<SpectrumType, 'custom'>;

export interface Spectrum {
  amplitudes: number[];
}

export interface SpectrumDefinition {
  type: BuiltInSpectrumType;
  lambda: number;
  sigma: number;
  p: number;
}

export interface SpectrumConfig {
  type: SpectrumType;
  lambda: number;
  sigma: number;
  p: number;
  customAmplitudes: number[];
}

export interface SpectrumParamUpdates {
  lambda?: number;
  sigma?: number;
  p?: number;
}

export interface EnvelopeConfig {
  attackTime: number;
  decayTime: number;
  releaseTime: number;
  sustainGain: number;
  silenceGain: number;
}

export interface EnvelopeCurve {
  time: number[];
  gain: number[];
  maxTime: number;
}

export interface SynthBasicConfig {
  oscillatorType: OscillatorType;
  volumeRatio: number;
  harmonicCount: number;
}

export type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'notch';

export interface FilterConfig {
  type: FilterType;
  frequency: number;
  q: number;
}

export type EqualizerType = 'lowshelf' | 'highshelf' | 'peaking';

export interface EqualizerConfig {
  type: EqualizerType;
  frequency: number;
  q: number;
  gain: number;
}

export interface CompressorConfig {
  threshold: number;
  knee: number;
  ratio: number;
  attack: number;
  release: number;
}

export interface PannerConfig {
  panningModel: PanningModelType;
  distanceModel: DistanceModelType;
  positionX: number;
  positionY: number;
  positionZ: number;
  orientationX: number;
  orientationY: number;
  orientationZ: number;
  refDistance: number;
  maxDistance: number;
  rolloffFactor: number;
  coneInnerAngle: number;
  coneOuterAngle: number;
  coneOuterGain: number;
}

export type BuiltInReverbPreset = 'bathroom' | 'garage' | 'hall' | 'cathedral';

export type ReverbPreset = BuiltInReverbPreset | 'custom';

export interface ReverbEarlyReflectionConfig {
  delay: number;
  gain: number;
}

export interface ReverbLateTailConfig {
  delay: number;
  duration: number;
  amplitude: number;
  alpha: number;
}

export interface ReverbConfig {
  preset: ReverbPreset;
  mix: number;
  earlyReflections: ReverbEarlyReflectionConfig[];
  lateTail: ReverbLateTailConfig;
}

export interface EffectConfig {
  filters: FilterConfig[];
  equalizers: EqualizerConfig[];
  compressor: CompressorConfig | null;
  panner: PannerConfig | null;
  reverb: ReverbConfig | null;
}

export interface SynthConfig {
  synth: SynthBasicConfig;
  envelope: EnvelopeConfig;
  spectrum: SpectrumConfig;
  effect: EffectConfig;
}

export type StartNoteResult =
  | { started: true; startedAt: number }
  | { started: false };
