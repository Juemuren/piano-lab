import { useCallback, useState } from 'react';
import { createDefaultFilterConfig } from '../../../services/synth/config/Defaults';
import type { FilterConfig, FilterType } from '../../../types';
import { removeItemAt, updateItemAt } from '../../../utils/collection';

function useFilterControl(initialFilters?: FilterConfig[]) {
  const [filters, setFilters] = useState<FilterConfig[]>(
    () => initialFilters ?? [],
  );

  const addFilter = useCallback((type: FilterType) => {
    setFilters((current) => [...current, createDefaultFilterConfig(type)]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters((current) => removeItemAt(current, index));
  }, []);

  const updateFilterType = useCallback((index: number, type: FilterType) => {
    setFilters((current) =>
      updateItemAt(current, index, (filter) => ({ ...filter, type })),
    );
  }, []);

  const updateFilterFrequency = useCallback(
    (index: number, frequency: number) => {
      setFilters((current) =>
        updateItemAt(current, index, (filter) => ({ ...filter, frequency })),
      );
    },
    [],
  );

  const updateFilterQ = useCallback((index: number, q: number) => {
    setFilters((current) =>
      updateItemAt(current, index, (filter) => ({ ...filter, q })),
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

export default useFilterControl;
