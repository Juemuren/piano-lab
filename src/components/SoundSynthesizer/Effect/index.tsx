import type { EffectConfig } from '../../../types';
import { useTranslation } from 'react-i18next';
import useEffectControl from '../../../hooks/synth/useEffectControl';
import EffectMagnitudeResponsePreview from './EffectMagnitudeResponsePreview';
import EqualizerEffect from './EqualizerEffect';
import FilterEffect from './FilterEffect';

interface EffectProps {
  initialConfig?: EffectConfig | null;
  onConfigChange?: (config: EffectConfig) => void;
}

function Effect({ initialConfig, onConfigChange }: EffectProps) {
  const { t } = useTranslation('synth');
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
      <EffectMagnitudeResponsePreview
        title={t('charts.magnitudeResponse')}
        filters={filters}
        equalizers={equalizers}
      />
    </>
  );
}

export default Effect;
