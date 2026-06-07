import { useCallback, useState } from 'react';
import { createDefaultEqualizerConfig } from '../../../services/synth/config/Defaults';
import type { EqualizerConfig, EqualizerType } from '../../../types';
import { removeItemAt, updateItemAt } from '../../../utils/collection';

function useEqualizerControl(initialEqualizers: EqualizerConfig[]) {
  const [equalizers, setEqualizers] = useState<EqualizerConfig[]>(
    () => initialEqualizers,
  );

  const addEqualizer = useCallback((type: EqualizerType) => {
    setEqualizers((current) => [
      ...current,
      createDefaultEqualizerConfig(type),
    ]);
  }, []);

  const removeEqualizer = useCallback((index: number) => {
    setEqualizers((current) => removeItemAt(current, index));
  }, []);

  const updateEqualizerType = useCallback(
    (index: number, type: EqualizerType) => {
      setEqualizers((current) =>
        updateItemAt(current, index, (equalizer) => ({ ...equalizer, type })),
      );
    },
    [],
  );

  const updateEqualizerFrequency = useCallback(
    (index: number, frequency: number) => {
      setEqualizers((current) =>
        updateItemAt(current, index, (equalizer) => ({
          ...equalizer,
          frequency,
        })),
      );
    },
    [],
  );

  const updateEqualizerQ = useCallback((index: number, q: number) => {
    setEqualizers((current) =>
      updateItemAt(current, index, (equalizer) => ({ ...equalizer, q })),
    );
  }, []);

  const updateEqualizerGain = useCallback((index: number, gain: number) => {
    setEqualizers((current) =>
      updateItemAt(current, index, (equalizer) => ({ ...equalizer, gain })),
    );
  }, []);

  return {
    equalizers,
    addEqualizer,
    removeEqualizer,
    updateEqualizerType,
    updateEqualizerFrequency,
    updateEqualizerQ,
    updateEqualizerGain,
  };
}

export default useEqualizerControl;
