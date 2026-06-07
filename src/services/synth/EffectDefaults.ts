import {
  DEFAULT_COMPRESSOR_ATTACK,
  DEFAULT_COMPRESSOR_KNEE,
  DEFAULT_COMPRESSOR_RATIO,
  DEFAULT_COMPRESSOR_RELEASE,
  DEFAULT_COMPRESSOR_THRESHOLD,
  DEFAULT_EQUALIZER_FREQUENCY,
  DEFAULT_EQUALIZER_GAIN,
  DEFAULT_EQUALIZER_Q,
  DEFAULT_EQUALIZER_TYPE,
  DEFAULT_FILTER_FREQUENCY,
  DEFAULT_FILTER_Q,
  DEFAULT_FILTER_TYPE,
  DEFAULT_REVERB_MIX,
  DEFAULT_REVERB_PRESET,
} from '../../constants/synth';
import type {
  BuiltInReverbPreset,
  CompressorConfig,
  EqualizerConfig,
  EqualizerType,
  FilterConfig,
  FilterType,
  ReverbConfig,
} from '../../types';
import { createReverbConfig } from './Reverb';

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
