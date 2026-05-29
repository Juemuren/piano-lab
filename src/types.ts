export type SpectrumType =
  | 'ethereal'
  | 'metallic'
  | 'pure'
  | 'bright'
  | 'normal'
  | 'soft'
  | 'realistic'
  | 'custom';

export interface Spectrum {
  type: SpectrumType;
  amplitudes: number[];
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
  type: TransferFunctionType;
  tau: number;
  alpha: number;
  minFrequency: number;
  maxFrequency: number;
  magnitudes: number[];
  phases: number[];
}
