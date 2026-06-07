import {
  DEFAULT_COMPRESSOR_ATTACK,
  DEFAULT_COMPRESSOR_KNEE,
  DEFAULT_COMPRESSOR_RATIO,
  DEFAULT_COMPRESSOR_RELEASE,
  DEFAULT_COMPRESSOR_THRESHOLD,
  DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
  DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
  DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
  DEFAULT_ENVELOPE_SILENCE_GAIN,
  DEFAULT_ENVELOPE_SUSTAIN_GAIN,
  DEFAULT_EQUALIZER_FREQUENCY,
  DEFAULT_EQUALIZER_GAIN,
  DEFAULT_EQUALIZER_Q,
  DEFAULT_EQUALIZER_TYPE,
  DEFAULT_FILTER_FREQUENCY,
  DEFAULT_FILTER_Q,
  DEFAULT_FILTER_TYPE,
  DEFAULT_REVERB_MIX,
  DEFAULT_REVERB_PRESET,
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
  DEFAULT_SPECTRUM_TYPE,
  DEFAULT_SYNTH_HARMONIC_COUNT,
  DEFAULT_SYNTH_OSCILLATOR_TYPE,
  DEFAULT_SYNTH_VOLUME_RATIO,
} from '../../../constants/synth';
import type {
  BuiltInReverbPreset,
  CompressorConfig,
  EffectConfig,
  EnvelopeConfig,
  EqualizerConfig,
  EqualizerType,
  FilterConfig,
  FilterType,
  ReverbConfig,
  SpectrumConfig,
  SynthBasicConfig,
  SynthConfig,
} from '../../../types';
import { createReverbConfig } from '../effect/Reverb';
import { createSpectrum } from '../Spectrum';

export function createDefaultSynthBasicConfig(): SynthBasicConfig {
  return {
    oscillatorType: DEFAULT_SYNTH_OSCILLATOR_TYPE,
    volumeRatio: DEFAULT_SYNTH_VOLUME_RATIO,
    harmonicCount: DEFAULT_SYNTH_HARMONIC_COUNT,
  };
}

export function createDefaultEnvelopeConfig(): EnvelopeConfig {
  return {
    attackTime: DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
    decayTime: DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
    releaseTime: DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
    sustainGain: DEFAULT_ENVELOPE_SUSTAIN_GAIN,
    silenceGain: DEFAULT_ENVELOPE_SILENCE_GAIN,
  };
}

export function createDefaultSpectrumConfig(): SpectrumConfig {
  return {
    type: DEFAULT_SPECTRUM_TYPE,
    lambda: DEFAULT_SPECTRUM_STRIKE_POINT,
    sigma: DEFAULT_SPECTRUM_DECAY_RATE,
    p: DEFAULT_SPECTRUM_POWER_EXPONENT,
    customAmplitudes: createSpectrum(
      {
        type: DEFAULT_SPECTRUM_TYPE,
        lambda: DEFAULT_SPECTRUM_STRIKE_POINT,
        sigma: DEFAULT_SPECTRUM_DECAY_RATE,
        p: DEFAULT_SPECTRUM_POWER_EXPONENT,
      },
      DEFAULT_SYNTH_HARMONIC_COUNT,
    ).amplitudes,
  };
}

export function createDefaultFilterConfig(
  type: FilterType = DEFAULT_FILTER_TYPE,
): FilterConfig {
  return {
    type,
    frequency: DEFAULT_FILTER_FREQUENCY,
    q: DEFAULT_FILTER_Q,
  };
}

export function createDefaultEqualizerConfig(
  type: EqualizerType = DEFAULT_EQUALIZER_TYPE,
): EqualizerConfig {
  return {
    type,
    frequency: DEFAULT_EQUALIZER_FREQUENCY,
    q: DEFAULT_EQUALIZER_Q,
    gain: DEFAULT_EQUALIZER_GAIN,
  };
}

export function createDefaultCompressorConfig(): CompressorConfig {
  return {
    threshold: DEFAULT_COMPRESSOR_THRESHOLD,
    knee: DEFAULT_COMPRESSOR_KNEE,
    ratio: DEFAULT_COMPRESSOR_RATIO,
    attack: DEFAULT_COMPRESSOR_ATTACK,
    release: DEFAULT_COMPRESSOR_RELEASE,
  };
}

export function createDefaultReverbConfig(
  preset: BuiltInReverbPreset = DEFAULT_REVERB_PRESET,
  mix = DEFAULT_REVERB_MIX,
): ReverbConfig {
  return createReverbConfig(preset, mix);
}

export function createDefaultEffectConfig(): EffectConfig {
  return {
    filters: [],
    equalizers: [],
    compressor: null,
    reverb: createDefaultReverbConfig(),
  };
}

export function createDefaultSynthConfig(): SynthConfig {
  return {
    synth: createDefaultSynthBasicConfig(),
    envelope: createDefaultEnvelopeConfig(),
    spectrum: createDefaultSpectrumConfig(),
    effect: createDefaultEffectConfig(),
  };
}
