import type { SpectrumType, TransferFunctionType } from './types';

export const DEFAULT_SYNTH_OSCILLATOR_TYPE: OscillatorType = 'sine';
export const DEFAULT_SYNTH_HARMONIC_COUNT = 10;

export const DEFAULT_SPECTRUM_TYPE: SpectrumType = 'ethereal';
export const DEFAULT_SPECTRUM_STRIKE_POINT = 0.5;
export const DEFAULT_SPECTRUM_DECAY_RATE = 0.8;
export const DEFAULT_SPECTRUM_POWER_EXPONENT = 1.5;

export const DEFAULT_TF_TYPE: TransferFunctionType = 'delay';
export const DEFAULT_TF_DELAY_MS = 0;
export const DEFAULT_TF_ATTENUATION = 0.1;
export const DEFAULT_TF_MIN_FREQUENCY_HZ = 20;
export const DEFAULT_TF_MAX_FREQUENCY_HZ = 20000;
export const DEFAULT_TF_BASE_FREQUENCY_HZ = 440;

export const DEFAULT_ENVELOPE_VOLUME_RATIO = 0.2;
export const DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS = 0.01;
export const DEFAULT_ENVELOPE_DECAY_TIME_SECONDS = 0.4;
export const DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS = 0.3;
export const DEFAULT_ENVELOPE_SUSTAIN_GAIN = 0.4;
export const DEFAULT_ENVELOPE_SILENCE_GAIN = 0.00001;
