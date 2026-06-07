import type {
  EqualizerType,
  FilterType,
  ReverbPreset,
  SpectrumType,
  WaveShaperPreset,
} from '../../../types';

export const OSCILLATOR_TYPES: OscillatorType[] = [
  'sine',
  'triangle',
  'sawtooth',
  'square',
];

export const SPECTRUM_TYPES: SpectrumType[] = [
  'ethereal',
  'metallic',
  'pure',
  'bright',
  'normal',
  'soft',
  'realistic',
  'custom',
];

export const FILTER_TYPES: FilterType[] = [
  'lowpass',
  'highpass',
  'bandpass',
  'notch',
];

export const EQUALIZER_TYPES: EqualizerType[] = [
  'lowshelf',
  'highshelf',
  'peaking',
];

export const WAVE_SHAPER_PRESETS: WaveShaperPreset[] = [
  'saturation',
  'distortion',
  'overdrive',
  'fuzz',
];

export const PANNER_PANNING_MODELS: PanningModelType[] = ['equalpower', 'HRTF'];

export const PANNER_DISTANCE_MODELS: DistanceModelType[] = [
  'linear',
  'inverse',
  'exponential',
];

export const REVERB_PRESETS: ReverbPreset[] = [
  'bathroom',
  'garage',
  'hall',
  'cathedral',
  'custom',
];
