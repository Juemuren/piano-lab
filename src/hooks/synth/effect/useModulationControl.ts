import { useCallback, useState } from 'react';
import {
  createDefaultAmplitudeModulationConfig,
  createDefaultDelayModulationConfig,
  createDefaultFrequencyModulationConfig,
  createDefaultPhaseModulationConfig,
} from '../../../services/synth/config/Defaults';
import type {
  AmplitudeModulationConfig,
  DelayModulationConfig,
  FrequencyModulationConfig,
  PhaseModulationConfig,
} from '../../../types/synth';

function useModulationControl(
  initialAmplitudeModulation: AmplitudeModulationConfig | null,
  initialFrequencyModulation: FrequencyModulationConfig | null,
  initialPhaseModulation: PhaseModulationConfig | null,
  initialDelayModulation: DelayModulationConfig | null,
) {
  const [amplitudeModulation, setAmplitudeModulation] =
    useState<AmplitudeModulationConfig | null>(
      () => initialAmplitudeModulation,
    );
  const [frequencyModulation, setFrequencyModulation] =
    useState<FrequencyModulationConfig | null>(
      () => initialFrequencyModulation,
    );
  const [phaseModulation, setPhaseModulation] =
    useState<PhaseModulationConfig | null>(() => initialPhaseModulation);
  const [delayModulation, setDelayModulation] =
    useState<DelayModulationConfig | null>(() => initialDelayModulation);

  const updateAmplitudeModulationEnabled = useCallback((enabled: boolean) => {
    setAmplitudeModulation((current) =>
      enabled ? (current ?? createDefaultAmplitudeModulationConfig()) : null,
    );
  }, []);

  const updateAmplitudeModulationFrequency = useCallback(
    (frequency: number) => {
      setAmplitudeModulation((current) => ({
        ...(current ?? createDefaultAmplitudeModulationConfig()),
        frequency,
      }));
    },
    [],
  );

  const updateAmplitudeModulationDepth = useCallback((depth: number) => {
    setAmplitudeModulation((current) => ({
      ...(current ?? createDefaultAmplitudeModulationConfig()),
      depth,
    }));
  }, []);

  const updateFrequencyModulationEnabled = useCallback((enabled: boolean) => {
    setFrequencyModulation((current) =>
      enabled ? (current ?? createDefaultFrequencyModulationConfig()) : null,
    );
  }, []);

  const updateFrequencyModulationFrequency = useCallback(
    (frequency: number) => {
      setFrequencyModulation((current) => ({
        ...(current ?? createDefaultFrequencyModulationConfig()),
        frequency,
      }));
    },
    [],
  );

  const updateFrequencyModulationDepth = useCallback((depth: number) => {
    setFrequencyModulation((current) => ({
      ...(current ?? createDefaultFrequencyModulationConfig()),
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
    amplitudeModulation,
    delayModulation,
    frequencyModulation,
    phaseModulation,
    updateAmplitudeModulationDepth,
    updateAmplitudeModulationEnabled,
    updateAmplitudeModulationFrequency,
    updateDelayModulationDepth,
    updateDelayModulationEnabled,
    updateDelayModulationFrequency,
    updateFrequencyModulationDepth,
    updateFrequencyModulationEnabled,
    updateFrequencyModulationFrequency,
    updatePhaseModulationDepth,
    updatePhaseModulationEnabled,
    updatePhaseModulationFrequency,
  };
}

export default useModulationControl;
