import { useCallback } from 'react';
import type { PannerConfig } from '../../../services/synth/effect/Panner';
import { createPannerConfig } from '../../../services/synth/effect/Panner';
import useEffectSection from './useEffectSection';

function usePannerControl() {
  const [panner, setPanner] = useEffectSection('panner');

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
