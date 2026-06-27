import { Minus, Plus, SlidersVertical } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_EQUALIZER_TYPE } from '../../../../constants/synth';
import type { EqualizerType } from '../../../../services/synth/config/Options';
import { EQUALIZER_TYPES } from '../../../../services/synth/config/Options';
import type { EqualizerConfig } from '../../../../types';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';

interface EqualizerProps {
  equalizers: EqualizerConfig[];
  onAdd: (type: EqualizerType) => void;
  onFrequencyChange: (index: number, value: number) => void;
  onGainChange: (index: number, value: number) => void;
  onQChange: (index: number, value: number) => void;
  onRemove: (index: number) => void;
  onTypeChange: (index: number, type: EqualizerType) => void;
}

function Equalizer({
  equalizers,
  onAdd,
  onRemove,
  onTypeChange,
  onFrequencyChange,
  onQChange,
  onGainChange,
}: EqualizerProps) {
  const { t } = useTranslation('synth');
  const [selectedEqualizerType, setSelectedEqualizerType] =
    useState<EqualizerType>(DEFAULT_EQUALIZER_TYPE);

  const equalizerTypeLabels: Record<EqualizerType, string> = {
    highshelf: t('effect.equalizer.highshelf.name'),
    lowshelf: t('effect.equalizer.lowshelf.name'),
    peaking: t('effect.equalizer.peaking.name'),
  };

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold">
        <span className="inline-flex items-center gap-1">
          <SlidersVertical size={16} />
          {t('effect.equalizer.name')}
        </span>
      </summary>

      <div className="space-y-3">
        {equalizers.map((equalizer, index) => (
          <div className="space-y-2" key={index}>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <ControlButton
                icon={<Minus size={18} />}
                onClick={() => onRemove(index)}
                title={t('effect.equalizer.name')}
              />
              <ControlSelect
                onChange={(e) =>
                  onTypeChange(index, e.target.value as EqualizerType)
                }
                title={t('effect.equalizer.name')}
                value={equalizer.type}
              >
                {EQUALIZER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {equalizerTypeLabels[type]}
                  </option>
                ))}
              </ControlSelect>
            </div>

            <ControlRange
              displayValue={`${equalizer.frequency.toFixed(0)} Hz`}
              label={t(`effect.equalizer.${equalizer.type}.frequency`)}
              max="20000"
              min="20"
              onChange={(value) => onFrequencyChange(index, value)}
              step="1"
              value={equalizer.frequency}
            />
            {equalizer.type === 'peaking' && (
              <ControlRange
                displayValue={equalizer.q.toFixed(1)}
                label={t('effect.equalizer.peaking.q')}
                max="20"
                min="0.1"
                onChange={(value) => onQChange(index, value)}
                step="0.1"
                value={equalizer.q}
              />
            )}
            <ControlRange
              displayValue={`${equalizer.gain.toFixed(1)} dB`}
              label={t(`effect.equalizer.${equalizer.type}.gain`)}
              max="24"
              min="-24"
              onChange={(value) => onGainChange(index, value)}
              step="0.1"
              value={equalizer.gain}
            />
          </div>
        ))}

        <div className="grid grid-cols-[auto_1fr] gap-2">
          <ControlButton
            icon={<Plus size={18} />}
            onClick={() => onAdd(selectedEqualizerType)}
            title={t('effect.equalizer.name')}
          />
          <ControlSelect
            onChange={(e) =>
              setSelectedEqualizerType(e.target.value as EqualizerType)
            }
            title={t('effect.equalizer.name')}
            value={selectedEqualizerType}
          >
            {EQUALIZER_TYPES.map((type) => (
              <option key={type} value={type}>
                {equalizerTypeLabels[type]}
              </option>
            ))}
          </ControlSelect>
        </div>
      </div>
    </details>
  );
}

export default Equalizer;
