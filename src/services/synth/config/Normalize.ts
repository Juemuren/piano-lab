import {
  DEFAULT_AMPLITUDE_MODULATION_DEPTH,
  DEFAULT_AMPLITUDE_MODULATION_FREQUENCY,
  DEFAULT_COMPRESSOR_ATTACK,
  DEFAULT_COMPRESSOR_KNEE,
  DEFAULT_COMPRESSOR_RATIO,
  DEFAULT_COMPRESSOR_RELEASE,
  DEFAULT_COMPRESSOR_THRESHOLD,
  DEFAULT_DELAY_MODULATION_DEPTH,
  DEFAULT_DELAY_MODULATION_FREQUENCY,
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
  DEFAULT_FREQUENCY_MODULATION_DEPTH,
  DEFAULT_FREQUENCY_MODULATION_FREQUENCY,
  DEFAULT_PANNER_CONE_INNER_ANGLE,
  DEFAULT_PANNER_CONE_OUTER_ANGLE,
  DEFAULT_PANNER_CONE_OUTER_GAIN,
  DEFAULT_PANNER_DISTANCE_MODEL,
  DEFAULT_PANNER_MAX_DISTANCE,
  DEFAULT_PANNER_ORIENTATION_X,
  DEFAULT_PANNER_ORIENTATION_Y,
  DEFAULT_PANNER_ORIENTATION_Z,
  DEFAULT_PANNER_PANNING_MODEL,
  DEFAULT_PANNER_POSITION_X,
  DEFAULT_PANNER_POSITION_Y,
  DEFAULT_PANNER_POSITION_Z,
  DEFAULT_PANNER_REF_DISTANCE,
  DEFAULT_PANNER_ROLLOFF_FACTOR,
  DEFAULT_PHASE_MODULATION_DEPTH,
  DEFAULT_PHASE_MODULATION_FREQUENCY,
  DEFAULT_REVERB_EARLY_REFLECTION_DELAY,
  DEFAULT_REVERB_EARLY_REFLECTION_GAIN,
  DEFAULT_REVERB_EARLY_REFLECTION_PHASE,
  DEFAULT_REVERB_LATE_TAIL_ALPHA,
  DEFAULT_REVERB_LATE_TAIL_AMPLITUDE,
  DEFAULT_REVERB_LATE_TAIL_DELAY,
  DEFAULT_REVERB_LATE_TAIL_DURATION,
  DEFAULT_REVERB_MIX,
  DEFAULT_REVERB_PRESET,
  DEFAULT_WAVE_SHAPER_DISTORTION,
  DEFAULT_WAVE_SHAPER_FUZZ,
  DEFAULT_WAVE_SHAPER_OVERDRIVE,
  DEFAULT_WAVE_SHAPER_PRESET,
  DEFAULT_WAVE_SHAPER_SATURATION,
} from '../../../constants/synth';
import type {
  AmplitudeModulationConfig,
  CompressorConfig,
  DelayModulationConfig,
  EffectConfig,
  EqualizerConfig,
  FilterConfig,
  FilterEqualizerConfig,
  FrequencyModulationConfig,
  PannerConfig,
  PhaseModulationConfig,
  ReverbConfig,
  ReverbEarlyReflectionConfig,
  ReverbLateTailConfig,
  SpectrumConfig,
  SynthConfig,
  WaveShaperConfig,
} from '../../../types';
import {
  isRecord,
  numberArrayOrDefault,
  numberOrDefault,
  unionOrDefault,
} from '../../../utils/runtime';
import { createFilterEqualizerConfig } from '../effect/FilterEqualizer';
import { createReverbConfig } from '../effect/Reverb';
import { createDefaultSynthConfig } from './Defaults';
import {
  EQUALIZER_TYPES,
  FILTER_EQUALIZER_PRESETS,
  FILTER_TYPES,
  OSCILLATOR_TYPES,
  PANNER_DISTANCE_MODELS,
  PANNER_PANNING_MODELS,
  REVERB_PRESETS,
  SPECTRUM_TYPES,
  WAVE_SHAPER_PRESETS,
} from './Options';

function normalizeSpectrumConfig(
  value: unknown,
  fallback: SpectrumConfig,
): SpectrumConfig {
  const record = isRecord(value) ? value : {};

  return {
    customAmplitudes: numberArrayOrDefault(
      record.customAmplitudes,
      fallback.customAmplitudes,
    ),
    lambda: numberOrDefault(record.lambda, fallback.lambda),
    p: numberOrDefault(record.p, fallback.p),
    sigma: numberOrDefault(record.sigma, fallback.sigma),
    type: unionOrDefault(record.type, SPECTRUM_TYPES, fallback.type),
  };
}

function normalizeFilterConfig(value: unknown): FilterConfig | null {
  if (!isRecord(value)) return null;

  return {
    frequency: numberOrDefault(value.frequency, DEFAULT_FILTER_FREQUENCY),
    q: numberOrDefault(value.q, DEFAULT_FILTER_Q),
    type: unionOrDefault(value.type, FILTER_TYPES, DEFAULT_FILTER_TYPE),
  };
}

function normalizeEqualizerConfig(value: unknown): EqualizerConfig | null {
  if (!isRecord(value)) return null;

  return {
    frequency: numberOrDefault(value.frequency, DEFAULT_EQUALIZER_FREQUENCY),
    gain: numberOrDefault(value.gain, DEFAULT_EQUALIZER_GAIN),
    q: numberOrDefault(value.q, DEFAULT_EQUALIZER_Q),
    type: unionOrDefault(value.type, EQUALIZER_TYPES, DEFAULT_EQUALIZER_TYPE),
  };
}

function normalizeFilterEqualizerConfig(
  value: unknown,
): FilterEqualizerConfig | null {
  if (!isRecord(value)) return null;

  const preset = unionOrDefault(
    value.preset,
    FILTER_EQUALIZER_PRESETS,
    'custom',
  );
  const fallback = createFilterEqualizerConfig(preset);

  return {
    equalizers: Array.isArray(value.equalizers)
      ? value.equalizers
          .map(normalizeEqualizerConfig)
          .filter((equalizer): equalizer is EqualizerConfig =>
            Boolean(equalizer),
          )
      : fallback.equalizers,
    filters: Array.isArray(value.filters)
      ? value.filters
          .map(normalizeFilterConfig)
          .filter((filter): filter is FilterConfig => Boolean(filter))
      : fallback.filters,
    preset,
  };
}

function normalizeCompressorConfig(value: unknown): CompressorConfig | null {
  if (!isRecord(value)) return null;

  return {
    attack: numberOrDefault(value.attack, DEFAULT_COMPRESSOR_ATTACK),
    knee: numberOrDefault(value.knee, DEFAULT_COMPRESSOR_KNEE),
    ratio: numberOrDefault(value.ratio, DEFAULT_COMPRESSOR_RATIO),
    release: numberOrDefault(value.release, DEFAULT_COMPRESSOR_RELEASE),
    threshold: numberOrDefault(value.threshold, DEFAULT_COMPRESSOR_THRESHOLD),
  };
}

function normalizeAmplitudeModulationConfig(
  value: unknown,
): AmplitudeModulationConfig | null {
  if (!isRecord(value)) return null;

  return {
    depth: numberOrDefault(value.depth, DEFAULT_AMPLITUDE_MODULATION_DEPTH),
    frequency: numberOrDefault(
      value.frequency,
      DEFAULT_AMPLITUDE_MODULATION_FREQUENCY,
    ),
  };
}

function normalizeFrequencyModulationConfig(
  value: unknown,
): FrequencyModulationConfig | null {
  if (!isRecord(value)) return null;

  return {
    depth: numberOrDefault(value.depth, DEFAULT_FREQUENCY_MODULATION_DEPTH),
    frequency: numberOrDefault(
      value.frequency,
      DEFAULT_FREQUENCY_MODULATION_FREQUENCY,
    ),
  };
}

function normalizePhaseModulationConfig(
  value: unknown,
): PhaseModulationConfig | null {
  if (!isRecord(value)) return null;

  return {
    depth: numberOrDefault(value.depth, DEFAULT_PHASE_MODULATION_DEPTH),
    frequency: numberOrDefault(
      value.frequency,
      DEFAULT_PHASE_MODULATION_FREQUENCY,
    ),
  };
}

function normalizeDelayModulationConfig(
  value: unknown,
): DelayModulationConfig | null {
  if (!isRecord(value)) return null;

  return {
    depth: numberOrDefault(value.depth, DEFAULT_DELAY_MODULATION_DEPTH),
    frequency: numberOrDefault(
      value.frequency,
      DEFAULT_DELAY_MODULATION_FREQUENCY,
    ),
  };
}

function normalizeWaveShaperConfig(value: unknown): WaveShaperConfig | null {
  if (!isRecord(value)) return null;

  return {
    distortion: numberOrDefault(
      value.distortion,
      DEFAULT_WAVE_SHAPER_DISTORTION,
    ),
    fuzz: numberOrDefault(value.fuzz, DEFAULT_WAVE_SHAPER_FUZZ),
    overdrive: numberOrDefault(value.overdrive, DEFAULT_WAVE_SHAPER_OVERDRIVE),
    preset: unionOrDefault(
      value.preset,
      WAVE_SHAPER_PRESETS,
      DEFAULT_WAVE_SHAPER_PRESET,
    ),
    saturation: numberOrDefault(
      value.saturation,
      DEFAULT_WAVE_SHAPER_SATURATION,
    ),
  };
}

function normalizePannerConfig(value: unknown): PannerConfig | null {
  if (!isRecord(value)) return null;

  return {
    coneInnerAngle: numberOrDefault(
      value.coneInnerAngle,
      DEFAULT_PANNER_CONE_INNER_ANGLE,
    ),
    coneOuterAngle: numberOrDefault(
      value.coneOuterAngle,
      DEFAULT_PANNER_CONE_OUTER_ANGLE,
    ),
    coneOuterGain: numberOrDefault(
      value.coneOuterGain,
      DEFAULT_PANNER_CONE_OUTER_GAIN,
    ),
    distanceModel: unionOrDefault(
      value.distanceModel,
      PANNER_DISTANCE_MODELS,
      DEFAULT_PANNER_DISTANCE_MODEL,
    ),
    maxDistance: numberOrDefault(
      value.maxDistance,
      DEFAULT_PANNER_MAX_DISTANCE,
    ),
    orientationX: numberOrDefault(
      value.orientationX,
      DEFAULT_PANNER_ORIENTATION_X,
    ),
    orientationY: numberOrDefault(
      value.orientationY,
      DEFAULT_PANNER_ORIENTATION_Y,
    ),
    orientationZ: numberOrDefault(
      value.orientationZ,
      DEFAULT_PANNER_ORIENTATION_Z,
    ),
    panningModel: unionOrDefault(
      value.panningModel,
      PANNER_PANNING_MODELS,
      DEFAULT_PANNER_PANNING_MODEL,
    ),
    positionX: numberOrDefault(value.positionX, DEFAULT_PANNER_POSITION_X),
    positionY: numberOrDefault(value.positionY, DEFAULT_PANNER_POSITION_Y),
    positionZ: numberOrDefault(value.positionZ, DEFAULT_PANNER_POSITION_Z),
    refDistance: numberOrDefault(
      value.refDistance,
      DEFAULT_PANNER_REF_DISTANCE,
    ),
    rolloffFactor: numberOrDefault(
      value.rolloffFactor,
      DEFAULT_PANNER_ROLLOFF_FACTOR,
    ),
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
    earlyReflections: Array.isArray(value.earlyReflections)
      ? value.earlyReflections
          .map(normalizeReverbEarlyReflectionConfig)
          .filter((reflection): reflection is ReverbEarlyReflectionConfig =>
            Boolean(reflection),
          )
      : fallback.earlyReflections,
    lateTail: normalizeReverbLateTailConfig(value.lateTail, fallback.lateTail),
    mix,
    preset,
  };
}

function normalizeReverbEarlyReflectionConfig(
  value: unknown,
): ReverbEarlyReflectionConfig | null {
  if (!isRecord(value)) return null;

  return {
    delay: numberOrDefault(value.delay, DEFAULT_REVERB_EARLY_REFLECTION_DELAY),
    gain: numberOrDefault(value.gain, DEFAULT_REVERB_EARLY_REFLECTION_GAIN),
    phase: numberOrDefault(value.phase, DEFAULT_REVERB_EARLY_REFLECTION_PHASE),
  };
}

function normalizeReverbLateTailConfig(
  value: unknown,
  fallback: ReverbLateTailConfig,
): ReverbLateTailConfig {
  if (!isRecord(value)) return fallback;

  return {
    alpha: numberOrDefault(value.alpha, DEFAULT_REVERB_LATE_TAIL_ALPHA),
    amplitude: numberOrDefault(
      value.amplitude,
      DEFAULT_REVERB_LATE_TAIL_AMPLITUDE,
    ),
    delay: numberOrDefault(value.delay, DEFAULT_REVERB_LATE_TAIL_DELAY),
    duration: numberOrDefault(
      value.duration,
      DEFAULT_REVERB_LATE_TAIL_DURATION,
    ),
  };
}

function normalizeEffectConfig(
  value: unknown,
  fallback: EffectConfig,
): EffectConfig {
  if (!isRecord(value)) return fallback;

  return {
    amplitudeModulation:
      value.amplitudeModulation === undefined
        ? fallback.amplitudeModulation
        : normalizeAmplitudeModulationConfig(value.amplitudeModulation),
    compressor:
      value.compressor === undefined
        ? fallback.compressor
        : normalizeCompressorConfig(value.compressor),
    delayModulation:
      value.delayModulation === undefined
        ? fallback.delayModulation
        : normalizeDelayModulationConfig(value.delayModulation),
    filterEqualizer:
      value.filterEqualizer === undefined
        ? fallback.filterEqualizer
        : normalizeFilterEqualizerConfig(value.filterEqualizer),
    frequencyModulation:
      value.frequencyModulation === undefined
        ? fallback.frequencyModulation
        : normalizeFrequencyModulationConfig(value.frequencyModulation),
    panner:
      value.panner === undefined
        ? fallback.panner
        : normalizePannerConfig(value.panner),
    phaseModulation:
      value.phaseModulation === undefined
        ? fallback.phaseModulation
        : normalizePhaseModulationConfig(value.phaseModulation),
    reverb:
      value.reverb === undefined
        ? fallback.reverb
        : normalizeReverbConfig(value.reverb),
    waveShaper:
      value.waveShaper === undefined
        ? fallback.waveShaper
        : normalizeWaveShaperConfig(value.waveShaper),
  };
}

export function normalizeSynthConfig(value: unknown): SynthConfig | null {
  if (!isRecord(value)) return null;

  const fallback = createDefaultSynthConfig();
  const synth = isRecord(value.synth) ? value.synth : {};
  const envelope = isRecord(value.envelope) ? value.envelope : {};

  return {
    effect: normalizeEffectConfig(value.effect, fallback.effect),
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
      silenceGain: numberOrDefault(
        envelope.silenceGain,
        DEFAULT_ENVELOPE_SILENCE_GAIN,
      ),
      sustainGain: numberOrDefault(
        envelope.sustainGain,
        DEFAULT_ENVELOPE_SUSTAIN_GAIN,
      ),
    },
    spectrum: normalizeSpectrumConfig(value.spectrum, fallback.spectrum),
    synth: {
      harmonicCount: Math.round(
        numberOrDefault(synth.harmonicCount, fallback.synth.harmonicCount),
      ),
      oscillatorType: unionOrDefault(
        synth.oscillatorType,
        OSCILLATOR_TYPES,
        fallback.synth.oscillatorType,
      ),
      volumeRatio: numberOrDefault(
        synth.volumeRatio,
        fallback.synth.volumeRatio,
      ),
    },
  };
}
