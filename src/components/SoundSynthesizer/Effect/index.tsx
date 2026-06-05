import type { EffectConfig } from '../../../types';
import useEffectControl from '../../../hooks/synth/useEffectControl';
import EqualizerEffect from './EqualizerEffect';
import FilterEffect from './FilterEffect';

interface EffectProps {
  initialConfig?: EffectConfig | null;
  onConfigChange?: (config: EffectConfig) => void;
}

function Effect({ initialConfig, onConfigChange }: EffectProps) {
  const {
    filters,
    addFilter,
    removeFilter,
    updateFilterType,
    updateFilterFrequency,
    updateFilterQ,
    equalizers,
    addEqualizer,
    removeEqualizer,
    updateEqualizerType,
    updateEqualizerFrequency,
    updateEqualizerQ,
    updateEqualizerGain,
  } = useEffectControl(initialConfig, onConfigChange);

  return (
    <>
      <FilterEffect
        filters={filters}
        onAdd={addFilter}
        onRemove={removeFilter}
        onTypeChange={updateFilterType}
        onFrequencyChange={updateFilterFrequency}
        onQChange={updateFilterQ}
      />
      <EqualizerEffect
        equalizers={equalizers}
        onAdd={addEqualizer}
        onRemove={removeEqualizer}
        onTypeChange={updateEqualizerType}
        onFrequencyChange={updateEqualizerFrequency}
        onQChange={updateEqualizerQ}
        onGainChange={updateEqualizerGain}
      />
    </>
  );
}

export default Effect;
