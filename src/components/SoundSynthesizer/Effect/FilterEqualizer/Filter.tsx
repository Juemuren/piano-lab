import { FilterIcon, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SYNTH_CONFIG_DEFAULTS } from '../../../../services/synth/config/Defaults';
import type { FilterType } from '../../../../services/synth/config/Options';
import { FILTER_TYPES } from '../../../../services/synth/config/Options';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import type { FilterConfig } from '../../../../services/synth/effect/FilterEqualizer';
import type { IndexedConfigValueChangeHandler } from '../../../../types/config';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';

interface FilterProps {
  filters: FilterConfig[];
  onAdd: (type: FilterType) => void;
  onChange: IndexedConfigValueChangeHandler<FilterConfig>;
  onRemove: (index: number) => void;
}

function Filter({ filters, onAdd, onChange, onRemove }: FilterProps) {
  const { t } = useTranslation('synth');
  const [selectedFilterType, setSelectedFilterType] = useState<FilterType>(
    SYNTH_CONFIG_DEFAULTS.effect.filterEqualizer.filter.type,
  );

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
                bgClassName="bg-app-error/15 hover:bg-app-error/25 dark:bg-app-error-dark/15 dark:hover:bg-app-error-dark/25"
                colorClassName="text-app-error dark:text-app-error-dark"
                icon={<Minus size={18} />}
                onClick={() => onRemove(index)}
                title={t('effect.filter.name')}
              />
              <ControlSelect
                onChange={(e) =>
                  onChange(index, 'type', e.target.value as FilterType)
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
              onChange={(value) => onChange(index, 'frequency', value)}
              step="1"
              value={filter.frequency}
            />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.filter.q}
              displayValue={filter.q.toFixed(1)}
              label={t(`effect.filter.${filter.type}.q`)}
              onChange={(value) => onChange(index, 'q', value)}
              step="0.1"
              value={filter.q}
            />
          </div>
        ))}

        <div className="grid grid-cols-[auto_1fr] gap-2">
          <ControlButton
            bgClassName="bg-app-tip/15 hover:bg-app-tip/25 dark:bg-app-tip-dark/15 dark:hover:bg-app-tip-dark/25"
            colorClassName="text-app-tip dark:text-app-tip-dark"
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
