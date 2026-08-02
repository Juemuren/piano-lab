import { useCallback } from 'react';
import type { WaveShaperPreset } from '../../../services/synth/config/Options';
import type { WaveShaperConfig } from '../../../services/synth/effect/WaveShaper';
import { createWaveShaperConfig } from '../../../services/synth/effect/WaveShaper';
import { useSynthConfigStore } from '../../../stores/synthConfigStore';

function useWaveShaperControl() {
  const waveShaper = useSynthConfigStore(
    (state) => state.config.effect.waveShaper,
  );
  const setEffectConfig = useSynthConfigStore((state) => state.setEffectConfig);
  const setWaveShaper = useCallback(
    (update: (current: WaveShaperConfig | null) => WaveShaperConfig | null) => {
      setEffectConfig((effect) => ({
        ...effect,
        waveShaper: update(effect.waveShaper),
      }));
    },
    [setEffectConfig],
  );

  const updateWaveShaperEnabled = useCallback(
    (enabled: boolean) => {
      setWaveShaper((current) =>
        enabled ? (current ?? createWaveShaperConfig()) : null,
      );
    },
    [setWaveShaper],
  );

  const updateWaveShaperPreset = useCallback(
    (preset: WaveShaperPreset) => {
      setWaveShaper((current) => ({
        ...(current ?? createWaveShaperConfig()),
        preset,
      }));
    },
    [setWaveShaper],
  );

  const updateWaveShaperValue = useCallback(
    <Key extends Exclude<keyof WaveShaperConfig, 'preset'>>(
      key: Key,
      value: WaveShaperConfig[Key],
    ) => {
      setWaveShaper((current) => ({
        ...(current ?? createWaveShaperConfig()),
        [key]: value,
      }));
    },
    [setWaveShaper],
  );

  return {
    updateWaveShaperEnabled,
    updateWaveShaperPreset,
    updateWaveShaperValue,
    waveShaper,
  };
}

export default useWaveShaperControl;
