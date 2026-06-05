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

export type FilterEffectType = 'lowpass' | 'highpass' | 'bandpass' | 'notch';

export interface FilterEffectConfig {
  type: FilterEffectType;
  frequency: number;
  q: number;
}

export type EqualizerEffectType = 'lowshelf' | 'highshelf' | 'peaking';

export interface EqualizerEffectConfig {
  type: EqualizerEffectType;
  frequency: number;
  q: number;
  gain: number;
}

export type ReverbEffectPreset = 'bathroom' | 'garage' | 'hall' | 'cathedral';

export interface ReverbEffectConfig {
  preset: ReverbEffectPreset;
  mix: number;
}

export interface EffectConfig {
  filters: FilterEffectConfig[];
  equalizers: EqualizerEffectConfig[];
  reverb: ReverbEffectConfig | null;
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
