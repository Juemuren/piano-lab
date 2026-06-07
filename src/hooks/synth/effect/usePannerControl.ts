import { useCallback, useState } from 'react';
import { createDefaultPannerConfig } from '../../../services/synth/config/Defaults';
import type { PannerConfig } from '../../../types';

function usePannerControl(initialPanner?: PannerConfig | null) {
  const [panner, setPanner] = useState<PannerConfig | null>(
    () => initialPanner ?? null,
  );

  const updatePannerEnabled = useCallback((enabled: boolean) => {
    setPanner((current) =>
      enabled ? (current ?? createDefaultPannerConfig()) : null,
    );
  }, []);

  const updatePannerValue = useCallback(
    <Key extends keyof PannerConfig>(key: Key, value: PannerConfig[Key]) => {
      setPanner((current) => ({
        ...(current ?? createDefaultPannerConfig()),
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
