import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, SlidersVertical } from 'lucide-react';
import { DEFAULT_EQUALIZER_TYPE } from '../../../../constants/synth';
import type { EqualizerConfig, EqualizerType } from '../../../../types';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';

interface EqualizerProps {
  equalizers: EqualizerConfig[];
  onAdd: (type: EqualizerType) => void;
  onRemove: (index: number) => void;
  onTypeChange: (index: number, type: EqualizerType) => void;
  onFrequencyChange: (index: number, value: number) => void;
  onQChange: (index: number, value: number) => void;
  onGainChange: (index: number, value: number) => void;
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
    lowshelf: t('effect.equalizer.lowshelf.name'),
    highshelf: t('effect.equalizer.highshelf.name'),
    peaking: t('effect.equalizer.peaking.name'),
  };

  return (
    <details open className="my-2">
      <summary className="font-bold my-2">
        <span className="inline-flex items-center gap-1">
          <SlidersVertical size={16} />
          {t('effect.equalizer.name')}
        </span>
      </summary>

      <div className="space-y-3">
        {equalizers.map((equalizer, index) => (
          <div key={index} className="space-y-2">
            <div className="grid gap-2 grid-cols-[auto_1fr]">
              <ControlButton
                title={t('effect.equalizer.name')}
                icon={<Minus size={18} />}
                onClick={() => onRemove(index)}
              />
              <ControlSelect
                title={t('effect.equalizer.name')}
                value={equalizer.type}
                onChange={(e) =>
                  onTypeChange(index, e.target.value as EqualizerType)
                }
              >
                <option value="lowshelf">{equalizerTypeLabels.lowshelf}</option>
                <option value="highshelf">
                  {equalizerTypeLabels.highshelf}
                </option>
                <option value="peaking">{equalizerTypeLabels.peaking}</option>
              </ControlSelect>
            </div>

            <ControlRange
              label={t(`effect.equalizer.${equalizer.type}.frequency`)}
              min="20"
              max="20000"
              step="1"
              value={equalizer.frequency}
              displayValue={`${equalizer.frequency.toFixed(0)} Hz`}
              onChange={(value) => onFrequencyChange(index, value)}
            />
            {equalizer.type === 'peaking' && (
              <ControlRange
                label={t('effect.equalizer.peaking.q')}
                min="0.1"
                max="20"
                step="0.1"
                value={equalizer.q}
                displayValue={equalizer.q.toFixed(1)}
                onChange={(value) => onQChange(index, value)}
              />
            )}
            <ControlRange
              label={t(`effect.equalizer.${equalizer.type}.gain`)}
              min="-24"
              max="24"
              step="0.1"
              value={equalizer.gain}
              displayValue={`${equalizer.gain.toFixed(1)} dB`}
              onChange={(value) => onGainChange(index, value)}
            />
          </div>
        ))}

        <div className="grid gap-2 grid-cols-[auto_1fr]">
          <ControlButton
            title={t('effect.equalizer.name')}
            icon={<Plus size={18} />}
            onClick={() => onAdd(selectedEqualizerType)}
          />
          <ControlSelect
            title={t('effect.equalizer.name')}
            value={selectedEqualizerType}
            onChange={(e) =>
              setSelectedEqualizerType(e.target.value as EqualizerType)
            }
          >
            <option value="lowshelf">{equalizerTypeLabels.lowshelf}</option>
            <option value="highshelf">{equalizerTypeLabels.highshelf}</option>
            <option value="peaking">{equalizerTypeLabels.peaking}</option>
          </ControlSelect>
        </div>
      </div>
    </details>
  );
}

export default Equalizer;
