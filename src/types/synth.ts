export type BuiltInSpectrumType =
  | 'ethereal'
  | 'metallic'
  | 'pure'
  | 'bright'
  | 'normal'
  | 'soft'
  | 'realistic';

export type SpectrumType = BuiltInSpectrumType | 'custom';

export interface Spectrum {
  amplitudes: number[];
}

export interface SpectrumDefinition {
  lambda: number;
  p: number;
  sigma: number;
  type: BuiltInSpectrumType;
}

export interface SpectrumConfig {
  customAmplitudes: number[];
  lambda: number;
  p: number;
  sigma: number;
  type: SpectrumType;
}

export interface SpectrumParamUpdates {
  lambda?: number;
  p?: number;
  sigma?: number;
}

export interface EnvelopeConfig {
  attackTime: number;
  decayTime: number;
  releaseTime: number;
  silenceGain: number;
  sustainGain: number;
}

export interface EnvelopeCurve {
  gain: number[];
  maxTime: number;
  time: number[];
}

export interface SynthBasicConfig {
  harmonicCount: number;
  oscillatorType: OscillatorType;
  volumeRatio: number;
}

export type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'notch';

export interface FilterConfig {
  frequency: number;
  q: number;
  type: FilterType;
}

export type EqualizerType = 'lowshelf' | 'highshelf' | 'peaking';

export interface EqualizerConfig {
  frequency: number;
  gain: number;
  q: number;
  type: EqualizerType;
}

export interface FilterEqualizerConfig {
  equalizers: EqualizerConfig[];
  filters: FilterConfig[];
}

export interface CompressorConfig {
  attack: number;
  knee: number;
  ratio: number;
  release: number;
  threshold: number;
}

export interface AmplitudeModulationConfig {
  depth: number;
  frequency: number;
}

export interface FrequencyModulationConfig {
  depth: number;
  frequency: number;
}

export interface PhaseModulationConfig {
  depth: number;
  frequency: number;
}

export interface DelayModulationConfig {
  depth: number;
  frequency: number;
}

export type WaveShaperPreset =
  | 'saturation'
  | 'distortion'
  | 'overdrive'
  | 'fuzz';

export interface WaveShaperConfig {
  distortion: number;
  fuzz: number;
  overdrive: number;
  preset: WaveShaperPreset;
  saturation: number;
}

export interface PannerConfig {
  coneInnerAngle: number;
  coneOuterAngle: number;
  coneOuterGain: number;
  distanceModel: DistanceModelType;
  maxDistance: number;
  orientationX: number;
  orientationY: number;
  orientationZ: number;
  panningModel: PanningModelType;
  positionX: number;
  positionY: number;
  positionZ: number;
  refDistance: number;
  rolloffFactor: number;
}

export type BuiltInReverbPreset = 'bathroom' | 'garage' | 'hall' | 'cathedral';

export type ReverbPreset = BuiltInReverbPreset | 'custom';

export interface ReverbEarlyReflectionConfig {
  delay: number;
  gain: number;
  phase: number;
}

export interface ReverbLateTailConfig {
  alpha: number;
  amplitude: number;
  delay: number;
  duration: number;
}

export interface ReverbConfig {
  earlyReflections: ReverbEarlyReflectionConfig[];
  lateTail: ReverbLateTailConfig;
  mix: number;
  preset: ReverbPreset;
}

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

export interface SynthConfig {
  effect: EffectConfig;
  envelope: EnvelopeConfig;
  spectrum: SpectrumConfig;
  synth: SynthBasicConfig;
}

export type StartNoteResult =
  | { started: true; startedAt: number }
  | { started: false };
