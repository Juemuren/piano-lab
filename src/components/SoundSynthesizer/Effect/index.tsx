import type { EffectConfig } from '../../../types';
import { useTranslation } from 'react-i18next';
import useEffectControl from '../../../hooks/synth/useEffectControl';
import EffectHarmonicResponsePreview from './EffectHarmonicResponsePreview';
import EffectMagnitudeResponsePreview from './EffectMagnitudeResponsePreview';
import EqualizerEffect from './EqualizerEffect';
import FilterEffect from './FilterEffect';
import ReverbEffect from './ReverbEffect';

interface EffectProps {
  harmonicCount: number;
  initialConfig?: EffectConfig | null;
  onConfigChange?: (config: EffectConfig) => void;
}

function Effect({ harmonicCount, initialConfig, onConfigChange }: EffectProps) {
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
    reverb,
    addReverb,
    removeReverb,
    updateReverbPreset,
    updateReverbMix,
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
        title={t('charts.magnitudeResponseCurve')}
        filters={filters}
        equalizers={equalizers}
      />
      <EffectHarmonicResponsePreview
        title={t('charts.magnitudeResponseSample')}
        harmonicCount={harmonicCount}
        filters={filters}
        equalizers={equalizers}
      />
      <ReverbEffect
        reverb={reverb}
        onAdd={addReverb}
        onRemove={removeReverb}
        onPresetChange={updateReverbPreset}
        onMixChange={updateReverbMix}
      />
    </>
  );
}

export default Effect;
