import { useCallback } from 'react';
import type { SynthConfig } from '../../../services/synth/config/Schema';
import { useSynthConfigStore } from '../../../stores/synthConfigStore';

type EffectConfig = SynthConfig['effect'];
type EffectConfigUpdate<Key extends keyof EffectConfig> =
  | EffectConfig[Key]
  | ((current: EffectConfig[Key]) => EffectConfig[Key]);

function useEffectSection<Key extends keyof EffectConfig>(key: Key) {
  const config = useSynthConfigStore((state) => state.config.effect[key]);
  const setEffectSection = useSynthConfigStore(
    (state) => state.setEffectSection,
  );
  const setConfig = useCallback(
    (update: EffectConfigUpdate<Key>) => setEffectSection(key, update),
    [key, setEffectSection],
  );

  return [config, setConfig] as const;
}

export default useEffectSection;
