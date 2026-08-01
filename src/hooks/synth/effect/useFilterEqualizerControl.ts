import { useCallback, useState } from 'react';
import type {
  EqualizerType,
  FilterEqualizerPreset,
  FilterType,
} from '../../../services/synth/config/Options';
import type {
  EqualizerConfig,
  FilterConfig,
  FilterEqualizerConfig,
} from '../../../services/synth/effect/FilterEqualizer';
import {
  createEqualizerConfig,
  createFilterConfig,
  createFilterEqualizerConfig,
} from '../../../services/synth/effect/FilterEqualizer';
import { removeItemAt, updateItemAt } from '../../../utils/collection';

function useFilterEqualizerControl(
  initialFilterEqualizer: FilterEqualizerConfig | null,
) {
  const [filterEqualizer, setFilterEqualizer] =
    useState<FilterEqualizerConfig | null>(() => initialFilterEqualizer);

  const updateFilterEqualizerEnabled = useCallback((enabled: boolean) => {
    setFilterEqualizer((current) =>
      enabled ? (current ?? createFilterEqualizerConfig()) : null,
    );
  }, []);

  const updateFilterEqualizerPreset = useCallback(
    (preset: FilterEqualizerPreset) => {
      setFilterEqualizer(createFilterEqualizerConfig(preset));
    },
    [],
  );

  const addFilter = useCallback((type: FilterType) => {
    setFilterEqualizer((current) => {
      const source = current ?? createFilterEqualizerConfig();

      return {
        ...source,
        filters: [...source.filters, createFilterConfig(type)],
        preset: 'custom',
      };
    });
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilterEqualizer((current) => {
      const source = current ?? createFilterEqualizerConfig();

      return {
        ...source,
        filters: removeItemAt(source.filters, index),
        preset: 'custom',
      };
    });
  }, []);

  const updateFilter = useCallback(
    <Key extends keyof FilterConfig>(
      index: number,
      key: Key,
      value: FilterConfig[Key],
    ) => {
      setFilterEqualizer((current) => {
        const source = current ?? createFilterEqualizerConfig();

        return {
          ...source,
          filters: updateItemAt(source.filters, index, (filter) => ({
            ...filter,
            [key]: value,
          })),
          preset: 'custom',
        };
      });
    },
    [],
  );

  const addEqualizer = useCallback((type: EqualizerType) => {
    setFilterEqualizer((current) => {
      const source = current ?? createFilterEqualizerConfig();

      return {
        ...source,
        equalizers: [...source.equalizers, createEqualizerConfig(type)],
        preset: 'custom',
      };
    });
  }, []);

  const removeEqualizer = useCallback((index: number) => {
    setFilterEqualizer((current) => {
      const source = current ?? createFilterEqualizerConfig();

      return {
        ...source,
        equalizers: removeItemAt(source.equalizers, index),
        preset: 'custom',
      };
    });
  }, []);

  const updateEqualizer = useCallback(
    <Key extends keyof EqualizerConfig>(
      index: number,
      key: Key,
      value: EqualizerConfig[Key],
    ) => {
      setFilterEqualizer((current) => {
        const source = current ?? createFilterEqualizerConfig();

        return {
          ...source,
          equalizers: updateItemAt(source.equalizers, index, (equalizer) => ({
            ...equalizer,
            [key]: value,
          })),
          preset: 'custom',
        };
      });
    },
    [],
  );

  return {
    addEqualizer,
    addFilter,
    filterEqualizer,
    removeEqualizer,
    removeFilter,
    updateEqualizer,
    updateFilter,
    updateFilterEqualizerEnabled,
    updateFilterEqualizerPreset,
  };
}

export default useFilterEqualizerControl;
