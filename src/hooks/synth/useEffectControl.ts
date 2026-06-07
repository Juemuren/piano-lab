import { useEffect, useMemo } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';
import type { EffectConfig } from '../../types';
import useCompressorControl from './effect/useCompressorControl';
import useEqualizerControl from './effect/useEqualizerControl';
import useFilterControl from './effect/useFilterControl';
import useReverbControl from './effect/useReverbControl';

function useEffectControl(
  initialConfig?: EffectConfig | null,
  onConfigChange?: (config: EffectConfig) => void,
) {
  const synthEngine = useSynthEngine();
  const filterControl = useFilterControl(initialConfig?.filters);
  const equalizerControl = useEqualizerControl(initialConfig?.equalizers);
  const compressorControl = useCompressorControl(initialConfig?.compressor);
  const reverbControl = useReverbControl(initialConfig?.reverb);

  const effectConfig = useMemo<EffectConfig>(
    () => ({
      filters: filterControl.filters,
      equalizers: equalizerControl.equalizers,
      compressor: compressorControl.compressor,
      reverb: reverbControl.reverb,
    }),
    [
      compressorControl.compressor,
      equalizerControl.equalizers,
      filterControl.filters,
      reverbControl.reverb,
    ],
  );

  useEffect(() => {
    synthEngine.configureEffect(effectConfig);
  }, [effectConfig, synthEngine]);

  useEffect(() => {
    onConfigChange?.(effectConfig);
  }, [effectConfig, onConfigChange]);

  return {
    ...filterControl,
    ...equalizerControl,
    ...compressorControl,
    ...reverbControl,
  };
}

export default useEffectControl;
