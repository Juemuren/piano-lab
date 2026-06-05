import type { EffectConfig } from '../../../types';
import useEffectControl from '../../../hooks/synth/useEffectControl';
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
  } = useEffectControl(initialConfig, onConfigChange);

  return (
    <FilterEffect
      filters={filters}
      onAdd={addFilter}
      onRemove={removeFilter}
      onTypeChange={updateFilterType}
      onFrequencyChange={updateFilterFrequency}
      onQChange={updateFilterQ}
    />
  );
}

export default Effect;
