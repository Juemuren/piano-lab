import { useCallback } from 'react';
import type { SynthConfig } from '../../../services/synth/config/Schema';
import type { ModulationConfigAction } from '../../../services/synth/effect/Modulation';
import {
  reduceAmplitudeModulationConfig,
  reduceDelayModulationConfig,
  reduceFrequencyModulationConfig,
  reducePhaseModulationConfig,
} from '../../../services/synth/effect/Modulation';
import useEffectSectionReducer from './useEffectSectionReducer';

type ModulationKey =
  | 'amplitudeModulation'
  | 'delayModulation'
  | 'frequencyModulation'
  | 'phaseModulation';
type EffectConfig = SynthConfig['effect'];

function useModulationControl<Key extends ModulationKey>(
  key: Key,
  reducer: (
    config: EffectConfig[Key],
    action: ModulationConfigAction,
  ) => EffectConfig[Key],
) {
  const [config, dispatch] = useEffectSectionReducer<
    Key,
    ModulationConfigAction
  >(key, reducer);
  const updateEnabled = useCallback(
    (enabled: boolean) => dispatch({ enabled, type: 'setEnabled' }),
    [dispatch],
  );
  const updateDepth = useCallback(
    (depth: number) => dispatch({ patch: { depth }, type: 'update' }),
    [dispatch],
  );
  const updateFrequency = useCallback(
    (frequency: number) => dispatch({ patch: { frequency }, type: 'update' }),
    [dispatch],
  );

  return { config, updateDepth, updateEnabled, updateFrequency };
}

export function useAmplitudeModulationControl() {
  return useModulationControl(
    'amplitudeModulation',
    reduceAmplitudeModulationConfig,
  );
}

export function useFrequencyModulationControl() {
  return useModulationControl(
    'frequencyModulation',
    reduceFrequencyModulationConfig,
  );
}

export function usePhaseModulationControl() {
  return useModulationControl('phaseModulation', reducePhaseModulationConfig);
}

export function useDelayModulationControl() {
  return useModulationControl('delayModulation', reduceDelayModulationConfig);
}
