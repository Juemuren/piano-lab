import { useCallback, useState } from 'react';
import {
  createDefaultEqualizerConfig,
  createDefaultFilterConfig,
  createDefaultFilterEqualizerConfig,
} from '../../../services/synth/config/Defaults';
import type {
  EqualizerType,
  FilterEqualizerConfig,
  FilterType,
} from '../../../types';
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

  const addFilter = useCallback((type: FilterType) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        filters: [...source.filters, createDefaultFilterConfig(type)],
      };
    });
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        filters: removeItemAt(source.filters, index),
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
      };
    });
  }, []);

  const addEqualizer = useCallback((type: EqualizerType) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        equalizers: [...source.equalizers, createDefaultEqualizerConfig(type)],
      };
    });
  }, []);

  const removeEqualizer = useCallback((index: number) => {
    setFilterEqualizer((current) => {
      const source = current ?? createDefaultFilterEqualizerConfig();

      return {
        ...source,
        equalizers: removeItemAt(source.equalizers, index),
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
    updateFilterFrequency,
    updateFilterQ,
    updateFilterType,
  };
}

export default useFilterEqualizerControl;
