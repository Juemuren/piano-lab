import { useCallback, useState } from 'react';
import {
  createDefaultDelayModulationConfig,
  createDefaultPhaseModulationConfig,
  createDefaultTremoloConfig,
  createDefaultVibratoConfig,
} from '../../../services/synth/config/Defaults';
import type {
  DelayModulationConfig,
  PhaseModulationConfig,
  TremoloConfig,
  VibratoConfig,
} from '../../../types';

function useModulationControl(
  initialTremolo: TremoloConfig | null,
  initialVibrato: VibratoConfig | null,
  initialPhaseModulation: PhaseModulationConfig | null,
  initialDelayModulation: DelayModulationConfig | null,
) {
  const [tremolo, setTremolo] = useState<TremoloConfig | null>(
    () => initialTremolo,
  );
  const [vibrato, setVibrato] = useState<VibratoConfig | null>(
    () => initialVibrato,
  );
  const [phaseModulation, setPhaseModulation] =
    useState<PhaseModulationConfig | null>(() => initialPhaseModulation);
  const [delayModulation, setDelayModulation] =
    useState<DelayModulationConfig | null>(() => initialDelayModulation);

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

  const updatePhaseModulationEnabled = useCallback((enabled: boolean) => {
    setPhaseModulation((current) =>
      enabled ? (current ?? createDefaultPhaseModulationConfig()) : null,
    );
  }, []);

  const updatePhaseModulationFrequency = useCallback((frequency: number) => {
    setPhaseModulation((current) => ({
      ...(current ?? createDefaultPhaseModulationConfig()),
      frequency,
    }));
  }, []);

  const updatePhaseModulationDepth = useCallback((depth: number) => {
    setPhaseModulation((current) => ({
      ...(current ?? createDefaultPhaseModulationConfig()),
      depth,
    }));
  }, []);

  const updateDelayModulationEnabled = useCallback((enabled: boolean) => {
    setDelayModulation((current) =>
      enabled ? (current ?? createDefaultDelayModulationConfig()) : null,
    );
  }, []);

  const updateDelayModulationFrequency = useCallback((frequency: number) => {
    setDelayModulation((current) => ({
      ...(current ?? createDefaultDelayModulationConfig()),
      frequency,
    }));
  }, []);

  const updateDelayModulationDepth = useCallback((depth: number) => {
    setDelayModulation((current) => ({
      ...(current ?? createDefaultDelayModulationConfig()),
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
    phaseModulation,
    updatePhaseModulationEnabled,
    updatePhaseModulationFrequency,
    updatePhaseModulationDepth,
    delayModulation,
    updateDelayModulationEnabled,
    updateDelayModulationFrequency,
    updateDelayModulationDepth,
  };
}

export default useModulationControl;
