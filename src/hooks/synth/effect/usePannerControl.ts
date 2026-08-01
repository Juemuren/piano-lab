import { useCallback, useState } from 'react';
import type { PannerConfig } from '../../../services/synth/effect/Panner';
import { createPannerConfig } from '../../../services/synth/effect/Panner';

function usePannerControl(initialPanner: PannerConfig | null) {
  const [panner, setPanner] = useState<PannerConfig | null>(
    () => initialPanner,
  );

  const updatePannerEnabled = useCallback((enabled: boolean) => {
    setPanner((current) =>
      enabled ? (current ?? createPannerConfig()) : null,
    );
  }, []);

  const updatePannerValue = useCallback(
    <Key extends keyof PannerConfig>(key: Key, value: PannerConfig[Key]) => {
      setPanner((current) => ({
        ...(current ?? createPannerConfig()),
        [key]: value,
      }));
    },
    [],
  );

  return {
    panner,
    updatePannerEnabled,
    updatePannerValue,
  };
}

export default usePannerControl;
