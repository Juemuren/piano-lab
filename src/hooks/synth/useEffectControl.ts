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
  DEFAULT_REVERB_EFFECT_MIX,
  DEFAULT_REVERB_EFFECT_PRESET,
} from '../../constants/synth';
import type {
  EffectConfig,
  EqualizerEffectConfig,
  EqualizerEffectType,
  FilterEffectConfig,
  FilterEffectType,
  ReverbEffectConfig,
  ReverbEffectPreset,
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
  preset: ReverbEffectPreset = DEFAULT_REVERB_EFFECT_PRESET,
): ReverbEffectConfig {
  return {
    preset,
    mix: DEFAULT_REVERB_EFFECT_MIX,
  };
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
  const [reverb, setReverb] = useState<ReverbEffectConfig | null>(
    () => initialConfig?.reverb ?? null,
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

  const addReverb = useCallback((preset: ReverbEffectPreset) => {
    setReverb(createDefaultReverbConfig(preset));
  }, []);

  const removeReverb = useCallback(() => {
    setReverb(null);
  }, []);

  const updateReverbPreset = useCallback((preset: ReverbEffectPreset) => {
    setReverb((current) =>
      current ? { ...current, preset } : createDefaultReverbConfig(preset),
    );
  }, []);

  const updateReverbMix = useCallback((mix: number) => {
    setReverb((current) => (current ? { ...current, mix } : current));
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
    addReverb,
    removeReverb,
    updateReverbPreset,
    updateReverbMix,
  };
}

export default useEffectControl;
