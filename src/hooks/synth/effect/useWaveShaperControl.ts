import { useCallback } from 'react';
import type { WaveShaperPreset } from '../../../services/synth/config/Options';
import type {
  WaveShaperConfig,
  WaveShaperConfigAction,
} from '../../../services/synth/effect/WaveShaper';
import { reduceWaveShaperConfig } from '../../../services/synth/effect/WaveShaper';
import useEffectSectionReducer from './useEffectSectionReducer';

function useWaveShaperControl() {
  const [waveShaper, dispatch] = useEffectSectionReducer<
    'waveShaper',
    WaveShaperConfigAction
  >('waveShaper', reduceWaveShaperConfig);

  const updateWaveShaperEnabled = useCallback(
    (enabled: boolean) => {
      dispatch({ enabled, type: 'setEnabled' });
    },
    [dispatch],
  );

  const updateWaveShaperPreset = useCallback(
    (preset: WaveShaperPreset) => {
      dispatch({ patch: { preset }, type: 'update' });
    },
    [dispatch],
  );

  const updateWaveShaperValue = useCallback(
    <Key extends Exclude<keyof WaveShaperConfig, 'preset'>>(
      key: Key,
      value: WaveShaperConfig[Key],
    ) => {
      dispatch({ patch: { [key]: value }, type: 'update' });
    },
    [dispatch],
  );

  return {
    updateWaveShaperEnabled,
    updateWaveShaperPreset,
    updateWaveShaperValue,
    waveShaper,
  };
}

export default useWaveShaperControl;
