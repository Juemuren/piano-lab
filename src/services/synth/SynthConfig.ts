import {
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
  DEFAULT_REVERB_EARLY_REFLECTION_DELAY,
  DEFAULT_REVERB_EARLY_REFLECTION_GAIN,
  DEFAULT_REVERB_LATE_TAIL_ALPHA,
  DEFAULT_REVERB_LATE_TAIL_AMPLITUDE,
  DEFAULT_REVERB_LATE_TAIL_DELAY,
  DEFAULT_REVERB_LATE_TAIL_DURATION,
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
  DEFAULT_SPECTRUM_TYPE,
  DEFAULT_SYNTH_HARMONIC_COUNT,
  DEFAULT_SYNTH_OSCILLATOR_TYPE,
  DEFAULT_SYNTH_VOLUME_RATIO,
} from '../../constants/synth';
import type {
  EffectConfig,
  EqualizerConfig,
  EqualizerType,
  FilterConfig,
  FilterType,
  ReverbConfig,
  ReverbEarlyReflectionConfig,
  ReverbLateTailConfig,
  ReverbPreset,
  SpectrumConfig,
  SpectrumType,
  SynthConfig,
} from '../../types';
import {
  isRecord,
  numberArrayOrDefault,
  numberOrDefault,
  unionOrDefault,
} from '../../utils/runtime';
import { createReverbConfig } from './ReverbImpulse';
import { createSpectrum } from './SynthDefinitions';

const OSCILLATOR_TYPES: OscillatorType[] = [
  'sine',
  'triangle',
  'sawtooth',
  'square',
];
const SPECTRUM_TYPES: SpectrumType[] = [
  'ethereal',
  'metallic',
  'pure',
  'bright',
  'normal',
  'soft',
  'realistic',
  'custom',
];
const FILTER_TYPES: FilterType[] = ['lowpass', 'highpass', 'bandpass', 'notch'];
const EQUALIZER_TYPES: EqualizerType[] = ['lowshelf', 'highshelf', 'peaking'];
const REVERB_PRESETS: ReverbPreset[] = [
  'bathroom',
  'garage',
  'hall',
  'cathedral',
  'custom',
];

export function createDefaultSynthConfig(): SynthConfig {
  return {
    synth: {
      oscillatorType: DEFAULT_SYNTH_OSCILLATOR_TYPE,
      volumeRatio: DEFAULT_SYNTH_VOLUME_RATIO,
      harmonicCount: DEFAULT_SYNTH_HARMONIC_COUNT,
    },
    envelope: {
      attackTime: DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
      decayTime: DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
      releaseTime: DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
      sustainGain: DEFAULT_ENVELOPE_SUSTAIN_GAIN,
      silenceGain: DEFAULT_ENVELOPE_SILENCE_GAIN,
    },
    spectrum: {
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
    },
    effect: {
      filters: [],
      equalizers: [],
      reverb: createReverbConfig(DEFAULT_REVERB_PRESET, DEFAULT_REVERB_MIX),
    },
  };
}

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

function normalizeReverbConfig(value: unknown): ReverbConfig | null {
  if (!isRecord(value)) return null;
  const preset = value.preset === 'room' ? 'garage' : value.preset;
  const normalizedPreset = unionOrDefault(
    preset,
    REVERB_PRESETS,
    DEFAULT_REVERB_PRESET,
  );
  const fallback =
    normalizedPreset === 'custom'
      ? {
          ...createReverbConfig(
            DEFAULT_REVERB_PRESET,
            numberOrDefault(value.mix, DEFAULT_REVERB_MIX),
          ),
          preset: 'custom' as const,
        }
      : createReverbConfig(
          normalizedPreset,
          numberOrDefault(value.mix, DEFAULT_REVERB_MIX),
        );
  const lateTail = normalizeReverbLateTailConfig(
    value.lateTail,
    fallback.lateTail,
  );

  return {
    preset: normalizedPreset,
    mix: numberOrDefault(value.mix, DEFAULT_REVERB_MIX),
    earlyReflections: Array.isArray(value.earlyReflections)
      ? value.earlyReflections
          .map(normalizeReverbEarlyReflectionConfig)
          .filter((reflection): reflection is ReverbEarlyReflectionConfig =>
            Boolean(reflection),
          )
      : fallback.earlyReflections,
    lateTail,
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

  if (Array.isArray(value.filters)) {
    fallback = {
      ...fallback,
      filters: value.filters
        .map(normalizeFilterConfig)
        .filter((filter): filter is FilterConfig => Boolean(filter)),
    };
  }

  if (Array.isArray(value.equalizers)) {
    fallback = {
      ...fallback,
      equalizers: value.equalizers
        .map(normalizeEqualizerConfig)
        .filter((equalizer): equalizer is EqualizerConfig =>
          Boolean(equalizer),
        ),
    };
  }

  if (value.reverb !== undefined) {
    fallback = {
      ...fallback,
      reverb: normalizeReverbConfig(value.reverb),
    };
  }

  if (value.filter !== undefined) {
    const legacyFilter = normalizeFilterConfig(value.filter);
    fallback = {
      ...fallback,
      filters: legacyFilter ? [legacyFilter] : [],
    };
  }

  return {
    ...fallback,
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
        fallback.envelope.attackTime,
      ),
      decayTime: numberOrDefault(
        envelope.decayTime,
        fallback.envelope.decayTime,
      ),
      releaseTime: numberOrDefault(
        envelope.releaseTime,
        fallback.envelope.releaseTime,
      ),
      sustainGain: numberOrDefault(
        envelope.sustainGain,
        fallback.envelope.sustainGain,
      ),
      silenceGain: numberOrDefault(
        envelope.silenceGain,
        fallback.envelope.silenceGain,
      ),
    },
    spectrum: normalizeSpectrumConfig(value.spectrum, fallback.spectrum),
    effect: normalizeEffectConfig(value.effect, fallback.effect),
  };
}
