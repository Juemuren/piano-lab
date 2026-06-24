import { Equal, Power, PowerOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type {
  EqualizerType,
  FilterEqualizerConfig,
  FilterType,
} from '../../../../types';
import ControlButton from '../../../shared/ControlButton';
import Equalizer from './Equalizer';
import Filter from './Filter';
import HarmonicResponsePreview from './HarmonicResponsePreview';
import MagnitudeResponsePreview from './MagnitudeResponsePreview';

interface FilterAndEqualizerProps {
  filterEqualizer: FilterEqualizerConfig | null;
  harmonicCount: number;
  onEnabledChange: (enabled: boolean) => void;
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
  filterEqualizer,
  onEnabledChange,
  onFilterAdd,
  onFilterRemove,
  onFilterTypeChange,
  onFilterFrequencyChange,
  onFilterQChange,
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
      <div className="space-y-3">
        <ControlButton
          icon={filterEqualizer ? <Power size={18} /> : <PowerOff size={18} />}
          label={t(
            filterEqualizer
              ? 'effect.filterEqualizer.disabled'
              : 'effect.filterEqualizer.enabled',
          )}
          onClick={() => onEnabledChange(!filterEqualizer)}
          title={t('effect.filterEqualizer.enabled')}
        />

        {filterEqualizer && (
          <div>
            <Filter
              filters={filterEqualizer.filters}
              onAdd={onFilterAdd}
              onFrequencyChange={onFilterFrequencyChange}
              onQChange={onFilterQChange}
              onRemove={onFilterRemove}
              onTypeChange={onFilterTypeChange}
            />
            <Equalizer
              equalizers={filterEqualizer.equalizers}
              onAdd={onEqualizerAdd}
              onFrequencyChange={onEqualizerFrequencyChange}
              onGainChange={onEqualizerGainChange}
              onQChange={onEqualizerQChange}
              onRemove={onEqualizerRemove}
              onTypeChange={onEqualizerTypeChange}
            />
            <MagnitudeResponsePreview
              equalizers={filterEqualizer.equalizers}
              filters={filterEqualizer.filters}
              title={t('effect.filterEqualizer.magnitudeResponseCurve')}
            />
            <HarmonicResponsePreview
              equalizers={filterEqualizer.equalizers}
              filters={filterEqualizer.filters}
              harmonicCount={harmonicCount}
              title={t('effect.filterEqualizer.magnitudeResponseSample')}
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default FilterAndEqualizer;
