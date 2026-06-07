import { useCallback, useState } from 'react';
import {
  DEFAULT_REVERB_EARLY_REFLECTION_DELAY,
  DEFAULT_REVERB_EARLY_REFLECTION_GAIN,
} from '../../../constants/synth';
import { createDefaultReverbConfig } from '../../../services/synth/config/Defaults';
import type { BuiltInReverbPreset, ReverbConfig } from '../../../types';
import { removeItemAt, updateItemAt } from '../../../utils/collection';

function useReverbControl(initialReverb?: ReverbConfig | null) {
  const [reverb, setReverb] = useState<ReverbConfig>(
    () => initialReverb ?? createDefaultReverbConfig(),
  );

  const updateReverbPreset = useCallback((preset: BuiltInReverbPreset) => {
    setReverb((current) => createDefaultReverbConfig(preset, current.mix));
  }, []);

  const updateReverbMix = useCallback((mix: number) => {
    setReverb((current) => ({ ...current, mix }));
  }, []);

  const addReverbEarlyReflection = useCallback(() => {
    setReverb((current) => ({
      ...current,
      preset: 'custom',
      earlyReflections: [
        ...current.earlyReflections,
        {
          delay: DEFAULT_REVERB_EARLY_REFLECTION_DELAY,
          gain: DEFAULT_REVERB_EARLY_REFLECTION_GAIN,
        },
      ],
    }));
  }, []);

  const removeReverbEarlyReflection = useCallback((index: number) => {
    setReverb((current) => ({
      ...current,
      preset: 'custom',
      earlyReflections: removeItemAt(current.earlyReflections, index),
    }));
  }, []);

  const updateReverbEarlyReflectionDelay = useCallback(
    (index: number, delay: number) => {
      setReverb((current) => ({
        ...current,
        preset: 'custom',
        earlyReflections: updateItemAt(
          current.earlyReflections,
          index,
          (reflection) => ({ ...reflection, delay }),
        ),
      }));
    },
    [],
  );

  const updateReverbEarlyReflectionGain = useCallback(
    (index: number, gain: number) => {
      setReverb((current) => ({
        ...current,
        preset: 'custom',
        earlyReflections: updateItemAt(
          current.earlyReflections,
          index,
          (reflection) => ({ ...reflection, gain }),
        ),
      }));
    },
    [],
  );

  const updateReverbLateTailDuration = useCallback((duration: number) => {
    setReverb((current) => ({
      ...current,
      preset: 'custom',
      lateTail: { ...current.lateTail, duration },
    }));
  }, []);

  const updateReverbLateTailDelay = useCallback((delay: number) => {
    setReverb((current) => ({
      ...current,
      preset: 'custom',
      lateTail: { ...current.lateTail, delay },
    }));
  }, []);

  const updateReverbLateTailAmplitude = useCallback((amplitude: number) => {
    setReverb((current) => ({
      ...current,
      preset: 'custom',
      lateTail: { ...current.lateTail, amplitude },
    }));
  }, []);

  const updateReverbLateTailAlpha = useCallback((alpha: number) => {
    setReverb((current) => ({
      ...current,
      preset: 'custom',
      lateTail: { ...current.lateTail, alpha },
    }));
  }, []);

  return {
    reverb,
    updateReverbPreset,
    updateReverbMix,
    addReverbEarlyReflection,
    removeReverbEarlyReflection,
    updateReverbEarlyReflectionDelay,
    updateReverbEarlyReflectionGain,
    updateReverbLateTailDelay,
    updateReverbLateTailDuration,
    updateReverbLateTailAmplitude,
    updateReverbLateTailAlpha,
  };
}

export default useReverbControl;
