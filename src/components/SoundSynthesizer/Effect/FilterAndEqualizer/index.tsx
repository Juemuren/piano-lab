import { Equal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type {
  EqualizerConfig,
  EqualizerType,
  FilterConfig,
  FilterType,
} from '../../../../types';
import Equalizer from './Equalizer';
import Filter from './Filter';
import HarmonicResponsePreview from './HarmonicResponsePreview';
import MagnitudeResponsePreview from './MagnitudeResponsePreview';

interface FilterAndEqualizerProps {
  equalizers: EqualizerConfig[];
  filters: FilterConfig[];
  harmonicCount: number;
  onEqualizerAdd: (type: EqualizerType) => void;
  onEqualizerFrequencyChange: (index: number, value: number) => void;
  onEqualizerGainChange: (index: number, value: number) => void;
  onEqualizerQChange: (index: number, value: number) => void;
  onEqualizerRemove: (index: number) => void;
  onEqualizerTypeChange: (index: number, type: EqualizerType) => void;
  onFilterAdd: (type: FilterType) => void;
  onFilterFrequencyChange: (index: number, value: number) => void;
  onFilterQChange: (index: number, value: number) => void;
  onFilterRemove: (index: number) => void;
  onFilterTypeChange: (index: number, type: FilterType) => void;
}

function FilterAndEqualizer({
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
}: FilterAndEqualizerProps) {
  const { t } = useTranslation('synth');

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold text-lg">
        <span className="inline-flex items-center gap-1">
          <Equal size={18} />
          {t('effect.filterEqualizer.name')}
        </span>
      </summary>
      <Filter
        filters={filters}
        onAdd={onFilterAdd}
        onFrequencyChange={onFilterFrequencyChange}
        onQChange={onFilterQChange}
        onRemove={onFilterRemove}
        onTypeChange={onFilterTypeChange}
      />
      <Equalizer
        equalizers={equalizers}
        onAdd={onEqualizerAdd}
        onFrequencyChange={onEqualizerFrequencyChange}
        onGainChange={onEqualizerGainChange}
        onQChange={onEqualizerQChange}
        onRemove={onEqualizerRemove}
        onTypeChange={onEqualizerTypeChange}
      />
      <MagnitudeResponsePreview
        equalizers={equalizers}
        filters={filters}
        title={t('effect.filterEqualizer.magnitudeResponseCurve')}
      />
      <HarmonicResponsePreview
        equalizers={equalizers}
        filters={filters}
        harmonicCount={harmonicCount}
        title={t('effect.filterEqualizer.magnitudeResponseSample')}
      />
    </details>
  );
}

export default FilterAndEqualizer;
