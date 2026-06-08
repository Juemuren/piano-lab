import { useTranslation } from 'react-i18next';
import { Equal } from 'lucide-react';
import type {
  EqualizerConfig,
  EqualizerType,
  FilterConfig,
  FilterType,
} from '../../../../types';
import HarmonicResponsePreview from './HarmonicResponsePreview';
import MagnitudeResponsePreview from './MagnitudeResponsePreview';
import Equalizer from './Equalizer';
import Filter from './Filter';

interface FilterAndEqualizerProps {
  harmonicCount: number;
  filters: FilterConfig[];
  onFilterAdd: (type: FilterType) => void;
  onFilterRemove: (index: number) => void;
  onFilterTypeChange: (index: number, type: FilterType) => void;
  onFilterFrequencyChange: (index: number, value: number) => void;
  onFilterQChange: (index: number, value: number) => void;
  equalizers: EqualizerConfig[];
  onEqualizerAdd: (type: EqualizerType) => void;
  onEqualizerRemove: (index: number) => void;
  onEqualizerTypeChange: (index: number, type: EqualizerType) => void;
  onEqualizerFrequencyChange: (index: number, value: number) => void;
  onEqualizerQChange: (index: number, value: number) => void;
  onEqualizerGainChange: (index: number, value: number) => void;
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
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        <span className="inline-flex items-center gap-1">
          <Equal size={18} />
          {t('effect.filterEqualizer.name')}
        </span>
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
      <MagnitudeResponsePreview
        title={t('effect.filterEqualizer.magnitudeResponseCurve')}
        filters={filters}
        equalizers={equalizers}
      />
      <HarmonicResponsePreview
        title={t('effect.filterEqualizer.magnitudeResponseSample')}
        harmonicCount={harmonicCount}
        filters={filters}
        equalizers={equalizers}
      />
    </details>
  );
}

export default FilterAndEqualizer;
