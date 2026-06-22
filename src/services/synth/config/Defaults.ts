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
  DEFAULT_REVERB_MIX,
  DEFAULT_REVERB_PRESET,
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
  DEFAULT_SPECTRUM_TYPE,
  DEFAULT_SYNTH_HARMONIC_COUNT,
  DEFAULT_SYNTH_OSCILLATOR_TYPE,
  DEFAULT_SYNTH_VOLUME_RATIO,
  DEFAULT_WAVE_SHAPER_DISTORTION,
  DEFAULT_WAVE_SHAPER_FUZZ,
  DEFAULT_WAVE_SHAPER_OVERDRIVE,
  DEFAULT_WAVE_SHAPER_PRESET,
  DEFAULT_WAVE_SHAPER_SATURATION,
} from '../../../constants/synth';
import type {
  AmplitudeModulationConfig,
  BuiltInReverbPreset,
  CompressorConfig,
  DelayModulationConfig,
  EffectConfig,
  EnvelopeConfig,
  EqualizerConfig,
  EqualizerType,
  FilterConfig,
  FilterType,
  FrequencyModulationConfig,
  PannerConfig,
  PhaseModulationConfig,
  ReverbConfig,
  SpectrumConfig,
  SynthBasicConfig,
  SynthConfig,
  WaveShaperConfig,
} from '../../../types';
import { createReverbConfig } from '../effect/Reverb';
import { createSpectrum } from '../Spectrum';

export function createDefaultSynthBasicConfig(): SynthBasicConfig {
  return {
    harmonicCount: DEFAULT_SYNTH_HARMONIC_COUNT,
    oscillatorType: DEFAULT_SYNTH_OSCILLATOR_TYPE,
    volumeRatio: DEFAULT_SYNTH_VOLUME_RATIO,
  };
}

export function createDefaultEnvelopeConfig(): EnvelopeConfig {
  return {
    attackTime: DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
    decayTime: DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
    releaseTime: DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
    silenceGain: DEFAULT_ENVELOPE_SILENCE_GAIN,
    sustainGain: DEFAULT_ENVELOPE_SUSTAIN_GAIN,
  };
}

export function createDefaultSpectrumConfig(): SpectrumConfig {
  return {
    customAmplitudes: createSpectrum(
      {
        lambda: DEFAULT_SPECTRUM_STRIKE_POINT,
        p: DEFAULT_SPECTRUM_POWER_EXPONENT,
        sigma: DEFAULT_SPECTRUM_DECAY_RATE,
        type: DEFAULT_SPECTRUM_TYPE,
      },
      DEFAULT_SYNTH_HARMONIC_COUNT,
    ).amplitudes,
    lambda: DEFAULT_SPECTRUM_STRIKE_POINT,
    p: DEFAULT_SPECTRUM_POWER_EXPONENT,
    sigma: DEFAULT_SPECTRUM_DECAY_RATE,
    type: DEFAULT_SPECTRUM_TYPE,
  };
}

export function createDefaultFilterConfig(
  type: FilterType = DEFAULT_FILTER_TYPE,
): FilterConfig {
  return {
    frequency: DEFAULT_FILTER_FREQUENCY,
    q: DEFAULT_FILTER_Q,
    type,
  };
}

export function createDefaultEqualizerConfig(
  type: EqualizerType = DEFAULT_EQUALIZER_TYPE,
): EqualizerConfig {
  return {
    frequency: DEFAULT_EQUALIZER_FREQUENCY,
    gain: DEFAULT_EQUALIZER_GAIN,
    q: DEFAULT_EQUALIZER_Q,
    type,
  };
}

export function createDefaultCompressorConfig(): CompressorConfig {
  return {
    attack: DEFAULT_COMPRESSOR_ATTACK,
    knee: DEFAULT_COMPRESSOR_KNEE,
    ratio: DEFAULT_COMPRESSOR_RATIO,
    release: DEFAULT_COMPRESSOR_RELEASE,
    threshold: DEFAULT_COMPRESSOR_THRESHOLD,
  };
}

export function createDefaultAmplitudeModulationConfig(): AmplitudeModulationConfig {
  return {
    depth: DEFAULT_AMPLITUDE_MODULATION_DEPTH,
    frequency: DEFAULT_AMPLITUDE_MODULATION_FREQUENCY,
  };
}

export function createDefaultFrequencyModulationConfig(): FrequencyModulationConfig {
  return {
    depth: DEFAULT_FREQUENCY_MODULATION_DEPTH,
    frequency: DEFAULT_FREQUENCY_MODULATION_FREQUENCY,
  };
}

export function createDefaultPhaseModulationConfig(): PhaseModulationConfig {
  return {
    depth: DEFAULT_PHASE_MODULATION_DEPTH,
    frequency: DEFAULT_PHASE_MODULATION_FREQUENCY,
  };
}

export function createDefaultDelayModulationConfig(): DelayModulationConfig {
  return {
    depth: DEFAULT_DELAY_MODULATION_DEPTH,
    frequency: DEFAULT_DELAY_MODULATION_FREQUENCY,
  };
}

export function createDefaultWaveShaperConfig(): WaveShaperConfig {
  return {
    distortion: DEFAULT_WAVE_SHAPER_DISTORTION,
    fuzz: DEFAULT_WAVE_SHAPER_FUZZ,
    overdrive: DEFAULT_WAVE_SHAPER_OVERDRIVE,
    preset: DEFAULT_WAVE_SHAPER_PRESET,
    saturation: DEFAULT_WAVE_SHAPER_SATURATION,
  };
}

export function createDefaultPannerConfig(): PannerConfig {
  return {
    coneInnerAngle: DEFAULT_PANNER_CONE_INNER_ANGLE,
    coneOuterAngle: DEFAULT_PANNER_CONE_OUTER_ANGLE,
    coneOuterGain: DEFAULT_PANNER_CONE_OUTER_GAIN,
    distanceModel: DEFAULT_PANNER_DISTANCE_MODEL,
    maxDistance: DEFAULT_PANNER_MAX_DISTANCE,
    orientationX: DEFAULT_PANNER_ORIENTATION_X,
    orientationY: DEFAULT_PANNER_ORIENTATION_Y,
    orientationZ: DEFAULT_PANNER_ORIENTATION_Z,
    panningModel: DEFAULT_PANNER_PANNING_MODEL,
    positionX: DEFAULT_PANNER_POSITION_X,
    positionY: DEFAULT_PANNER_POSITION_Y,
    positionZ: DEFAULT_PANNER_POSITION_Z,
    refDistance: DEFAULT_PANNER_REF_DISTANCE,
    rolloffFactor: DEFAULT_PANNER_ROLLOFF_FACTOR,
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
    amplitudeModulation: null,
    compressor: null,
    delayModulation: null,
    equalizers: [],
    filters: [],
    frequencyModulation: null,
    panner: null,
    phaseModulation: null,
    reverb: null,
    waveShaper: null,
  };
}

export function createDefaultSynthConfig(): SynthConfig {
  return {
    effect: createDefaultEffectConfig(),
    envelope: createDefaultEnvelopeConfig(),
    spectrum: createDefaultSpectrumConfig(),
    synth: createDefaultSynthBasicConfig(),
  };
}
