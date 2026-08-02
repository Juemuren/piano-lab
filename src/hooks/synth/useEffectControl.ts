import useCompressorControl from './effect/useCompressorControl';
import useFilterEqualizerControl from './effect/useFilterEqualizerControl';
import useModulationControl from './effect/useModulationControl';
import usePannerControl from './effect/usePannerControl';
import useReverbControl from './effect/useReverbControl';
import useWaveShaperControl from './effect/useWaveShaperControl';

function useEffectControl() {
  const filterEqualizerControl = useFilterEqualizerControl();
  const modulationControl = useModulationControl();
  const compressorControl = useCompressorControl();
  const waveShaperControl = useWaveShaperControl();
  const pannerControl = usePannerControl();
  const reverbControl = useReverbControl();
  return {
    compressorControl,
    filterEqualizerControl,
    modulationControl,
    pannerControl,
    reverbControl,
    waveShaperControl,
  };
}

export default useEffectControl;
