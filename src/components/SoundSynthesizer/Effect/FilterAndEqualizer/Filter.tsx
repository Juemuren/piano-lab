import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import { DEFAULT_FILTER_EFFECT_TYPE } from '../../../../constants/synth';
import type { FilterEffectConfig, FilterEffectType } from '../../../../types';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';

interface FilterEffectProps {
  filters: FilterEffectConfig[];
  onAdd: (type: FilterEffectType) => void;
  onRemove: (index: number) => void;
  onTypeChange: (index: number, type: FilterEffectType) => void;
  onFrequencyChange: (index: number, value: number) => void;
  onQChange: (index: number, value: number) => void;
}

function FilterEffect({
  filters,
  onAdd,
  onRemove,
  onTypeChange,
  onFrequencyChange,
  onQChange,
}: FilterEffectProps) {
  const { t } = useTranslation('synth');
  const [selectedFilterType, setSelectedFilterType] =
    useState<FilterEffectType>(DEFAULT_FILTER_EFFECT_TYPE);

  const filterTypeLabels: Record<FilterEffectType, string> = {
    lowpass: t('effect.filter.lowpass.name'),
    highpass: t('effect.filter.highpass.name'),
    bandpass: t('effect.filter.bandpass.name'),
    notch: t('effect.filter.notch.name'),
  };

  return (
    <details open className="my-2">
      <summary className="font-bold my-2">{t('effect.filter.name')}</summary>

      <div className="space-y-3">
        {filters.map((filter, index) => (
          <div key={index} className="space-y-2">
            <div className="grid gap-2 grid-cols-[auto_1fr]">
              <ControlButton
                title={t('effect.filter.name')}
                icon={<Minus size={18} />}
                onClick={() => onRemove(index)}
              />
              <ControlSelect
                value={filter.type}
                onChange={(e) =>
                  onTypeChange(index, e.target.value as FilterEffectType)
                }
              >
                <option value="lowpass">{filterTypeLabels.lowpass}</option>
                <option value="highpass">{filterTypeLabels.highpass}</option>
                <option value="bandpass">{filterTypeLabels.bandpass}</option>
                <option value="notch">{filterTypeLabels.notch}</option>
              </ControlSelect>
            </div>

            <ControlRange
              label={t(`effect.filter.${filter.type}.frequency`)}
              min="20"
              max="20000"
              step="1"
              value={filter.frequency}
              displayValue={`${filter.frequency.toFixed(0)} Hz`}
              onChange={(value) => onFrequencyChange(index, value)}
            />
            <ControlRange
              label={t(`effect.filter.${filter.type}.q`)}
              min="0.1"
              max="20"
              step="0.1"
              value={filter.q}
              displayValue={filter.q.toFixed(1)}
              onChange={(value) => onQChange(index, value)}
            />
          </div>
        ))}

        <div className="grid gap-2 grid-cols-[auto_1fr]">
          <ControlButton
            title={t('effect.filter.name')}
            icon={<Plus size={18} />}
            onClick={() => onAdd(selectedFilterType)}
          />
          <ControlSelect
            value={selectedFilterType}
            onChange={(e) =>
              setSelectedFilterType(e.target.value as FilterEffectType)
            }
          >
            <option value="lowpass">{filterTypeLabels.lowpass}</option>
            <option value="highpass">{filterTypeLabels.highpass}</option>
            <option value="bandpass">{filterTypeLabels.bandpass}</option>
            <option value="notch">{filterTypeLabels.notch}</option>
          </ControlSelect>
        </div>
      </div>
    </details>
  );
}

export default FilterEffect;
