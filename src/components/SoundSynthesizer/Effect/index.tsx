import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import type { EffectConfig, FilterEffectType } from '../../../types';
import ControlButton from '../../shared/ControlButton';
import ControlSelect from '../../shared/ControlSelect';
import useEffectControl from '../../../hooks/synth/useEffectControl';
import FilterParameterControls from './FilterParameterControls';

interface EffectProps {
  initialConfig?: EffectConfig | null;
  onConfigChange?: (config: EffectConfig) => void;
}

function Effect({ initialConfig, onConfigChange }: EffectProps) {
  const { t } = useTranslation('synth');
  const [selectedFilterType, setSelectedFilterType] =
    useState<FilterEffectType>('lowpass');
  const {
    filters,
    addFilter,
    removeFilter,
    updateFilterType,
    updateFilterFrequency,
    updateFilterQ,
  } = useEffectControl(initialConfig, onConfigChange);

  const filterTypeLabels: Record<FilterEffectType, string> = {
    lowpass: t('effect.filter.lowpass.name'),
    highpass: t('effect.filter.highpass.name'),
    bandpass: t('effect.filter.bandpass.name'),
    notch: t('effect.filter.notch.name'),
  };

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        {t('effect.filter.name')}
      </summary>

      <div className="space-y-3">
        {filters.map((filter, index) => (
          <div key={index} className="space-y-2">
            <div className="grid gap-2 grid-cols-[auto_1fr]">
              <ControlButton
                icon={<Minus size={18} />}
                onClick={() => removeFilter(index)}
              />
              <ControlSelect
                value={filter.type}
                onChange={(e) =>
                  updateFilterType(index, e.target.value as FilterEffectType)
                }
              >
                <option value="lowpass">{filterTypeLabels.lowpass}</option>
                <option value="highpass">{filterTypeLabels.highpass}</option>
                <option value="bandpass">{filterTypeLabels.bandpass}</option>
                <option value="notch">{filterTypeLabels.notch}</option>
              </ControlSelect>
            </div>

            <FilterParameterControls
              frequency={filter.frequency}
              q={filter.q}
              labels={{
                frequency: t(`effect.filter.${filter.type}.frequency`),
                q: t(`effect.filter.${filter.type}.q`),
              }}
              onFrequencyChange={(value) => updateFilterFrequency(index, value)}
              onQChange={(value) => updateFilterQ(index, value)}
            />
          </div>
        ))}

        <div className="grid gap-2 grid-cols-[auto_1fr]">
          <ControlButton
            title={t('effect.filter.name')}
            icon={<Plus size={18} />}
            onClick={() => addFilter(selectedFilterType)}
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

export default Effect;
