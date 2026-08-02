import { useCallback, useReducer } from 'react';
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
import { reduceFilterEqualizerConfig } from '../../../services/synth/effect/FilterEqualizer';

function useFilterEqualizerControl(
  initialFilterEqualizer: FilterEqualizerConfig | null,
) {
  const [filterEqualizer, dispatch] = useReducer(
    reduceFilterEqualizerConfig,
    initialFilterEqualizer,
  );

  const updateFilterEqualizerEnabled = useCallback((enabled: boolean) => {
    dispatch({ enabled, type: 'setEnabled' });
  }, []);

  const updateFilterEqualizerPreset = useCallback(
    (preset: FilterEqualizerPreset) => {
      dispatch({ preset, type: 'setPreset' });
    },
    [],
  );

  const addFilter = useCallback((type: FilterType) => {
    dispatch({ filterType: type, type: 'addFilter' });
  }, []);

  const removeFilter = useCallback((index: number) => {
    dispatch({ index, type: 'removeFilter' });
  }, []);

  const updateFilter = useCallback(
    <Key extends keyof FilterConfig>(
      index: number,
      key: Key,
      value: FilterConfig[Key],
    ) => {
      dispatch({ index, patch: { [key]: value }, type: 'updateFilter' });
    },
    [],
  );

  const addEqualizer = useCallback((type: EqualizerType) => {
    dispatch({ equalizerType: type, type: 'addEqualizer' });
  }, []);

  const removeEqualizer = useCallback((index: number) => {
    dispatch({ index, type: 'removeEqualizer' });
  }, []);

  const updateEqualizer = useCallback(
    <Key extends keyof EqualizerConfig>(
      index: number,
      key: Key,
      value: EqualizerConfig[Key],
    ) => {
      dispatch({ index, patch: { [key]: value }, type: 'updateEqualizer' });
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
