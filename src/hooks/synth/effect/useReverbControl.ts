import { useCallback, useState } from 'react';
import type { ReverbPreset } from '../../../services/synth/config/Options';
import type {
  ReverbConfig,
  ReverbEarlyReflectionConfig,
  ReverbLateTailConfig,
} from '../../../services/synth/effect/Reverb';
import {
  changeReverbPreset,
  createReverbConfig,
  createReverbEarlyReflectionConfig,
} from '../../../services/synth/effect/Reverb';
import { removeItemAt, updateItemAt } from '../../../utils/collection';

function getReverbConfig(config: ReverbConfig | null) {
  return config ?? createReverbConfig();
}

function useReverbControl(initialReverb: ReverbConfig | null) {
  const [reverb, setReverb] = useState<ReverbConfig | null>(
    () => initialReverb,
  );

  const updateReverbEnabled = useCallback((enabled: boolean) => {
    setReverb((current) =>
      enabled ? (current ?? createReverbConfig()) : null,
    );
  }, []);

  const updateReverbPreset = useCallback((preset: ReverbPreset) => {
    setReverb((current) => changeReverbPreset(current, preset));
  }, []);

  const updateReverbMix = useCallback((mix: number) => {
    setReverb((current) => ({
      ...getReverbConfig(current),
      mix,
    }));
  }, []);

  const addReverbEarlyReflection = useCallback(() => {
    setReverb((current) => {
      const source = getReverbConfig(current);

      return {
        ...source,
        earlyReflections: [
          ...source.earlyReflections,
          createReverbEarlyReflectionConfig(),
        ],
        preset: 'custom',
      };
    });
  }, []);

  const removeReverbEarlyReflection = useCallback((index: number) => {
    setReverb((current) => {
      const source = getReverbConfig(current);

      return {
        ...source,
        earlyReflections: removeItemAt(source.earlyReflections, index),
        preset: 'custom',
      };
    });
  }, []);

  const updateReverbEarlyReflection = useCallback(
    <Key extends keyof ReverbEarlyReflectionConfig>(
      index: number,
      key: Key,
      value: ReverbEarlyReflectionConfig[Key],
    ) => {
      setReverb((current) => {
        const source = getReverbConfig(current);

        return {
          ...source,
          earlyReflections: updateItemAt(
            source.earlyReflections,
            index,
            (reflection) => ({
              ...reflection,
              [key]: value,
            }),
          ),
          preset: 'custom',
        };
      });
    },
    [],
  );

  const updateReverbLateTail = useCallback(
    <Key extends keyof ReverbLateTailConfig>(
      key: Key,
      value: ReverbLateTailConfig[Key],
    ) => {
      setReverb((current) => {
        const source = getReverbConfig(current);

        return {
          ...source,
          lateTail: { ...source.lateTail, [key]: value },
          preset: 'custom',
        };
      });
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
