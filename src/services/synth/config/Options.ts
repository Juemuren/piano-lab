export const OSCILLATOR_TYPES = [
  'sine',
  'triangle',
  'sawtooth',
  'square',
] as const satisfies readonly OscillatorType[];

export const BUILT_IN_SPECTRUM_TYPES = [
  'ethereal',
  'metallic',
  'pure',
  'bright',
  'normal',
  'soft',
  'realistic',
] as const;

export const SPECTRUM_TYPES = [...BUILT_IN_SPECTRUM_TYPES, 'custom'] as const;

export const FILTER_TYPES = [
  'lowpass',
  'highpass',
  'bandpass',
  'notch',
] as const;

export const EQUALIZER_TYPES = ['lowshelf', 'highshelf', 'peaking'] as const;

export const BUILT_IN_FILTER_EQUALIZER_PRESETS = [
  'classical',
  'pop',
  'rock',
  'jazz',
] as const;

export const FILTER_EQUALIZER_PRESETS = [
  ...BUILT_IN_FILTER_EQUALIZER_PRESETS,
  'custom',
] as const;

export const WAVE_SHAPER_PRESETS = [
  'saturation',
  'overdrive',
  'distortion',
  'fuzz',
] as const;

export const PANNER_PANNING_MODELS = [
  'equalpower',
  'HRTF',
] as const satisfies readonly PanningModelType[];

export const PANNER_DISTANCE_MODELS = [
  'linear',
  'inverse',
  'exponential',
] as const satisfies readonly DistanceModelType[];

export const BUILT_IN_REVERB_PRESETS = [
  'bathroom',
  'garage',
  'hall',
  'cathedral',
] as const;

export const REVERB_PRESETS = [...BUILT_IN_REVERB_PRESETS, 'custom'] as const;

export type SynthOscillatorType = (typeof OSCILLATOR_TYPES)[number];

export type BuiltInSpectrumType = (typeof BUILT_IN_SPECTRUM_TYPES)[number];

export type SpectrumType = (typeof SPECTRUM_TYPES)[number];

export type FilterType = (typeof FILTER_TYPES)[number];

export type EqualizerType = (typeof EQUALIZER_TYPES)[number];

export type BuiltInFilterEqualizerPreset =
  (typeof BUILT_IN_FILTER_EQUALIZER_PRESETS)[number];

export type FilterEqualizerPreset = (typeof FILTER_EQUALIZER_PRESETS)[number];

export type WaveShaperPreset = (typeof WAVE_SHAPER_PRESETS)[number];

export type BuiltInReverbPreset = (typeof BUILT_IN_REVERB_PRESETS)[number];

export type ReverbPreset = (typeof REVERB_PRESETS)[number];
