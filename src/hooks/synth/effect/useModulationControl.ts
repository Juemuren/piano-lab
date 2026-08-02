import { useCallback } from 'react';
import {
  createAmplitudeModulationConfig,
  createDelayModulationConfig,
  createFrequencyModulationConfig,
  createPhaseModulationConfig,
} from '../../../services/synth/effect/Modulation';
import useEffectSection from './useEffectSection';

function useModulationControl() {
  const [amplitudeModulation, setAmplitudeModulation] = useEffectSection(
    'amplitudeModulation',
  );
  const [delayModulation, setDelayModulation] =
    useEffectSection('delayModulation');
  const [frequencyModulation, setFrequencyModulation] = useEffectSection(
    'frequencyModulation',
  );
  const [phaseModulation, setPhaseModulation] =
    useEffectSection('phaseModulation');

  const updateAmplitudeModulationEnabled = useCallback(
    (enabled: boolean) => {
      setAmplitudeModulation((current) =>
        enabled ? (current ?? createAmplitudeModulationConfig()) : null,
      );
    },
    [setAmplitudeModulation],
  );

  const updateAmplitudeModulationFrequency = useCallback(
    (frequency: number) => {
      setAmplitudeModulation((current) => ({
        ...(current ?? createAmplitudeModulationConfig()),
        frequency,
      }));
    },
    [setAmplitudeModulation],
  );

  const updateAmplitudeModulationDepth = useCallback(
    (depth: number) => {
      setAmplitudeModulation((current) => ({
        ...(current ?? createAmplitudeModulationConfig()),
        depth,
      }));
    },
    [setAmplitudeModulation],
  );

  const updateFrequencyModulationEnabled = useCallback(
    (enabled: boolean) => {
      setFrequencyModulation((current) =>
        enabled ? (current ?? createFrequencyModulationConfig()) : null,
      );
    },
    [setFrequencyModulation],
  );

  const updateFrequencyModulationFrequency = useCallback(
    (frequency: number) => {
      setFrequencyModulation((current) => ({
        ...(current ?? createFrequencyModulationConfig()),
        frequency,
      }));
    },
    [setFrequencyModulation],
  );

  const updateFrequencyModulationDepth = useCallback(
    (depth: number) => {
      setFrequencyModulation((current) => ({
        ...(current ?? createFrequencyModulationConfig()),
        depth,
      }));
    },
    [setFrequencyModulation],
  );

  const updatePhaseModulationEnabled = useCallback(
    (enabled: boolean) => {
      setPhaseModulation((current) =>
        enabled ? (current ?? createPhaseModulationConfig()) : null,
      );
    },
    [setPhaseModulation],
  );

  const updatePhaseModulationFrequency = useCallback(
    (frequency: number) => {
      setPhaseModulation((current) => ({
        ...(current ?? createPhaseModulationConfig()),
        frequency,
      }));
    },
    [setPhaseModulation],
  );

  const updatePhaseModulationDepth = useCallback(
    (depth: number) => {
      setPhaseModulation((current) => ({
        ...(current ?? createPhaseModulationConfig()),
        depth,
      }));
    },
    [setPhaseModulation],
  );

  const updateDelayModulationEnabled = useCallback(
    (enabled: boolean) => {
      setDelayModulation((current) =>
        enabled ? (current ?? createDelayModulationConfig()) : null,
      );
    },
    [setDelayModulation],
  );

  const updateDelayModulationFrequency = useCallback(
    (frequency: number) => {
      setDelayModulation((current) => ({
        ...(current ?? createDelayModulationConfig()),
        frequency,
      }));
    },
    [setDelayModulation],
  );

  const updateDelayModulationDepth = useCallback(
    (depth: number) => {
      setDelayModulation((current) => ({
        ...(current ?? createDelayModulationConfig()),
        depth,
      }));
    },
    [setDelayModulation],
  );

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
