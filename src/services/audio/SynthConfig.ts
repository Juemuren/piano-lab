import {
  DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
  DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
  DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
  DEFAULT_ENVELOPE_SILENCE_GAIN,
  DEFAULT_ENVELOPE_SUSTAIN_GAIN,
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
  DEFAULT_SPECTRUM_TYPE,
  DEFAULT_SYNTH_HARMONIC_COUNT,
  DEFAULT_SYNTH_OSCILLATOR_TYPE,
  DEFAULT_SYNTH_VOLUME_RATIO,
  DEFAULT_TRANSFER_FUNCTION_ATTENUATION,
  DEFAULT_TRANSFER_FUNCTION_BASE_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_DELAY_MS,
  DEFAULT_TRANSFER_FUNCTION_MAX_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_MIN_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_TYPE,
} from '../../constants';
import type {
  SpectrumConfig,
  SpectrumType,
  SynthConfig,
  TransferFunctionConfig,
  TransferFunctionType,
} from '../../types';
import {
  isRecord,
  numberArrayOrDefault,
  numberOrDefault,
  unionOrDefault,
} from '../../utils/runtime';
import { getSpectrumPreset } from './AudioPresets';

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
const TRANSFER_FUNCTION_TYPES: TransferFunctionType[] = [
  'delay',
  'single_echo',
  'multi_echo',
  'all_pass',
  'low_pass',
  'high_pass',
  'band_pass',
];

export function createDefaultSynthConfig(): SynthConfig {
  return {
    version: 1,
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
      customAmplitudes: getSpectrumPreset(
        DEFAULT_SPECTRUM_TYPE,
        DEFAULT_SPECTRUM_STRIKE_POINT,
        DEFAULT_SPECTRUM_DECAY_RATE,
        DEFAULT_SPECTRUM_POWER_EXPONENT,
        DEFAULT_SYNTH_HARMONIC_COUNT,
      ).amplitudes,
    },
    transferFunction: {
      type: DEFAULT_TRANSFER_FUNCTION_TYPE,
      tau: DEFAULT_TRANSFER_FUNCTION_DELAY_MS,
      alpha: DEFAULT_TRANSFER_FUNCTION_ATTENUATION,
      minFrequency: DEFAULT_TRANSFER_FUNCTION_MIN_FREQUENCY_HZ,
      maxFrequency: DEFAULT_TRANSFER_FUNCTION_MAX_FREQUENCY_HZ,
      baseFrequency: DEFAULT_TRANSFER_FUNCTION_BASE_FREQUENCY_HZ,
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

function normalizeTransferFunctionConfig(
  value: unknown,
  fallback: TransferFunctionConfig,
): TransferFunctionConfig {
  const record = isRecord(value) ? value : {};

  return {
    type: unionOrDefault(record.type, TRANSFER_FUNCTION_TYPES, fallback.type),
    tau: numberOrDefault(record.tau, fallback.tau),
    alpha: numberOrDefault(record.alpha, fallback.alpha),
    minFrequency: numberOrDefault(record.minFrequency, fallback.minFrequency),
    maxFrequency: numberOrDefault(record.maxFrequency, fallback.maxFrequency),
    baseFrequency: numberOrDefault(
      record.baseFrequency,
      fallback.baseFrequency,
    ),
  };
}

export function normalizeSynthConfig(value: unknown): SynthConfig | null {
  if (!isRecord(value)) return null;

  const fallback = createDefaultSynthConfig();
  const synth = isRecord(value.synth) ? value.synth : {};
  const envelope = isRecord(value.envelope) ? value.envelope : {};

  return {
    version: 1,
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
    transferFunction: normalizeTransferFunctionConfig(
      value.transferFunction,
      fallback.transferFunction,
    ),
  };
}
