import { useTranslation } from 'react-i18next';
import type {
  EqualizerEffectConfig,
  EqualizerEffectType,
  FilterEffectConfig,
  FilterEffectType,
} from '../../../../types';
import EffectHarmonicResponsePreview from './EffectHarmonicResponsePreview';
import EffectMagnitudeResponsePreview from './EffectMagnitudeResponsePreview';
import Equalizer from './Equalizer';
import Filter from './Filter';

interface FilterEqualizerEffectProps {
  harmonicCount: number;
  filters: FilterEffectConfig[];
  onFilterAdd: (type: FilterEffectType) => void;
  onFilterRemove: (index: number) => void;
  onFilterTypeChange: (index: number, type: FilterEffectType) => void;
  onFilterFrequencyChange: (index: number, value: number) => void;
  onFilterQChange: (index: number, value: number) => void;
  equalizers: EqualizerEffectConfig[];
  onEqualizerAdd: (type: EqualizerEffectType) => void;
  onEqualizerRemove: (index: number) => void;
  onEqualizerTypeChange: (index: number, type: EqualizerEffectType) => void;
  onEqualizerFrequencyChange: (index: number, value: number) => void;
  onEqualizerQChange: (index: number, value: number) => void;
  onEqualizerGainChange: (index: number, value: number) => void;
}

function FilterEqualizerEffect({
  harmonicCount,
  filters,
  onFilterAdd,
  onFilterRemove,
  onFilterTypeChange,
  onFilterFrequencyChange,
  onFilterQChange,
  equalizers,
  onEqualizerAdd,
  onEqualizerRemove,
  onEqualizerTypeChange,
  onEqualizerFrequencyChange,
  onEqualizerQChange,
  onEqualizerGainChange,
}: FilterEqualizerEffectProps) {
  const { t } = useTranslation('synth');

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        {t('effect.filterEqualizer.name')}
      </summary>
      <Filter
        filters={filters}
        onAdd={onFilterAdd}
        onRemove={onFilterRemove}
        onTypeChange={onFilterTypeChange}
        onFrequencyChange={onFilterFrequencyChange}
        onQChange={onFilterQChange}
      />
      <Equalizer
        equalizers={equalizers}
        onAdd={onEqualizerAdd}
        onRemove={onEqualizerRemove}
        onTypeChange={onEqualizerTypeChange}
        onFrequencyChange={onEqualizerFrequencyChange}
        onQChange={onEqualizerQChange}
        onGainChange={onEqualizerGainChange}
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
    </details>
  );
}

export default FilterEqualizerEffect;
