import { useCallback } from 'react';
import type {
  PannerConfig,
  PannerConfigAction,
} from '../../../services/synth/effect/Panner';
import { reducePannerConfig } from '../../../services/synth/effect/Panner';
import useEffectSectionReducer from './useEffectSectionReducer';

function usePannerControl() {
  const [panner, dispatch] = useEffectSectionReducer<
    'panner',
    PannerConfigAction
  >('panner', reducePannerConfig);

  const updatePannerEnabled = useCallback(
    (enabled: boolean) => {
      dispatch({ enabled, type: 'setEnabled' });
    },
    [dispatch],
  );

  const updatePannerValue = useCallback(
    <Key extends keyof PannerConfig>(key: Key, value: PannerConfig[Key]) => {
      dispatch({ patch: { [key]: value }, type: 'update' });
    },
    [dispatch],
  );

  return {
    panner,
    updatePannerEnabled,
    updatePannerValue,
  };
}

export default usePannerControl;
