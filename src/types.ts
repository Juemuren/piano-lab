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

export type TransferFunctionType =
  | 'delay'
  | 'single_echo'
  | 'multi_echo'
  | 'low_pass'
  | 'high_pass'
  | 'all_pass'
  | 'band_pass';

export interface TransferFunction {
  magnitudes: number[];
  phases: number[];
}

export interface TransferFunctionDefinition {
  type: TransferFunctionType;
  tau: number;
  alpha: number;
  minFrequency: number;
  maxFrequency: number;
  baseFrequency: number;
}

export interface TransferFunctionConfig {
  type: TransferFunctionType;
  tau: number;
  alpha: number;
  minFrequency: number;
  maxFrequency: number;
  baseFrequency: number;
}

export interface EnvelopeConfig {
  attackTime: number;
  decayTime: number;
  releaseTime: number;
  sustainGain: number;
  silenceGain: number;
}

export interface SynthBasicConfig {
  oscillatorType: OscillatorType;
  volumeRatio: number;
  harmonicCount: number;
}

export interface SynthConfig {
  version: 1;
  synth: SynthBasicConfig;
  envelope: EnvelopeConfig;
  spectrum: SpectrumConfig;
  transferFunction: TransferFunctionConfig;
}
