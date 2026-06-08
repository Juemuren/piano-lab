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
  DEFAULT_DELAY_MODULATION_DEPTH,
  DEFAULT_DELAY_MODULATION_FREQUENCY,
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
  DEFAULT_TREMOLO_DEPTH,
  DEFAULT_TREMOLO_FREQUENCY,
  DEFAULT_VIBRATO_DEPTH,
  DEFAULT_VIBRATO_FREQUENCY,
  DEFAULT_WAVE_SHAPER_DISTORTION,
  DEFAULT_WAVE_SHAPER_FUZZ,
  DEFAULT_WAVE_SHAPER_OVERDRIVE,
  DEFAULT_WAVE_SHAPER_PRESET,
  DEFAULT_WAVE_SHAPER_SATURATION,
} from '../../../constants/synth';
import type {
  BuiltInReverbPreset,
  CompressorConfig,
  DelayModulationConfig,
  EffectConfig,
  EnvelopeConfig,
  EqualizerConfig,
  EqualizerType,
  FilterConfig,
  FilterType,
  PannerConfig,
  PhaseModulationConfig,
  ReverbConfig,
  SpectrumConfig,
  SynthBasicConfig,
  SynthConfig,
  TremoloConfig,
  VibratoConfig,
  WaveShaperConfig,
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

export function createDefaultTremoloConfig(): TremoloConfig {
  return {
    frequency: DEFAULT_TREMOLO_FREQUENCY,
    depth: DEFAULT_TREMOLO_DEPTH,
  };
}

export function createDefaultVibratoConfig(): VibratoConfig {
  return {
    frequency: DEFAULT_VIBRATO_FREQUENCY,
    depth: DEFAULT_VIBRATO_DEPTH,
  };
}

export function createDefaultPhaseModulationConfig(): PhaseModulationConfig {
  return {
    frequency: DEFAULT_PHASE_MODULATION_FREQUENCY,
    depth: DEFAULT_PHASE_MODULATION_DEPTH,
  };
}

export function createDefaultDelayModulationConfig(): DelayModulationConfig {
  return {
    frequency: DEFAULT_DELAY_MODULATION_FREQUENCY,
    depth: DEFAULT_DELAY_MODULATION_DEPTH,
  };
}

export function createDefaultWaveShaperConfig(): WaveShaperConfig {
  return {
    preset: DEFAULT_WAVE_SHAPER_PRESET,
    saturation: DEFAULT_WAVE_SHAPER_SATURATION,
    distortion: DEFAULT_WAVE_SHAPER_DISTORTION,
    overdrive: DEFAULT_WAVE_SHAPER_OVERDRIVE,
    fuzz: DEFAULT_WAVE_SHAPER_FUZZ,
  };
}

export function createDefaultPannerConfig(): PannerConfig {
  return {
    panningModel: DEFAULT_PANNER_PANNING_MODEL,
    distanceModel: DEFAULT_PANNER_DISTANCE_MODEL,
    positionX: DEFAULT_PANNER_POSITION_X,
    positionY: DEFAULT_PANNER_POSITION_Y,
    positionZ: DEFAULT_PANNER_POSITION_Z,
    orientationX: DEFAULT_PANNER_ORIENTATION_X,
    orientationY: DEFAULT_PANNER_ORIENTATION_Y,
    orientationZ: DEFAULT_PANNER_ORIENTATION_Z,
    refDistance: DEFAULT_PANNER_REF_DISTANCE,
    maxDistance: DEFAULT_PANNER_MAX_DISTANCE,
    rolloffFactor: DEFAULT_PANNER_ROLLOFF_FACTOR,
    coneInnerAngle: DEFAULT_PANNER_CONE_INNER_ANGLE,
    coneOuterAngle: DEFAULT_PANNER_CONE_OUTER_ANGLE,
    coneOuterGain: DEFAULT_PANNER_CONE_OUTER_GAIN,
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
    tremolo: null,
    vibrato: null,
    phaseModulation: null,
    delayModulation: null,
    waveShaper: null,
    compressor: null,
    panner: null,
    reverb: null,
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
