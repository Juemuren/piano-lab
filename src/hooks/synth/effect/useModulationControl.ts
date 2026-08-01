import { useCallback, useState } from 'react';
import type {
  AmplitudeModulationConfig,
  DelayModulationConfig,
  FrequencyModulationConfig,
  PhaseModulationConfig,
} from '../../../services/synth/effect/Modulation';
import {
  createAmplitudeModulationConfig,
  createDelayModulationConfig,
  createFrequencyModulationConfig,
  createPhaseModulationConfig,
} from '../../../services/synth/effect/Modulation';

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
      enabled ? (current ?? createAmplitudeModulationConfig()) : null,
    );
  }, []);

  const updateAmplitudeModulationFrequency = useCallback(
    (frequency: number) => {
      setAmplitudeModulation((current) => ({
        ...(current ?? createAmplitudeModulationConfig()),
        frequency,
      }));
    },
    [],
  );

  const updateAmplitudeModulationDepth = useCallback((depth: number) => {
    setAmplitudeModulation((current) => ({
      ...(current ?? createAmplitudeModulationConfig()),
      depth,
    }));
  }, []);

  const updateFrequencyModulationEnabled = useCallback((enabled: boolean) => {
    setFrequencyModulation((current) =>
      enabled ? (current ?? createFrequencyModulationConfig()) : null,
    );
  }, []);

  const updateFrequencyModulationFrequency = useCallback(
    (frequency: number) => {
      setFrequencyModulation((current) => ({
        ...(current ?? createFrequencyModulationConfig()),
        frequency,
      }));
    },
    [],
  );

  const updateFrequencyModulationDepth = useCallback((depth: number) => {
    setFrequencyModulation((current) => ({
      ...(current ?? createFrequencyModulationConfig()),
      depth,
    }));
  }, []);

  const updatePhaseModulationEnabled = useCallback((enabled: boolean) => {
    setPhaseModulation((current) =>
      enabled ? (current ?? createPhaseModulationConfig()) : null,
    );
  }, []);

  const updatePhaseModulationFrequency = useCallback((frequency: number) => {
    setPhaseModulation((current) => ({
      ...(current ?? createPhaseModulationConfig()),
      frequency,
    }));
  }, []);

  const updatePhaseModulationDepth = useCallback((depth: number) => {
    setPhaseModulation((current) => ({
      ...(current ?? createPhaseModulationConfig()),
      depth,
    }));
  }, []);

  const updateDelayModulationEnabled = useCallback((enabled: boolean) => {
    setDelayModulation((current) =>
      enabled ? (current ?? createDelayModulationConfig()) : null,
    );
  }, []);

  const updateDelayModulationFrequency = useCallback((frequency: number) => {
    setDelayModulation((current) => ({
      ...(current ?? createDelayModulationConfig()),
      frequency,
    }));
  }, []);

  const updateDelayModulationDepth = useCallback((depth: number) => {
    setDelayModulation((current) => ({
      ...(current ?? createDelayModulationConfig()),
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
