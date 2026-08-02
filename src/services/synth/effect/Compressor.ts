import { SYNTH_CONFIG_DEFAULTS } from '../config/Defaults';

export interface CompressorConfig {
  attack: number;
  knee: number;
  ratio: number;
  release: number;
  threshold: number;
}

export type CompressorConfigAction =
  | { enabled: boolean; type: 'setEnabled' }
  | { patch: Partial<CompressorConfig>; type: 'update' };

export function createCompressorConfig(): CompressorConfig {
  return { ...SYNTH_CONFIG_DEFAULTS.effect.compressor };
}

export function reduceCompressorConfig(
  config: CompressorConfig | null,
  action: CompressorConfigAction,
): CompressorConfig | null {
  if (action.type === 'setEnabled') {
    return action.enabled ? (config ?? createCompressorConfig()) : null;
  }

  return { ...(config ?? createCompressorConfig()), ...action.patch };
}
