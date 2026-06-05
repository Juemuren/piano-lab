import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';
import {
  DEFAULT_FILTER_EFFECT_FREQUENCY,
  DEFAULT_FILTER_EFFECT_Q,
  DEFAULT_FILTER_EFFECT_TYPE,
} from '../../constants';
import type {
  EffectConfig,
  FilterEffectConfig,
  FilterEffectType,
} from '../../types';

function createDefaultFilterConfig(
  type: FilterEffectType = DEFAULT_FILTER_EFFECT_TYPE,
): FilterEffectConfig {
  return {
    type,
    frequency: DEFAULT_FILTER_EFFECT_FREQUENCY,
    q: DEFAULT_FILTER_EFFECT_Q,
  };
}

function useEffectControl(
  initialConfig?: EffectConfig | null,
  onConfigChange?: (config: EffectConfig) => void,
) {
  const synthEngine = useSynthEngine();
  const [filters, setFilters] = useState<FilterEffectConfig[]>(
    () => initialConfig?.filters ?? [],
  );

  const effectConfig = useMemo<EffectConfig>(
    () => ({
      filters,
    }),
    [filters],
  );

  useEffect(() => {
    synthEngine.configureEffect(effectConfig);
  }, [effectConfig, synthEngine]);

  useEffect(() => {
    onConfigChange?.(effectConfig);
  }, [effectConfig, onConfigChange]);

  const addFilter = useCallback((type: FilterEffectType) => {
    setFilters((current) => [...current, createDefaultFilterConfig(type)]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }, []);

  const updateFilterType = useCallback(
    (index: number, type: FilterEffectType) => {
      setFilters((current) =>
        current.map((filter, itemIndex) =>
          itemIndex === index ? { ...filter, type } : filter,
        ),
      );
    },
    [],
  );

  const updateFilterFrequency = useCallback(
    (index: number, frequency: number) => {
      setFilters((current) =>
        current.map((filter, itemIndex) =>
          itemIndex === index ? { ...filter, frequency } : filter,
        ),
      );
    },
    [],
  );

  const updateFilterQ = useCallback((index: number, q: number) => {
    setFilters((current) =>
      current.map((filter, itemIndex) =>
        itemIndex === index ? { ...filter, q } : filter,
      ),
    );
  }, []);

  return {
    filters,
    addFilter,
    removeFilter,
    updateFilterType,
    updateFilterFrequency,
    updateFilterQ,
  };
}

export default useEffectControl;
