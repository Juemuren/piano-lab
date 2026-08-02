import { useCallback } from 'react';
import { createCompressorConfig } from '../../../services/synth/effect/Compressor';
import useEffectSection from './useEffectSection';

function useCompressorControl() {
  const [compressor, setCompressor] = useEffectSection('compressor');

  const updateCompressorEnabled = useCallback(
    (enabled: boolean) => {
      setCompressor((current) =>
        enabled ? (current ?? createCompressorConfig()) : null,
      );
    },
    [setCompressor],
  );

  const updateCompressorThreshold = useCallback(
    (threshold: number) => {
      setCompressor((current) =>
        current ? { ...current, threshold } : createCompressorConfig(),
      );
    },
    [setCompressor],
  );

  const updateCompressorKnee = useCallback(
    (knee: number) => {
      setCompressor((current) =>
        current ? { ...current, knee } : createCompressorConfig(),
      );
    },
    [setCompressor],
  );

  const updateCompressorRatio = useCallback(
    (ratio: number) => {
      setCompressor((current) =>
        current ? { ...current, ratio } : createCompressorConfig(),
      );
    },
    [setCompressor],
  );

  const updateCompressorAttack = useCallback(
    (attack: number) => {
      setCompressor((current) =>
        current ? { ...current, attack } : createCompressorConfig(),
      );
    },
    [setCompressor],
  );

  const updateCompressorRelease = useCallback(
    (release: number) => {
      setCompressor((current) =>
        current ? { ...current, release } : createCompressorConfig(),
      );
    },
    [setCompressor],
  );

  return {
    compressor,
    updateCompressorAttack,
    updateCompressorEnabled,
    updateCompressorKnee,
    updateCompressorRatio,
    updateCompressorRelease,
    updateCompressorThreshold,
  };
}

export default useCompressorControl;
