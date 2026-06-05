import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';
import {
  DEFAULT_EQUALIZER_EFFECT_FREQUENCY,
  DEFAULT_EQUALIZER_EFFECT_GAIN,
  DEFAULT_EQUALIZER_EFFECT_Q,
  DEFAULT_EQUALIZER_EFFECT_TYPE,
  DEFAULT_FILTER_EFFECT_FREQUENCY,
  DEFAULT_FILTER_EFFECT_Q,
  DEFAULT_FILTER_EFFECT_TYPE,
  DEFAULT_REVERB_EFFECT_PRESET,
  DEFAULT_REVERB_EFFECT_MIX,
  DEFAULT_REVERB_EARLY_REFLECTION_DELAY,
  DEFAULT_REVERB_EARLY_REFLECTION_GAIN,
} from '../../constants/synth';
import { createReverbEffectConfig } from '../../services/synth/ReverbImpulse';
import type {
  BuiltInReverbEffectPreset,
  EffectConfig,
  EqualizerEffectConfig,
  EqualizerEffectType,
  FilterEffectConfig,
  FilterEffectType,
  ReverbEffectConfig,
} from '../../types';

function createDefaultFilterConfig(
  type: FilterEffectType = DEFAULT_FILTER_EFFECT_TYPE,
): FilterEffectConfig {
  return {
    type,
    frequency: DEFAULT_FILTER_EFFECT_FREQUENCY,
    q: DEFAULT_FILTER_EFFECT_Q,
  };
}

function createDefaultEqualizerConfig(
  type: EqualizerEffectType = DEFAULT_EQUALIZER_EFFECT_TYPE,
): EqualizerEffectConfig {
  return {
    type,
    frequency: DEFAULT_EQUALIZER_EFFECT_FREQUENCY,
    q: DEFAULT_EQUALIZER_EFFECT_Q,
    gain: DEFAULT_EQUALIZER_EFFECT_GAIN,
  };
}

function createDefaultReverbConfig(
  preset: BuiltInReverbEffectPreset = DEFAULT_REVERB_EFFECT_PRESET,
  mix = DEFAULT_REVERB_EFFECT_MIX,
): ReverbEffectConfig {
  return createReverbEffectConfig(preset, mix);
}

function useEffectControl(
  initialConfig?: EffectConfig | null,
  onConfigChange?: (config: EffectConfig) => void,
) {
  const synthEngine = useSynthEngine();
  const [filters, setFilters] = useState<FilterEffectConfig[]>(
    () => initialConfig?.filters ?? [],
  );
  const [equalizers, setEqualizers] = useState<EqualizerEffectConfig[]>(
    () => initialConfig?.equalizers ?? [],
  );
  const [reverb, setReverb] = useState<ReverbEffectConfig>(
    () => initialConfig?.reverb ?? createDefaultReverbConfig(),
  );

  const effectConfig = useMemo<EffectConfig>(
    () => ({
      filters,
      equalizers,
      reverb,
    }),
    [equalizers, filters, reverb],
  );

  useEffect(() => {
    synthEngine.configureEffect(effectConfig);
  }, [effectConfig, synthEngine]);

  useEffect(() => {
    onConfigChange?.(effectConfig);
  }, [effectConfig, onConfigChange]);

  const addFilter = useCallback((type: FilterEffectType) => {
    setFilters((current) => [...current, createDefaultFilterConfig(type)]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }, []);

  const updateFilterType = useCallback(
    (index: number, type: FilterEffectType) => {
      setFilters((current) =>
        current.map((filter, itemIndex) =>
          itemIndex === index ? { ...filter, type } : filter,
        ),
      );
    },
    [],
  );

  const updateFilterFrequency = useCallback(
    (index: number, frequency: number) => {
      setFilters((current) =>
        current.map((filter, itemIndex) =>
          itemIndex === index ? { ...filter, frequency } : filter,
        ),
      );
    },
    [],
  );

  const updateFilterQ = useCallback((index: number, q: number) => {
    setFilters((current) =>
      current.map((filter, itemIndex) =>
        itemIndex === index ? { ...filter, q } : filter,
      ),
    );
  }, []);

  const addEqualizer = useCallback((type: EqualizerEffectType) => {
    setEqualizers((current) => [
      ...current,
      createDefaultEqualizerConfig(type),
    ]);
  }, []);

  const removeEqualizer = useCallback((index: number) => {
    setEqualizers((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }, []);

  const updateEqualizerType = useCallback(
    (index: number, type: EqualizerEffectType) => {
      setEqualizers((current) =>
        current.map((equalizer, itemIndex) =>
          itemIndex === index ? { ...equalizer, type } : equalizer,
        ),
      );
    },
    [],
  );

  const updateEqualizerFrequency = useCallback(
    (index: number, frequency: number) => {
      setEqualizers((current) =>
        current.map((equalizer, itemIndex) =>
          itemIndex === index ? { ...equalizer, frequency } : equalizer,
        ),
      );
    },
    [],
  );

  const updateEqualizerQ = useCallback((index: number, q: number) => {
    setEqualizers((current) =>
      current.map((equalizer, itemIndex) =>
        itemIndex === index ? { ...equalizer, q } : equalizer,
      ),
    );
  }, []);

  const updateEqualizerGain = useCallback((index: number, gain: number) => {
    setEqualizers((current) =>
      current.map((equalizer, itemIndex) =>
        itemIndex === index ? { ...equalizer, gain } : equalizer,
      ),
    );
  }, []);

  const updateReverbPreset = useCallback(
    (preset: BuiltInReverbEffectPreset) => {
      setReverb((current) => createDefaultReverbConfig(preset, current.mix));
    },
    [],
  );

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
      earlyReflections: current.earlyReflections.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }, []);

  const updateReverbEarlyReflectionDelay = useCallback(
    (index: number, delay: number) => {
      setReverb((current) => ({
        ...current,
        preset: 'custom',
        earlyReflections: current.earlyReflections.map(
          (reflection, itemIndex) =>
            itemIndex === index ? { ...reflection, delay } : reflection,
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
        earlyReflections: current.earlyReflections.map(
          (reflection, itemIndex) =>
            itemIndex === index ? { ...reflection, gain } : reflection,
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
    filters,
    equalizers,
    reverb,
    addFilter,
    removeFilter,
    updateFilterType,
    updateFilterFrequency,
    updateFilterQ,
    addEqualizer,
    removeEqualizer,
    updateEqualizerType,
    updateEqualizerFrequency,
    updateEqualizerQ,
    updateEqualizerGain,
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

export default useEffectControl;
