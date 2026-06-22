import { useEffect, useMemo } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';
import { createDefaultEffectConfig } from '../../services/synth/config/Defaults';
import type { EffectConfig } from '../../types';
import useCompressorControl from './effect/useCompressorControl';
import useEqualizerControl from './effect/useEqualizerControl';
import useFilterControl from './effect/useFilterControl';
import useModulationControl from './effect/useModulationControl';
import usePannerControl from './effect/usePannerControl';
import useReverbControl from './effect/useReverbControl';
import useWaveShaperControl from './effect/useWaveShaperControl';

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
  const modulationControl = useModulationControl(
    resolvedInitialConfig.amplitudeModulation,
    resolvedInitialConfig.frequencyModulation,
    resolvedInitialConfig.phaseModulation,
    resolvedInitialConfig.delayModulation,
  );
  const compressorControl = useCompressorControl(
    resolvedInitialConfig.compressor,
  );
  const waveShaperControl = useWaveShaperControl(
    resolvedInitialConfig.waveShaper,
  );
  const pannerControl = usePannerControl(resolvedInitialConfig.panner);
  const reverbControl = useReverbControl(resolvedInitialConfig.reverb);

  const effectConfig = useMemo<EffectConfig>(
    () => ({
      amplitudeModulation: modulationControl.amplitudeModulation,
      compressor: compressorControl.compressor,
      delayModulation: modulationControl.delayModulation,
      equalizers: equalizerControl.equalizers,
      filters: filterControl.filters,
      frequencyModulation: modulationControl.frequencyModulation,
      panner: pannerControl.panner,
      phaseModulation: modulationControl.phaseModulation,
      reverb: reverbControl.reverb,
      waveShaper: waveShaperControl.waveShaper,
    }),
    [
      compressorControl.compressor,
      equalizerControl.equalizers,
      filterControl.filters,
      modulationControl.amplitudeModulation,
      modulationControl.frequencyModulation,
      modulationControl.phaseModulation,
      modulationControl.delayModulation,
      pannerControl.panner,
      reverbControl.reverb,
      waveShaperControl.waveShaper,
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
    ...modulationControl,
    ...waveShaperControl,
    ...compressorControl,
    ...pannerControl,
    ...reverbControl,
  };
}

export default useEffectControl;
