import { useCallback, useState } from 'react';
import type { CompressorConfig } from '../../../services/synth/effect/Compressor';
import { createCompressorConfig } from '../../../services/synth/effect/Compressor';

function useCompressorControl(initialCompressor: CompressorConfig | null) {
  const [compressor, setCompressor] = useState<CompressorConfig | null>(
    () => initialCompressor,
  );

  const updateCompressorEnabled = useCallback((enabled: boolean) => {
    setCompressor((current) =>
      enabled ? (current ?? createCompressorConfig()) : null,
    );
  }, []);

  const updateCompressorThreshold = useCallback((threshold: number) => {
    setCompressor((current) =>
      current ? { ...current, threshold } : createCompressorConfig(),
    );
  }, []);

  const updateCompressorKnee = useCallback((knee: number) => {
    setCompressor((current) =>
      current ? { ...current, knee } : createCompressorConfig(),
    );
  }, []);

  const updateCompressorRatio = useCallback((ratio: number) => {
    setCompressor((current) =>
      current ? { ...current, ratio } : createCompressorConfig(),
    );
  }, []);

  const updateCompressorAttack = useCallback((attack: number) => {
    setCompressor((current) =>
      current ? { ...current, attack } : createCompressorConfig(),
    );
  }, []);

  const updateCompressorRelease = useCallback((release: number) => {
    setCompressor((current) =>
      current ? { ...current, release } : createCompressorConfig(),
    );
  }, []);

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
