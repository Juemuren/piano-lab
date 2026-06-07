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

  const updatePannerPan = useCallback((pan: number) => {
    setPanner((current) =>
      current ? { ...current, pan } : createDefaultPannerConfig(),
    );
  }, []);

  return {
    panner,
    updatePannerEnabled,
    updatePannerPan,
  };
}

export default usePannerControl;
