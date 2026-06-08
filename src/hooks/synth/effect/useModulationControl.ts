import { useCallback, useState } from 'react';
import {
  createDefaultTremoloConfig,
  createDefaultVibratoConfig,
} from '../../../services/synth/config/Defaults';
import type { TremoloConfig, VibratoConfig } from '../../../types';

function useModulationControl(
  initialTremolo: TremoloConfig | null,
  initialVibrato: VibratoConfig | null,
) {
  const [tremolo, setTremolo] = useState<TremoloConfig | null>(
    () => initialTremolo,
  );
  const [vibrato, setVibrato] = useState<VibratoConfig | null>(
    () => initialVibrato,
  );

  const updateTremoloEnabled = useCallback((enabled: boolean) => {
    setTremolo((current) =>
      enabled ? (current ?? createDefaultTremoloConfig()) : null,
    );
  }, []);

  const updateTremoloFrequency = useCallback((frequency: number) => {
    setTremolo((current) => ({
      ...(current ?? createDefaultTremoloConfig()),
      frequency,
    }));
  }, []);

  const updateTremoloDepth = useCallback((depth: number) => {
    setTremolo((current) => ({
      ...(current ?? createDefaultTremoloConfig()),
      depth,
    }));
  }, []);

  const updateVibratoEnabled = useCallback((enabled: boolean) => {
    setVibrato((current) =>
      enabled ? (current ?? createDefaultVibratoConfig()) : null,
    );
  }, []);

  const updateVibratoFrequency = useCallback((frequency: number) => {
    setVibrato((current) => ({
      ...(current ?? createDefaultVibratoConfig()),
      frequency,
    }));
  }, []);

  const updateVibratoDepth = useCallback((depth: number) => {
    setVibrato((current) => ({
      ...(current ?? createDefaultVibratoConfig()),
      depth,
    }));
  }, []);

  return {
    tremolo,
    updateTremoloEnabled,
    updateTremoloFrequency,
    updateTremoloDepth,
    vibrato,
    updateVibratoEnabled,
    updateVibratoFrequency,
    updateVibratoDepth,
  };
}

export default useModulationControl;
