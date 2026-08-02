import { useCallback } from 'react';
import type {
  EqualizerType,
  FilterEqualizerPreset,
  FilterType,
} from '../../../services/synth/config/Options';
import type {
  EqualizerConfig,
  FilterConfig,
  FilterEqualizerConfigAction,
} from '../../../services/synth/effect/FilterEqualizer';
import { reduceFilterEqualizerConfig } from '../../../services/synth/effect/FilterEqualizer';
import { useSynthConfigStore } from '../../../stores/synthConfigStore';

function useFilterEqualizerControl() {
  const filterEqualizer = useSynthConfigStore(
    (state) => state.config.effect.filterEqualizer,
  );
  const setEffectConfig = useSynthConfigStore((state) => state.setEffectConfig);
  const dispatch = useCallback(
    (action: FilterEqualizerConfigAction) => {
      setEffectConfig((effect) => ({
        ...effect,
        filterEqualizer: reduceFilterEqualizerConfig(
          effect.filterEqualizer,
          action,
        ),
      }));
    },
    [setEffectConfig],
  );

  const updateFilterEqualizerEnabled = useCallback(
    (enabled: boolean) => {
      dispatch({ enabled, type: 'setEnabled' });
    },
    [dispatch],
  );

  const updateFilterEqualizerPreset = useCallback(
    (preset: FilterEqualizerPreset) => {
      dispatch({ preset, type: 'setPreset' });
    },
    [dispatch],
  );

  const addFilter = useCallback(
    (type: FilterType) => {
      dispatch({ filterType: type, type: 'addFilter' });
    },
    [dispatch],
  );

  const removeFilter = useCallback(
    (index: number) => {
      dispatch({ index, type: 'removeFilter' });
    },
    [dispatch],
  );

  const updateFilter = useCallback(
    <Key extends keyof FilterConfig>(
      index: number,
      key: Key,
      value: FilterConfig[Key],
    ) => {
      dispatch({ index, patch: { [key]: value }, type: 'updateFilter' });
    },
    [dispatch],
  );

  const addEqualizer = useCallback(
    (type: EqualizerType) => {
      dispatch({ equalizerType: type, type: 'addEqualizer' });
    },
    [dispatch],
  );

  const removeEqualizer = useCallback(
    (index: number) => {
      dispatch({ index, type: 'removeEqualizer' });
    },
    [dispatch],
  );

  const updateEqualizer = useCallback(
    <Key extends keyof EqualizerConfig>(
      index: number,
      key: Key,
      value: EqualizerConfig[Key],
    ) => {
      dispatch({ index, patch: { [key]: value }, type: 'updateEqualizer' });
    },
    [dispatch],
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
