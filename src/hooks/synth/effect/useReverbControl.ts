import { useCallback, useState } from 'react';
import {
  DEFAULT_REVERB_EARLY_REFLECTION_DELAY,
  DEFAULT_REVERB_EARLY_REFLECTION_GAIN,
  DEFAULT_REVERB_EARLY_REFLECTION_PHASE,
} from '../../../constants/synth';
import { createDefaultReverbConfig } from '../../../services/synth/config/Defaults';
import type { ReverbConfig, ReverbPreset } from '../../../types';
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

  const updateReverbPreset = useCallback((preset: ReverbPreset) => {
    setReverb((current) => {
      if (preset !== 'custom') {
        return createDefaultReverbConfig(preset, current?.mix);
      }

      const fallback = createDefaultReverbConfig();
      const source = current ?? fallback;

      return {
        ...source,
        earlyReflections: [],
        lateTail: {
          ...source.lateTail,
          amplitude: 0,
          delay: 0,
        },
        preset,
      };
    });
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
      earlyReflections: [
        ...(current ?? fallback).earlyReflections,
        {
          delay: DEFAULT_REVERB_EARLY_REFLECTION_DELAY,
          gain: DEFAULT_REVERB_EARLY_REFLECTION_GAIN,
          phase: DEFAULT_REVERB_EARLY_REFLECTION_PHASE,
        },
      ],
      preset: 'custom',
    }));
  }, []);

  const removeReverbEarlyReflection = useCallback((index: number) => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      earlyReflections: removeItemAt(
        (current ?? fallback).earlyReflections,
        index,
      ),
      preset: 'custom',
    }));
  }, []);

  const updateReverbEarlyReflectionDelay = useCallback(
    (index: number, delay: number) => {
      const fallback = createDefaultReverbConfig();

      setReverb((current) => ({
        ...(current ?? fallback),
        earlyReflections: updateItemAt(
          (current ?? fallback).earlyReflections,
          index,
          (reflection) => ({ ...reflection, delay }),
        ),
        preset: 'custom',
      }));
    },
    [],
  );

  const updateReverbEarlyReflectionGain = useCallback(
    (index: number, gain: number) => {
      const fallback = createDefaultReverbConfig();

      setReverb((current) => ({
        ...(current ?? fallback),
        earlyReflections: updateItemAt(
          (current ?? fallback).earlyReflections,
          index,
          (reflection) => ({ ...reflection, gain }),
        ),
        preset: 'custom',
      }));
    },
    [],
  );

  const updateReverbEarlyReflectionPhase = useCallback(
    (index: number, phase: number) => {
      const fallback = createDefaultReverbConfig();

      setReverb((current) => ({
        ...(current ?? fallback),
        earlyReflections: updateItemAt(
          (current ?? fallback).earlyReflections,
          index,
          (reflection) => ({ ...reflection, phase }),
        ),
        preset: 'custom',
      }));
    },
    [],
  );

  const updateReverbLateTailDuration = useCallback((duration: number) => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      lateTail: { ...(current ?? fallback).lateTail, duration },
      preset: 'custom',
    }));
  }, []);

  const updateReverbLateTailDelay = useCallback((delay: number) => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      lateTail: { ...(current ?? fallback).lateTail, delay },
      preset: 'custom',
    }));
  }, []);

  const updateReverbLateTailAmplitude = useCallback((amplitude: number) => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      lateTail: { ...(current ?? fallback).lateTail, amplitude },
      preset: 'custom',
    }));
  }, []);

  const updateReverbLateTailAlpha = useCallback((alpha: number) => {
    const fallback = createDefaultReverbConfig();

    setReverb((current) => ({
      ...(current ?? fallback),
      lateTail: { ...(current ?? fallback).lateTail, alpha },
      preset: 'custom',
    }));
  }, []);

  return {
    addReverbEarlyReflection,
    removeReverbEarlyReflection,
    reverb,
    updateReverbEarlyReflectionDelay,
    updateReverbEarlyReflectionGain,
    updateReverbEarlyReflectionPhase,
    updateReverbEnabled,
    updateReverbLateTailAlpha,
    updateReverbLateTailAmplitude,
    updateReverbLateTailDelay,
    updateReverbLateTailDuration,
    updateReverbMix,
    updateReverbPreset,
  };
}

export default useReverbControl;
