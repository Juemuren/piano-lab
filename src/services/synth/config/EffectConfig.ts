import type { SynthConfig } from './Schema';

export type EffectConfig = SynthConfig['effect'];

export function createEffectConfig(): EffectConfig {
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
