import { useCallback } from 'react';
import type { PannerConfig } from '../../../services/synth/effect/Panner';
import { createPannerConfig } from '../../../services/synth/effect/Panner';
import { useSynthConfigStore } from '../../../stores/synthConfigStore';

function usePannerControl() {
  const panner = useSynthConfigStore((state) => state.config.effect.panner);
  const setEffectConfig = useSynthConfigStore((state) => state.setEffectConfig);
  const setPanner = useCallback(
    (update: (current: PannerConfig | null) => PannerConfig | null) => {
      setEffectConfig((effect) => ({
        ...effect,
        panner: update(effect.panner),
      }));
    },
    [setEffectConfig],
  );

  const updatePannerEnabled = useCallback(
    (enabled: boolean) => {
      setPanner((current) =>
        enabled ? (current ?? createPannerConfig()) : null,
      );
    },
    [setPanner],
  );

  const updatePannerValue = useCallback(
    <Key extends keyof PannerConfig>(key: Key, value: PannerConfig[Key]) => {
      setPanner((current) => ({
        ...(current ?? createPannerConfig()),
        [key]: value,
      }));
    },
    [setPanner],
  );

  return {
    panner,
    updatePannerEnabled,
    updatePannerValue,
  };
}

export default usePannerControl;
