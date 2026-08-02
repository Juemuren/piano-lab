import { useCallback } from 'react';
import type { ReverbPreset } from '../../../services/synth/config/Options';
import type {
  ReverbConfigAction,
  ReverbEarlyReflectionConfig,
  ReverbLateTailConfig,
} from '../../../services/synth/effect/Reverb';
import { reduceReverbConfig } from '../../../services/synth/effect/Reverb';
import { useSynthConfigStore } from '../../../stores/synthConfigStore';

function useReverbControl() {
  const reverb = useSynthConfigStore((state) => state.config.effect.reverb);
  const setEffectConfig = useSynthConfigStore((state) => state.setEffectConfig);
  const dispatch = useCallback(
    (action: ReverbConfigAction) => {
      setEffectConfig((effect) => ({
        ...effect,
        reverb: reduceReverbConfig(effect.reverb, action),
      }));
    },
    [setEffectConfig],
  );

  const updateReverbEnabled = useCallback(
    (enabled: boolean) => {
      dispatch({ enabled, type: 'setEnabled' });
    },
    [dispatch],
  );

  const updateReverbPreset = useCallback(
    (preset: ReverbPreset) => {
      dispatch({ preset, type: 'setPreset' });
    },
    [dispatch],
  );

  const updateReverbMix = useCallback(
    (mix: number) => {
      dispatch({ mix, type: 'setMix' });
    },
    [dispatch],
  );

  const addReverbEarlyReflection = useCallback(() => {
    dispatch({ type: 'addEarlyReflection' });
  }, [dispatch]);

  const removeReverbEarlyReflection = useCallback(
    (index: number) => {
      dispatch({ index, type: 'removeEarlyReflection' });
    },
    [dispatch],
  );

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
    [dispatch],
  );

  const updateReverbLateTail = useCallback(
    <Key extends keyof ReverbLateTailConfig>(
      key: Key,
      value: ReverbLateTailConfig[Key],
    ) => {
      dispatch({ patch: { [key]: value }, type: 'updateLateTail' });
    },
    [dispatch],
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
