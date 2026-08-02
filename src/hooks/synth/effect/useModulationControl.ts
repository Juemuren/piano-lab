import { useCallback } from 'react';
import type { EffectConfig } from '../../../services/synth/EffectChain';
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
import { useSynthConfigStore } from '../../../stores/synthConfigStore';

type ModulationKey =
  | 'amplitudeModulation'
  | 'delayModulation'
  | 'frequencyModulation'
  | 'phaseModulation';

function useModulationControl() {
  const amplitudeModulation = useSynthConfigStore(
    (state) => state.config.effect.amplitudeModulation,
  );
  const delayModulation = useSynthConfigStore(
    (state) => state.config.effect.delayModulation,
  );
  const frequencyModulation = useSynthConfigStore(
    (state) => state.config.effect.frequencyModulation,
  );
  const phaseModulation = useSynthConfigStore(
    (state) => state.config.effect.phaseModulation,
  );
  const setEffectConfig = useSynthConfigStore((state) => state.setEffectConfig);
  const updateModulation = useCallback(
    <Key extends ModulationKey>(
      key: Key,
      update: (current: EffectConfig[Key]) => EffectConfig[Key],
    ) => {
      setEffectConfig((effect) => ({
        ...effect,
        [key]: update(effect[key]),
      }));
    },
    [setEffectConfig],
  );
  const setAmplitudeModulation = useCallback(
    (
      update: (
        current: AmplitudeModulationConfig | null,
      ) => AmplitudeModulationConfig | null,
    ) => updateModulation('amplitudeModulation', update),
    [updateModulation],
  );
  const setFrequencyModulation = useCallback(
    (
      update: (
        current: FrequencyModulationConfig | null,
      ) => FrequencyModulationConfig | null,
    ) => updateModulation('frequencyModulation', update),
    [updateModulation],
  );
  const setPhaseModulation = useCallback(
    (
      update: (
        current: PhaseModulationConfig | null,
      ) => PhaseModulationConfig | null,
    ) => updateModulation('phaseModulation', update),
    [updateModulation],
  );
  const setDelayModulation = useCallback(
    (
      update: (
        current: DelayModulationConfig | null,
      ) => DelayModulationConfig | null,
    ) => updateModulation('delayModulation', update),
    [updateModulation],
  );

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
