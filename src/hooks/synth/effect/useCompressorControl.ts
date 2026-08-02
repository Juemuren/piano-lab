import { useCallback } from 'react';
import type {
  CompressorConfig,
  CompressorConfigAction,
} from '../../../services/synth/effect/Compressor';
import { reduceCompressorConfig } from '../../../services/synth/effect/Compressor';
import useEffectSectionReducer from './useEffectSectionReducer';

function useCompressorControl() {
  const [compressor, dispatch] = useEffectSectionReducer<
    'compressor',
    CompressorConfigAction
  >('compressor', reduceCompressorConfig);

  const updateCompressorEnabled = useCallback(
    (enabled: boolean) => {
      dispatch({ enabled, type: 'setEnabled' });
    },
    [dispatch],
  );

  const updateCompressor = useCallback(
    <Key extends keyof CompressorConfig>(
      key: Key,
      value: CompressorConfig[Key],
    ) => dispatch({ patch: { [key]: value }, type: 'update' }),
    [dispatch],
  );

  return {
    compressor,
    updateCompressor,
    updateCompressorEnabled,
  };
}

export default useCompressorControl;
