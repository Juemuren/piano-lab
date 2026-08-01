import type { SynthBasicConfig } from '../BasicVoice';
import type { EffectConfig } from '../EffectChain';
import type { EnvelopeConfig } from '../Envelope';
import type { CompressorConfig } from '../effect/Compressor';
import type { FilterEqualizerConfig } from '../effect/FilterEqualizer';
import { createFilterEqualizerConfig } from '../effect/FilterEqualizer';
import type {
  AmplitudeModulationConfig,
  DelayModulationConfig,
  FrequencyModulationConfig,
  PhaseModulationConfig,
} from '../effect/Modulation';
import type { PannerConfig } from '../effect/Panner';
import type { ReverbConfig } from '../effect/Reverb';
import { createReverbConfig } from '../effect/Reverb';
import type { WaveShaperConfig } from '../effect/WaveShaper';
import type { SpectrumConfig } from '../Spectrum';
import { createSpectrum } from '../Spectrum';
import { SYNTH_CONFIG_DEFAULTS } from './Defaults';
import type { SynthConfig } from './Schema';

const defaults = SYNTH_CONFIG_DEFAULTS;

function createDefaultSynthBasicConfig(): SynthBasicConfig {
  return { ...defaults.synth };
}

function createDefaultEnvelopeConfig(): EnvelopeConfig {
  return { ...defaults.envelope };
}

function createDefaultSpectrumConfig(): SpectrumConfig {
  return {
    ...defaults.spectrum,
    customAmplitudes: createSpectrum(
      defaults.spectrum,
      defaults.synth.harmonicCount,
    ).amplitudes,
  };
}

export function createDefaultFilterEqualizerConfig(): FilterEqualizerConfig {
  return createFilterEqualizerConfig(defaults.effect.filterEqualizer.preset);
}

export function createDefaultCompressorConfig(): CompressorConfig {
  return { ...defaults.effect.compressor };
}

export function createDefaultAmplitudeModulationConfig(): AmplitudeModulationConfig {
  return { ...defaults.effect.amplitudeModulation };
}

export function createDefaultFrequencyModulationConfig(): FrequencyModulationConfig {
  return { ...defaults.effect.frequencyModulation };
}

export function createDefaultPhaseModulationConfig(): PhaseModulationConfig {
  return { ...defaults.effect.phaseModulation };
}

export function createDefaultDelayModulationConfig(): DelayModulationConfig {
  return { ...defaults.effect.delayModulation };
}

export function createDefaultWaveShaperConfig(): WaveShaperConfig {
  return { ...defaults.effect.waveShaper };
}

export function createDefaultPannerConfig(): PannerConfig {
  return { ...defaults.effect.panner };
}

export function createDefaultReverbConfig(): ReverbConfig {
  return createReverbConfig(
    defaults.effect.reverb.preset,
    defaults.effect.reverb.mix,
  );
}

export function createDefaultEffectConfig(): EffectConfig {
  return {
    amplitudeModulation: null,
    compressor: null,
    delayModulation: null,
    filterEqualizer: null,
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
