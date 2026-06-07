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
  DEFAULT_REVERB_EARLY_REFLECTION_DELAY,
  DEFAULT_REVERB_EARLY_REFLECTION_GAIN,
  DEFAULT_REVERB_LATE_TAIL_ALPHA,
  DEFAULT_REVERB_LATE_TAIL_AMPLITUDE,
  DEFAULT_REVERB_LATE_TAIL_DELAY,
  DEFAULT_REVERB_LATE_TAIL_DURATION,
  DEFAULT_REVERB_MIX,
  DEFAULT_REVERB_PRESET,
} from '../../../constants/synth';
import type {
  CompressorConfig,
  EffectConfig,
  EqualizerConfig,
  FilterConfig,
  ReverbConfig,
  ReverbEarlyReflectionConfig,
  ReverbLateTailConfig,
  SpectrumConfig,
  SynthConfig,
} from '../../../types';
import {
  isRecord,
  numberArrayOrDefault,
  numberOrDefault,
  unionOrDefault,
} from '../../../utils/runtime';
import { createDefaultSynthConfig } from './Defaults';
import {
  EQUALIZER_TYPES,
  FILTER_TYPES,
  OSCILLATOR_TYPES,
  REVERB_PRESETS,
  SPECTRUM_TYPES,
} from './Options';
import { createReverbConfig } from '../Reverb';

function normalizeSpectrumConfig(
  value: unknown,
  fallback: SpectrumConfig,
): SpectrumConfig {
  const record = isRecord(value) ? value : {};

  return {
    type: unionOrDefault(record.type, SPECTRUM_TYPES, fallback.type),
    lambda: numberOrDefault(record.lambda, fallback.lambda),
    sigma: numberOrDefault(record.sigma, fallback.sigma),
    p: numberOrDefault(record.p, fallback.p),
    customAmplitudes: numberArrayOrDefault(
      record.customAmplitudes,
      fallback.customAmplitudes,
    ),
  };
}

function normalizeFilterConfig(value: unknown): FilterConfig | null {
  if (!isRecord(value)) return null;

  return {
    type: unionOrDefault(value.type, FILTER_TYPES, DEFAULT_FILTER_TYPE),
    frequency: numberOrDefault(value.frequency, DEFAULT_FILTER_FREQUENCY),
    q: numberOrDefault(value.q, DEFAULT_FILTER_Q),
  };
}

function normalizeEqualizerConfig(value: unknown): EqualizerConfig | null {
  if (!isRecord(value)) return null;

  return {
    type: unionOrDefault(value.type, EQUALIZER_TYPES, DEFAULT_EQUALIZER_TYPE),
    frequency: numberOrDefault(value.frequency, DEFAULT_EQUALIZER_FREQUENCY),
    q: numberOrDefault(value.q, DEFAULT_EQUALIZER_Q),
    gain: numberOrDefault(value.gain, DEFAULT_EQUALIZER_GAIN),
  };
}

function normalizeCompressorConfig(value: unknown): CompressorConfig | null {
  if (!isRecord(value)) return null;

  return {
    threshold: numberOrDefault(value.threshold, DEFAULT_COMPRESSOR_THRESHOLD),
    knee: numberOrDefault(value.knee, DEFAULT_COMPRESSOR_KNEE),
    ratio: numberOrDefault(value.ratio, DEFAULT_COMPRESSOR_RATIO),
    attack: numberOrDefault(value.attack, DEFAULT_COMPRESSOR_ATTACK),
    release: numberOrDefault(value.release, DEFAULT_COMPRESSOR_RELEASE),
  };
}

function normalizeReverbConfig(value: unknown): ReverbConfig | null {
  if (!isRecord(value)) return null;

  const preset = unionOrDefault(
    value.preset,
    REVERB_PRESETS,
    DEFAULT_REVERB_PRESET,
  );
  const mix = numberOrDefault(value.mix, DEFAULT_REVERB_MIX);
  const fallback =
    preset === 'custom'
      ? {
          ...createReverbConfig(DEFAULT_REVERB_PRESET, mix),
          preset: 'custom' as const,
        }
      : createReverbConfig(preset, mix);

  return {
    preset,
    mix,
    earlyReflections: Array.isArray(value.earlyReflections)
      ? value.earlyReflections
          .map(normalizeReverbEarlyReflectionConfig)
          .filter((reflection): reflection is ReverbEarlyReflectionConfig =>
            Boolean(reflection),
          )
      : fallback.earlyReflections,
    lateTail: normalizeReverbLateTailConfig(value.lateTail, fallback.lateTail),
  };
}

function normalizeReverbEarlyReflectionConfig(
  value: unknown,
): ReverbEarlyReflectionConfig | null {
  if (!isRecord(value)) return null;

  return {
    delay: numberOrDefault(value.delay, DEFAULT_REVERB_EARLY_REFLECTION_DELAY),
    gain: numberOrDefault(value.gain, DEFAULT_REVERB_EARLY_REFLECTION_GAIN),
  };
}

function normalizeReverbLateTailConfig(
  value: unknown,
  fallback: ReverbLateTailConfig,
): ReverbLateTailConfig {
  if (!isRecord(value)) return fallback;

  return {
    delay: numberOrDefault(value.delay, DEFAULT_REVERB_LATE_TAIL_DELAY),
    duration: numberOrDefault(
      value.duration,
      DEFAULT_REVERB_LATE_TAIL_DURATION,
    ),
    amplitude: numberOrDefault(
      value.amplitude,
      DEFAULT_REVERB_LATE_TAIL_AMPLITUDE,
    ),
    alpha: numberOrDefault(value.alpha, DEFAULT_REVERB_LATE_TAIL_ALPHA),
  };
}

function normalizeEffectConfig(
  value: unknown,
  fallback: EffectConfig,
): EffectConfig {
  if (!isRecord(value)) return fallback;

  return {
    filters: Array.isArray(value.filters)
      ? value.filters
          .map(normalizeFilterConfig)
          .filter((filter): filter is FilterConfig => Boolean(filter))
      : fallback.filters,
    equalizers: Array.isArray(value.equalizers)
      ? value.equalizers
          .map(normalizeEqualizerConfig)
          .filter((equalizer): equalizer is EqualizerConfig =>
            Boolean(equalizer),
          )
      : fallback.equalizers,
    compressor:
      value.compressor === undefined
        ? fallback.compressor
        : normalizeCompressorConfig(value.compressor),
    reverb:
      value.reverb === undefined
        ? fallback.reverb
        : normalizeReverbConfig(value.reverb),
  };
}

export function normalizeSynthConfig(value: unknown): SynthConfig | null {
  if (!isRecord(value)) return null;

  const fallback = createDefaultSynthConfig();
  const synth = isRecord(value.synth) ? value.synth : {};
  const envelope = isRecord(value.envelope) ? value.envelope : {};

  return {
    synth: {
      oscillatorType: unionOrDefault(
        synth.oscillatorType,
        OSCILLATOR_TYPES,
        fallback.synth.oscillatorType,
      ),
      volumeRatio: numberOrDefault(
        synth.volumeRatio,
        fallback.synth.volumeRatio,
      ),
      harmonicCount: Math.round(
        numberOrDefault(synth.harmonicCount, fallback.synth.harmonicCount),
      ),
    },
    envelope: {
      attackTime: numberOrDefault(
        envelope.attackTime,
        DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
      ),
      decayTime: numberOrDefault(
        envelope.decayTime,
        DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
      ),
      releaseTime: numberOrDefault(
        envelope.releaseTime,
        DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
      ),
      sustainGain: numberOrDefault(
        envelope.sustainGain,
        DEFAULT_ENVELOPE_SUSTAIN_GAIN,
      ),
      silenceGain: numberOrDefault(
        envelope.silenceGain,
        DEFAULT_ENVELOPE_SILENCE_GAIN,
      ),
    },
    spectrum: normalizeSpectrumConfig(value.spectrum, fallback.spectrum),
    effect: normalizeEffectConfig(value.effect, fallback.effect),
  };
}
