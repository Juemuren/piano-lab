import { useCallback, useReducer } from 'react';
import type { ReverbPreset } from '../../../services/synth/config/Options';
import type {
  ReverbConfig,
  ReverbEarlyReflectionConfig,
  ReverbLateTailConfig,
} from '../../../services/synth/effect/Reverb';
import { reduceReverbConfig } from '../../../services/synth/effect/Reverb';

function useReverbControl(initialReverb: ReverbConfig | null) {
  const [reverb, dispatch] = useReducer(reduceReverbConfig, initialReverb);

  const updateReverbEnabled = useCallback((enabled: boolean) => {
    dispatch({ enabled, type: 'setEnabled' });
  }, []);

  const updateReverbPreset = useCallback((preset: ReverbPreset) => {
    dispatch({ preset, type: 'setPreset' });
  }, []);

  const updateReverbMix = useCallback((mix: number) => {
    dispatch({ mix, type: 'setMix' });
  }, []);

  const addReverbEarlyReflection = useCallback(() => {
    dispatch({ type: 'addEarlyReflection' });
  }, []);

  const removeReverbEarlyReflection = useCallback((index: number) => {
    dispatch({ index, type: 'removeEarlyReflection' });
  }, []);

  const updateReverbEarlyReflection = useCallback(
    <Key extends keyof ReverbEarlyReflectionConfig>(
      index: number,
      key: Key,
      value: ReverbEarlyReflectionConfig[Key],
    ) => {
      dispatch({
        index,
        patch: { [key]: value },
        type: 'updateEarlyReflection',
      });
    },
    [],
  );

  const updateReverbLateTail = useCallback(
    <Key extends keyof ReverbLateTailConfig>(
      key: Key,
      value: ReverbLateTailConfig[Key],
    ) => {
      dispatch({ patch: { [key]: value }, type: 'updateLateTail' });
    },
    [],
  );

  return {
    addReverbEarlyReflection,
    removeReverbEarlyReflection,
    reverb,
    updateReverbEarlyReflection,
    updateReverbEnabled,
    updateReverbLateTail,
    updateReverbMix,
    updateReverbPreset,
  };
}

export default useReverbControl;
