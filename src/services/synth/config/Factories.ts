import { createEffectConfig } from '../EffectChain';
import { createSpectrum } from '../Spectrum';
import { SYNTH_CONFIG_DEFAULTS } from './Defaults';
import type { SynthConfig } from './Schema';

export function createDefaultSynthConfig(): SynthConfig {
  return {
    effect: createEffectConfig(),
    envelope: { ...SYNTH_CONFIG_DEFAULTS.envelope },
    spectrum: {
      ...SYNTH_CONFIG_DEFAULTS.spectrum,
      customAmplitudes: createSpectrum(
        SYNTH_CONFIG_DEFAULTS.spectrum,
        SYNTH_CONFIG_DEFAULTS.synth.harmonicCount,
      ).amplitudes,
    },
    synth: { ...SYNTH_CONFIG_DEFAULTS.synth },
  };
}
