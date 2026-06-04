import { useEffect, useMemo, useState } from 'react';
import type {
  Effect,
  EffectConfig,
  EffectParamUpdates,
  EffectType,
} from '../../types';
import { createEffect } from '../../services/synth/SynthDefinitions';
import { useSynthEngine } from '../../contexts/synthEngine';
import {
  DEFAULT_EFFECT_TYPE,
  DEFAULT_EFFECT_BASE_FREQUENCY_HZ,
  DEFAULT_EFFECT_DELAY_MS,
  DEFAULT_EFFECT_MAX_FREQUENCY_HZ,
  DEFAULT_EFFECT_MIN_FREQUENCY_HZ,
  DEFAULT_EFFECT_ATTENUATION,
} from '../../constants';

function useEffectControl(
  harmonicCount: number,
  initialConfig?: EffectConfig | null,
  onConfigChange?: (config: EffectConfig) => void,
) {
  const synthEngine = useSynthEngine();
  const [baseFrequency, setBaseFrequency] = useState<number>(
    () => initialConfig?.baseFrequency ?? DEFAULT_EFFECT_BASE_FREQUENCY_HZ,
  );
  const [effectType, setEffectType] = useState<EffectType>(
    () => initialConfig?.type ?? DEFAULT_EFFECT_TYPE,
  );
  const [tau, setTau] = useState(
    () => initialConfig?.tau ?? DEFAULT_EFFECT_DELAY_MS,
  );
  const [alpha, setAlpha] = useState(
    () => initialConfig?.alpha ?? DEFAULT_EFFECT_ATTENUATION,
  );
  const [minFrequency, setMinFrequency] = useState(
    () => initialConfig?.minFrequency ?? DEFAULT_EFFECT_MIN_FREQUENCY_HZ,
  );
  const [maxFrequency, setMaxFrequency] = useState(
    () => initialConfig?.maxFrequency ?? DEFAULT_EFFECT_MAX_FREQUENCY_HZ,
  );

  const effect = useMemo<Effect>(
    () =>
      createEffect(
        {
          type: effectType,
          tau,
          alpha,
          minFrequency,
          maxFrequency,
          baseFrequency,
        },
        harmonicCount,
      ),
    [
      alpha,
      baseFrequency,
      harmonicCount,
      maxFrequency,
      minFrequency,
      tau,
      effectType,
    ],
  );

  const effectConfig = useMemo<EffectConfig>(
    () => ({
      type: effectType,
      tau,
      alpha,
      minFrequency,
      maxFrequency,
      baseFrequency,
    }),
    [alpha, baseFrequency, maxFrequency, minFrequency, tau, effectType],
  );

  useEffect(() => {
    synthEngine.setEffect(effect, effectConfig);
  }, [synthEngine, effect, effectConfig]);

  useEffect(() => {
    onConfigChange?.(effectConfig);
  }, [onConfigChange, effectConfig]);

  const handleEffectTypeChange = (type: EffectType) => {
    setEffectType(type);
  };

  const handleParamsChange = (updates: EffectParamUpdates) => {
    if (updates.tau !== undefined) setTau(updates.tau);
    if (updates.alpha !== undefined) setAlpha(updates.alpha);
    if (updates.minFrequency !== undefined) {
      setMinFrequency(updates.minFrequency);
    }
    if (updates.maxFrequency !== undefined) {
      setMaxFrequency(updates.maxFrequency);
    }
    if (updates.baseFrequency !== undefined) {
      setBaseFrequency(updates.baseFrequency);
    }
  };

  return {
    baseFrequency,
    effectConfig,
    effect,
    handleEffectTypeChange,
    handleParamsChange,
  };
}

export default useEffectControl;
