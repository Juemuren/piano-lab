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
    resolvedInitialConfig.tremolo,
    resolvedInitialConfig.vibrato,
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
      filters: filterControl.filters,
      equalizers: equalizerControl.equalizers,
      tremolo: modulationControl.tremolo,
      vibrato: modulationControl.vibrato,
      phaseModulation: modulationControl.phaseModulation,
      delayModulation: modulationControl.delayModulation,
      waveShaper: waveShaperControl.waveShaper,
      compressor: compressorControl.compressor,
      panner: pannerControl.panner,
      reverb: reverbControl.reverb,
    }),
    [
      compressorControl.compressor,
      equalizerControl.equalizers,
      filterControl.filters,
      modulationControl.tremolo,
      modulationControl.vibrato,
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
