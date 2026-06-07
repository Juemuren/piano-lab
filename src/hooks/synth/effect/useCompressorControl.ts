import { useCallback, useState } from 'react';
import { createDefaultCompressorConfig } from '../../../services/synth/EffectDefaults';
import type { CompressorConfig } from '../../../types';

function useCompressorControl(initialCompressor?: CompressorConfig | null) {
  const [compressor, setCompressor] = useState<CompressorConfig | null>(
    () => initialCompressor ?? null,
  );

  const updateCompressorEnabled = useCallback((enabled: boolean) => {
    setCompressor((current) =>
      enabled ? (current ?? createDefaultCompressorConfig()) : null,
    );
  }, []);

  const updateCompressorThreshold = useCallback((threshold: number) => {
    setCompressor((current) =>
      current ? { ...current, threshold } : createDefaultCompressorConfig(),
    );
  }, []);

  const updateCompressorKnee = useCallback((knee: number) => {
    setCompressor((current) =>
      current ? { ...current, knee } : createDefaultCompressorConfig(),
    );
  }, []);

  const updateCompressorRatio = useCallback((ratio: number) => {
    setCompressor((current) =>
      current ? { ...current, ratio } : createDefaultCompressorConfig(),
    );
  }, []);

  const updateCompressorAttack = useCallback((attack: number) => {
    setCompressor((current) =>
      current ? { ...current, attack } : createDefaultCompressorConfig(),
    );
  }, []);

  const updateCompressorRelease = useCallback((release: number) => {
    setCompressor((current) =>
      current ? { ...current, release } : createDefaultCompressorConfig(),
    );
  }, []);

  return {
    compressor,
    updateCompressorEnabled,
    updateCompressorThreshold,
    updateCompressorKnee,
    updateCompressorRatio,
    updateCompressorAttack,
    updateCompressorRelease,
  };
}

export default useCompressorControl;
