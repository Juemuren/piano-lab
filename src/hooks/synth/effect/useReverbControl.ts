import { useCallback, useState } from 'react';
import {
  DEFAULT_REVERB_EARLY_REFLECTION_DELAY,
  DEFAULT_REVERB_EARLY_REFLECTION_GAIN,
} from '../../../constants/synth';
import { createDefaultReverbConfig } from '../../../services/synth/config/Defaults';
import type { BuiltInReverbPreset, ReverbConfig } from '../../../types';
import { removeItemAt, updateItemAt } from '../../../utils/collection';

function useReverbControl(initialReverb: ReverbConfig | null) {
  const [reverb, setReverb] = useState<ReverbConfig | null>(
    () => initialReverb,
  );

  const updateReverbEnabled = useCallback((enabled: boolean) => {
    setReverb((current) =>
      enabled ? (current ?? createDefaultReverbConfig()) : null,
    );
  }, []);

  const updateReverbPreset = useCallback((preset: BuiltInReverbPreset) => {
    setReverb((current) => createDefaultReverbConfig(preset, current?.mix));
  }, []);

  const updateReverbMix = useCallback((mix: number) => {
    setReverb((current) => ({
      ...(current ?? createDefaultReverbConfig()),
      mix,
    }));
  }, []);

  const addReverbEarlyReflection = useCallback(() => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      preset: 'custom',
      earlyReflections: [
        ...(current ?? fallback).earlyReflections,
        {
          delay: DEFAULT_REVERB_EARLY_REFLECTION_DELAY,
          gain: DEFAULT_REVERB_EARLY_REFLECTION_GAIN,
        },
      ],
    }));
  }, []);

  const removeReverbEarlyReflection = useCallback((index: number) => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      preset: 'custom',
      earlyReflections: removeItemAt(
        (current ?? fallback).earlyReflections,
        index,
      ),
    }));
  }, []);

  const updateReverbEarlyReflectionDelay = useCallback(
    (index: number, delay: number) => {
      const fallback = createDefaultReverbConfig();

      setReverb((current) => ({
        ...(current ?? fallback),
        preset: 'custom',
        earlyReflections: updateItemAt(
          (current ?? fallback).earlyReflections,
          index,
          (reflection) => ({ ...reflection, delay }),
        ),
      }));
    },
    [],
  );

  const updateReverbEarlyReflectionGain = useCallback(
    (index: number, gain: number) => {
      const fallback = createDefaultReverbConfig();

      setReverb((current) => ({
        ...(current ?? fallback),
        preset: 'custom',
        earlyReflections: updateItemAt(
          (current ?? fallback).earlyReflections,
          index,
          (reflection) => ({ ...reflection, gain }),
        ),
      }));
    },
    [],
  );

  const updateReverbLateTailDuration = useCallback((duration: number) => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      preset: 'custom',
      lateTail: { ...(current ?? fallback).lateTail, duration },
    }));
  }, []);

  const updateReverbLateTailDelay = useCallback((delay: number) => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      preset: 'custom',
      lateTail: { ...(current ?? fallback).lateTail, delay },
    }));
  }, []);

  const updateReverbLateTailAmplitude = useCallback((amplitude: number) => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      preset: 'custom',
      lateTail: { ...(current ?? fallback).lateTail, amplitude },
    }));
  }, []);

  const updateReverbLateTailAlpha = useCallback((alpha: number) => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      preset: 'custom',
      lateTail: { ...(current ?? fallback).lateTail, alpha },
    }));
  }, []);

  return {
    reverb,
    updateReverbEnabled,
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
