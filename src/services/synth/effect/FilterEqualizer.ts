import { removeItemAt, updateItemAt } from '../../../utils/collection';
import { SYNTH_CONFIG_DEFAULTS } from '../config/Defaults';
import type {
  BuiltInFilterEqualizerPreset,
  EqualizerType,
  FilterEqualizerPreset,
  FilterType,
} from '../config/Options';

export interface FilterConfig {
  frequency: number;
  q: number;
  type: FilterType;
}

export interface EqualizerConfig {
  frequency: number;
  gain: number;
  q: number;
  type: EqualizerType;
}

export interface FilterEqualizerConfig {
  equalizers: EqualizerConfig[];
  filters: FilterConfig[];
  preset: FilterEqualizerPreset;
}

export type FilterEqualizerConfigAction =
  | { enabled: boolean; type: 'setEnabled' }
  | { preset: FilterEqualizerPreset; type: 'setPreset' }
  | { filterType: FilterType; type: 'addFilter' }
  | { index: number; type: 'removeFilter' }
  | { index: number; patch: Partial<FilterConfig>; type: 'updateFilter' }
  | { equalizerType: EqualizerType; type: 'addEqualizer' }
  | { index: number; type: 'removeEqualizer' }
  | {
      index: number;
      patch: Partial<EqualizerConfig>;
      type: 'updateEqualizer';
    };

interface FilterEqualizerPresetDefinition {
  equalizers: EqualizerConfig[];
  filters: FilterConfig[];
}

export function createFilterConfig(type: FilterType): FilterConfig {
  return {
    frequency: SYNTH_CONFIG_DEFAULTS.effect.filterEqualizer.filter.frequency,
    q: SYNTH_CONFIG_DEFAULTS.effect.filterEqualizer.filter.q,
    type,
  };
}

export function createEqualizerConfig(type: EqualizerType): EqualizerConfig {
  return {
    frequency: SYNTH_CONFIG_DEFAULTS.effect.filterEqualizer.equalizer.frequency,
    gain: SYNTH_CONFIG_DEFAULTS.effect.filterEqualizer.equalizer.gain,
    q: SYNTH_CONFIG_DEFAULTS.effect.filterEqualizer.equalizer.q,
    type,
  };
}

function createEqualizers(gains: number[]): EqualizerConfig[] {
  const frequencies = [40, 160, 640, 2560, 10240];

  return frequencies
    .map((frequency, index) => ({
      frequency,
      gain: gains[index],
      q: 1,
      type: 'peaking' as const,
    }))
    .filter((equalizer) => equalizer.gain !== 0);
}

export const FILTER_EQUALIZER_PRESET_DEFINITIONS: Record<
  BuiltInFilterEqualizerPreset,
  FilterEqualizerPresetDefinition
> = {
  classical: {
    equalizers: createEqualizers([0, -3, -2, 5, 6]),
    filters: [],
  },
  jazz: {
    equalizers: createEqualizers([3, 3, -2, 4, 5]),
    filters: [],
  },
  pop: {
    equalizers: createEqualizers([5, 0, -3, 5, 3]),
    filters: [],
  },
  rock: {
    equalizers: createEqualizers([6, 2, -3, 8, 4]),
    filters: [],
  },
};

export function createFilterEqualizerConfig(
  preset: FilterEqualizerPreset = SYNTH_CONFIG_DEFAULTS.effect.filterEqualizer
    .preset,
): FilterEqualizerConfig {
  if (preset === 'custom') {
    return {
      equalizers: [],
      filters: [],
      preset,
    };
  }

  const definition = FILTER_EQUALIZER_PRESET_DEFINITIONS[preset];

  return {
    equalizers: definition.equalizers.map((equalizer) => ({ ...equalizer })),
    filters: definition.filters.map((filter) => ({ ...filter })),
    preset,
  };
}

export function reduceFilterEqualizerConfig(
  config: FilterEqualizerConfig | null,
  action: FilterEqualizerConfigAction,
): FilterEqualizerConfig | null {
  if (action.type === 'setEnabled') {
    return action.enabled ? (config ?? createFilterEqualizerConfig()) : null;
  }

  if (action.type === 'setPreset') {
    return createFilterEqualizerConfig(action.preset);
  }

  const source = config ?? createFilterEqualizerConfig();

  switch (action.type) {
    case 'addFilter':
      return {
        ...source,
        filters: [...source.filters, createFilterConfig(action.filterType)],
        preset: 'custom',
      };
    case 'removeFilter':
      return {
        ...source,
        filters: removeItemAt(source.filters, action.index),
        preset: 'custom',
      };
    case 'updateFilter':
      return {
        ...source,
        filters: updateItemAt(source.filters, action.index, (filter) => ({
          ...filter,
          ...action.patch,
        })),
        preset: 'custom',
      };
    case 'addEqualizer':
      return {
        ...source,
        equalizers: [
          ...source.equalizers,
          createEqualizerConfig(action.equalizerType),
        ],
        preset: 'custom',
      };
    case 'removeEqualizer':
      return {
        ...source,
        equalizers: removeItemAt(source.equalizers, action.index),
        preset: 'custom',
      };
    case 'updateEqualizer':
      return {
        ...source,
        equalizers: updateItemAt(
          source.equalizers,
          action.index,
          (equalizer) => ({ ...equalizer, ...action.patch }),
        ),
        preset: 'custom',
      };
  }
}
