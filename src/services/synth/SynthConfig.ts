import {
  DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
  DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
  DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
  DEFAULT_ENVELOPE_SILENCE_GAIN,
  DEFAULT_ENVELOPE_SUSTAIN_GAIN,
  DEFAULT_EQUALIZER_EFFECT_FREQUENCY,
  DEFAULT_EQUALIZER_EFFECT_GAIN,
  DEFAULT_EQUALIZER_EFFECT_Q,
  DEFAULT_EQUALIZER_EFFECT_TYPE,
  DEFAULT_FILTER_EFFECT_FREQUENCY,
  DEFAULT_FILTER_EFFECT_Q,
  DEFAULT_FILTER_EFFECT_TYPE,
  DEFAULT_REVERB_EFFECT_MIX,
  DEFAULT_REVERB_EFFECT_PRESET,
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
  EqualizerEffectConfig,
  EqualizerEffectType,
  FilterEffectConfig,
  FilterEffectType,
  ReverbEarlyReflectionConfig,
  ReverbEffectConfig,
  ReverbEffectPreset,
  ReverbLateTailConfig,
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
import { createReverbEffectConfig } from './ReverbImpulse';
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
const FILTER_EFFECT_TYPES: FilterEffectType[] = [
  'lowpass',
  'highpass',
  'bandpass',
  'notch',
];
const EQUALIZER_EFFECT_TYPES: EqualizerEffectType[] = [
  'lowshelf',
  'highshelf',
  'peaking',
];
const REVERB_EFFECT_PRESETS: ReverbEffectPreset[] = [
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
      reverb: createReverbEffectConfig(
        DEFAULT_REVERB_EFFECT_PRESET,
        DEFAULT_REVERB_EFFECT_MIX,
      ),
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

function normalizeFilterEffectConfig(
  value: unknown,
): FilterEffectConfig | null {
  if (!isRecord(value)) return null;

  return {
    type: unionOrDefault(
      value.type,
      FILTER_EFFECT_TYPES,
      DEFAULT_FILTER_EFFECT_TYPE,
    ),
    frequency: numberOrDefault(
      value.frequency,
      DEFAULT_FILTER_EFFECT_FREQUENCY,
    ),
    q: numberOrDefault(value.q, DEFAULT_FILTER_EFFECT_Q),
  };
}

function normalizeEqualizerEffectConfig(
  value: unknown,
): EqualizerEffectConfig | null {
  if (!isRecord(value)) return null;

  return {
    type: unionOrDefault(
      value.type,
      EQUALIZER_EFFECT_TYPES,
      DEFAULT_EQUALIZER_EFFECT_TYPE,
    ),
    frequency: numberOrDefault(
      value.frequency,
      DEFAULT_EQUALIZER_EFFECT_FREQUENCY,
    ),
    q: numberOrDefault(value.q, DEFAULT_EQUALIZER_EFFECT_Q),
    gain: numberOrDefault(value.gain, DEFAULT_EQUALIZER_EFFECT_GAIN),
  };
}

function normalizeReverbEffectConfig(
  value: unknown,
): ReverbEffectConfig | null {
  if (!isRecord(value)) return null;
  const preset = value.preset === 'room' ? 'garage' : value.preset;
  const normalizedPreset = unionOrDefault(
    preset,
    REVERB_EFFECT_PRESETS,
    DEFAULT_REVERB_EFFECT_PRESET,
  );
  const fallback =
    normalizedPreset === 'custom'
      ? {
          ...createReverbEffectConfig(
            DEFAULT_REVERB_EFFECT_PRESET,
            numberOrDefault(value.mix, DEFAULT_REVERB_EFFECT_MIX),
          ),
          preset: 'custom' as const,
        }
      : createReverbEffectConfig(
          normalizedPreset,
          numberOrDefault(value.mix, DEFAULT_REVERB_EFFECT_MIX),
        );
  const lateTail = normalizeReverbLateTailConfig(
    value.lateTail,
    fallback.lateTail,
  );

  return {
    preset: normalizedPreset,
    mix: numberOrDefault(value.mix, DEFAULT_REVERB_EFFECT_MIX),
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
        .map(normalizeFilterEffectConfig)
        .filter((filter): filter is FilterEffectConfig => Boolean(filter)),
    };
  }

  if (Array.isArray(value.equalizers)) {
    fallback = {
      ...fallback,
      equalizers: value.equalizers
        .map(normalizeEqualizerEffectConfig)
        .filter((equalizer): equalizer is EqualizerEffectConfig =>
          Boolean(equalizer),
        ),
    };
  }

  if (value.reverb !== undefined) {
    fallback = {
      ...fallback,
      reverb: normalizeReverbEffectConfig(value.reverb),
    };
  }

  if (value.filter !== undefined) {
    const legacyFilter = normalizeFilterEffectConfig(value.filter);
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
