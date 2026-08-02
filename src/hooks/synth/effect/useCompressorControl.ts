import { useCallback } from 'react';
import type { CompressorConfig } from '../../../services/synth/effect/Compressor';
import { createCompressorConfig } from '../../../services/synth/effect/Compressor';
import { useSynthConfigStore } from '../../../stores/synthConfigStore';

function useCompressorControl() {
  const compressor = useSynthConfigStore(
    (state) => state.config.effect.compressor,
  );
  const setEffectConfig = useSynthConfigStore((state) => state.setEffectConfig);
  const setCompressor = useCallback(
    (update: (current: CompressorConfig | null) => CompressorConfig | null) => {
      setEffectConfig((effect) => ({
        ...effect,
        compressor: update(effect.compressor),
      }));
    },
    [setEffectConfig],
  );

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
