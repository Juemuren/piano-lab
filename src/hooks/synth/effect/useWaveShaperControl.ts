import { useCallback, useState } from 'react';
import type { WaveShaperPreset } from '../../../services/synth/config/Options';
import type { WaveShaperConfig } from '../../../services/synth/effect/WaveShaper';
import { createWaveShaperConfig } from '../../../services/synth/effect/WaveShaper';

function useWaveShaperControl(initialWaveShaper: WaveShaperConfig | null) {
  const [waveShaper, setWaveShaper] = useState<WaveShaperConfig | null>(
    () => initialWaveShaper,
  );

  const updateWaveShaperEnabled = useCallback((enabled: boolean) => {
    setWaveShaper((current) =>
      enabled ? (current ?? createWaveShaperConfig()) : null,
    );
  }, []);

  const updateWaveShaperPreset = useCallback((preset: WaveShaperPreset) => {
    setWaveShaper((current) => ({
      ...(current ?? createWaveShaperConfig()),
      preset,
    }));
  }, []);

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
    [],
  );

  return {
    updateWaveShaperEnabled,
    updateWaveShaperPreset,
    updateWaveShaperValue,
    waveShaper,
  };
}

export default useWaveShaperControl;
