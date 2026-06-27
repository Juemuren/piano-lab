import { useCallback, useState } from 'react';
import {
  createDefaultEqualizerConfig,
  createDefaultFilterConfig,
  createDefaultFilterEqualizerConfig,
} from '../../../services/synth/config/Defaults';
import type {
  EqualizerType,
  FilterEqualizerPreset,
  FilterType,
} from '../../../services/synth/config/Options';
import type { FilterEqualizerConfig } from '../../../types/synth';
import { removeItemAt, updateItemAt } from '../../../utils/collection';

function useFilterEqualizerControl(
  initialFilterEqualizer: FilterEqualizerConfig | null,
) {
  const [filterEqualizer, setFilterEqualizer] =
    useState<FilterEqualizerConfig | null>(() => initialFilterEqualizer);

  const updateFilterEqualizerEnabled = useCallback((enabled: boolean) => {
    setFilterEqualizer((current) =>
      enabled ? (current ?? createDefaultFilterEqualizerConfig()) : null,
    );
  }, []);

  const updateFilterEqualizerPreset = useCallback(
    (preset: FilterEqualizerPreset) => {
      setFilterEqualizer(() => createDefaultFilterEqualizerConfig(preset));
    },
    [],
  );

  const addFilter = useCallback((type: FilterType) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        filters: [...source.filters, createDefaultFilterConfig(type)],
        preset: 'custom',
      };
    });
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        filters: removeItemAt(source.filters, index),
        preset: 'custom',
      };
    });
  }, []);

  const updateFilterType = useCallback((index: number, type: FilterType) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        filters: updateItemAt(source.filters, index, (filter) => ({
          ...filter,
          type,
        })),
        preset: 'custom',
      };
    });
  }, []);

  const updateFilterFrequency = useCallback(
    (index: number, frequency: number) => {
      setFilterEqualizer((current) => {
        const source = current ?? createDefaultFilterEqualizerConfig();

        return {
          ...source,
          filters: updateItemAt(source.filters, index, (filter) => ({
            ...filter,
            frequency,
          })),
          preset: 'custom',
        };
      });
    },
    [],
  );

  const updateFilterQ = useCallback((index: number, q: number) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        filters: updateItemAt(source.filters, index, (filter) => ({
          ...filter,
          q,
        })),
        preset: 'custom',
      };
    });
  }, []);

  const addEqualizer = useCallback((type: EqualizerType) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        equalizers: [...source.equalizers, createDefaultEqualizerConfig(type)],
        preset: 'custom',
      };
    });
  }, []);

  const removeEqualizer = useCallback((index: number) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        equalizers: removeItemAt(source.equalizers, index),
        preset: 'custom',
      };
    });
  }, []);

  const updateEqualizerType = useCallback(
    (index: number, type: EqualizerType) => {
      setFilterEqualizer((current) => {
        const source = current ?? createDefaultFilterEqualizerConfig();

        return {
          ...source,
          equalizers: updateItemAt(source.equalizers, index, (equalizer) => ({
            ...equalizer,
            type,
          })),
          preset: 'custom',
        };
      });
    },
    [],
  );

  const updateEqualizerFrequency = useCallback(
    (index: number, frequency: number) => {
      setFilterEqualizer((current) => {
        const source = current ?? createDefaultFilterEqualizerConfig();

        return {
          ...source,
          equalizers: updateItemAt(source.equalizers, index, (equalizer) => ({
            ...equalizer,
            frequency,
          })),
          preset: 'custom',
        };
      });
    },
    [],
  );

  const updateEqualizerQ = useCallback((index: number, q: number) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        equalizers: updateItemAt(source.equalizers, index, (equalizer) => ({
          ...equalizer,
          q,
        })),
        preset: 'custom',
      };
    });
  }, []);

  const updateEqualizerGain = useCallback((index: number, gain: number) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        equalizers: updateItemAt(source.equalizers, index, (equalizer) => ({
          ...equalizer,
          gain,
        })),
        preset: 'custom',
      };
    });
  }, []);

  return {
    addEqualizer,
    addFilter,
    filterEqualizer,
    removeEqualizer,
    removeFilter,
    updateEqualizerFrequency,
    updateEqualizerGain,
    updateEqualizerQ,
    updateEqualizerType,
    updateFilterEqualizerEnabled,
    updateFilterEqualizerPreset,
    updateFilterFrequency,
    updateFilterQ,
    updateFilterType,
  };
}

export default useFilterEqualizerControl;
