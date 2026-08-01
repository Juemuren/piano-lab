import { FilterIcon, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_FILTER_TYPE } from '../../../../constants/synth';
import type { FilterType } from '../../../../services/synth/config/Options';
import { FILTER_TYPES } from '../../../../services/synth/config/Options';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import type { FilterConfig } from '../../../../services/synth/effect/FilterEqualizer';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';

interface FilterProps {
  filters: FilterConfig[];
  onAdd: (type: FilterType) => void;
  onFrequencyChange: (index: number, value: number) => void;
  onQChange: (index: number, value: number) => void;
  onRemove: (index: number) => void;
  onTypeChange: (index: number, type: FilterType) => void;
}

function Filter({
  filters,
  onAdd,
  onRemove,
  onTypeChange,
  onFrequencyChange,
  onQChange,
}: FilterProps) {
  const { t } = useTranslation('synth');
  const [selectedFilterType, setSelectedFilterType] =
    useState<FilterType>(DEFAULT_FILTER_TYPE);

  const filterTypeLabels: Record<FilterType, string> = {
    bandpass: t('effect.filter.bandpass.name'),
    highpass: t('effect.filter.highpass.name'),
    lowpass: t('effect.filter.lowpass.name'),
    notch: t('effect.filter.notch.name'),
  };

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold">
        <span className="inline-flex items-center gap-1">
          <FilterIcon size={16} />
          {t('effect.filter.name')}
        </span>
      </summary>

      <div className="space-y-3">
        {filters.map((filter, index) => (
          <div className="space-y-2" key={index}>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <ControlButton
                icon={<Minus size={18} />}
                onClick={() => onRemove(index)}
                title={t('effect.filter.name')}
              />
              <ControlSelect
                onChange={(e) =>
                  onTypeChange(index, e.target.value as FilterType)
                }
                title={t('effect.filter.name')}
                value={filter.type}
              >
                {FILTER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {filterTypeLabels[type]}
                  </option>
                ))}
              </ControlSelect>
            </div>

            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.filter.frequency}
              displayValue={`${filter.frequency.toFixed(0)} Hz`}
              label={t(`effect.filter.${filter.type}.frequency`)}
              onChange={(value) => onFrequencyChange(index, value)}
              step="1"
              value={filter.frequency}
            />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.filter.q}
              displayValue={filter.q.toFixed(1)}
              label={t(`effect.filter.${filter.type}.q`)}
              onChange={(value) => onQChange(index, value)}
              step="0.1"
              value={filter.q}
            />
          </div>
        ))}

        <div className="grid grid-cols-[auto_1fr] gap-2">
          <ControlButton
            icon={<Plus size={18} />}
            onClick={() => onAdd(selectedFilterType)}
            title={t('effect.filter.name')}
          />
          <ControlSelect
            onChange={(e) =>
              setSelectedFilterType(e.target.value as FilterType)
            }
            title={t('effect.filter.name')}
            value={selectedFilterType}
          >
            {FILTER_TYPES.map((type) => (
              <option key={type} value={type}>
                {filterTypeLabels[type]}
              </option>
            ))}
          </ControlSelect>
        </div>
      </div>
    </details>
  );
}

export default Filter;
