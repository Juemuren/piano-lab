import { useCallback, useState } from 'react';
import { createDefaultWaveShaperConfig } from '../../../services/synth/config/Factories';
import type { WaveShaperPreset } from '../../../services/synth/config/Options';
import type { WaveShaperConfig } from '../../../services/synth/effect/WaveShaper';

function useWaveShaperControl(initialWaveShaper: WaveShaperConfig | null) {
  const [waveShaper, setWaveShaper] = useState<WaveShaperConfig | null>(
    () => initialWaveShaper,
  );

  const updateWaveShaperEnabled = useCallback((enabled: boolean) => {
    setWaveShaper((current) =>
      enabled ? (current ?? createDefaultWaveShaperConfig()) : null,
    );
  }, []);

  const updateWaveShaperPreset = useCallback((preset: WaveShaperPreset) => {
    setWaveShaper((current) => ({
      ...(current ?? createDefaultWaveShaperConfig()),
      preset,
    }));
  }, []);

  const updateWaveShaperValue = useCallback(
    <Key extends Exclude<keyof WaveShaperConfig, 'preset'>>(
      key: Key,
      value: WaveShaperConfig[Key],
    ) => {
      setWaveShaper((current) => ({
        ...(current ?? createDefaultWaveShaperConfig()),
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
