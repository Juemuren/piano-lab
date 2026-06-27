import {
  DEFAULT_EQUALIZER_FREQUENCY,
  DEFAULT_EQUALIZER_GAIN,
  DEFAULT_EQUALIZER_Q,
  DEFAULT_FILTER_FREQUENCY,
  DEFAULT_FILTER_Q,
} from '../../../constants/synth';
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

interface FilterEqualizerPresetDefinition {
  equalizers: EqualizerConfig[];
  filters: FilterConfig[];
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

export function createFilterConfig(type: FilterType): FilterConfig {
  return {
    frequency: DEFAULT_FILTER_FREQUENCY,
    q: DEFAULT_FILTER_Q,
    type,
  };
}

export function createEqualizerConfig(type: EqualizerType): EqualizerConfig {
  return {
    frequency: DEFAULT_EQUALIZER_FREQUENCY,
    gain: DEFAULT_EQUALIZER_GAIN,
    q: DEFAULT_EQUALIZER_Q,
    type,
  };
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
  preset: FilterEqualizerPreset,
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
