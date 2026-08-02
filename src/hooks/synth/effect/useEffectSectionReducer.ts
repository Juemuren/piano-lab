import { useCallback } from 'react';
import type { SynthConfig } from '../../../services/synth/config/Schema';
import useEffectSection from './useEffectSection';

type EffectConfig = SynthConfig['effect'];

function useEffectSectionReducer<Key extends keyof EffectConfig, Action>(
  key: Key,
  reducer: (config: EffectConfig[Key], action: Action) => EffectConfig[Key],
) {
  const [config, setConfig] = useEffectSection(key);
  const dispatch = useCallback(
    (action: Action) => setConfig((current) => reducer(current, action)),
    [reducer, setConfig],
  );

  return [config, dispatch] as const;
}

export default useEffectSectionReducer;
