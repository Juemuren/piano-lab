import { SYNTH_CONFIG_DEFAULTS } from '../config/Defaults';

export interface CompressorConfig {
  attack: number;
  knee: number;
  ratio: number;
  release: number;
  threshold: number;
}

export function createCompressorConfig(): CompressorConfig {
  return { ...SYNTH_CONFIG_DEFAULTS.effect.compressor };
}
