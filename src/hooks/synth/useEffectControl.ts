import { useEffect, useMemo } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';
import { createDefaultEffectConfig } from '../../services/synth/config/Defaults';
import type { EffectConfig } from '../../types';
import useCompressorControl from './effect/useCompressorControl';
import useEqualizerControl from './effect/useEqualizerControl';
import useFilterControl from './effect/useFilterControl';
import usePannerControl from './effect/usePannerControl';
import useReverbControl from './effect/useReverbControl';

function useEffectControl(
  initialConfig?: EffectConfig | null,
  onConfigChange?: (config: EffectConfig) => void,
) {
  const synthEngine = useSynthEngine();
  const resolvedInitialConfig = useMemo(
    () => initialConfig ?? createDefaultEffectConfig(),
    [initialConfig],
  );
  const filterControl = useFilterControl(resolvedInitialConfig.filters);
  const equalizerControl = useEqualizerControl(
    resolvedInitialConfig.equalizers,
  );
  const compressorControl = useCompressorControl(
    resolvedInitialConfig.compressor,
  );
  const pannerControl = usePannerControl(resolvedInitialConfig.panner);
  const reverbControl = useReverbControl(resolvedInitialConfig.reverb);

  const effectConfig = useMemo<EffectConfig>(
    () => ({
      filters: filterControl.filters,
      equalizers: equalizerControl.equalizers,
      compressor: compressorControl.compressor,
      panner: pannerControl.panner,
      reverb: reverbControl.reverb,
    }),
    [
      compressorControl.compressor,
      equalizerControl.equalizers,
      filterControl.filters,
      pannerControl.panner,
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
    ...pannerControl,
    ...reverbControl,
  };
}

export default useEffectControl;
