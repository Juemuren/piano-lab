import { Minus, Plus, SlidersVertical } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_EQUALIZER_TYPE } from '../../../../constants/synth';
import type { EqualizerConfig, EqualizerType } from '../../../../types';
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
      <summary className="font-bold my-2">
        <span className="inline-flex items-center gap-1">
          <SlidersVertical size={16} />
          {t('effect.equalizer.name')}
        </span>
      </summary>

      <div className="space-y-3">
        {equalizers.map((equalizer, index) => (
          <div className="space-y-2" key={index}>
            <div className="grid gap-2 grid-cols-[auto_1fr]">
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
                <option value="lowshelf">{equalizerTypeLabels.lowshelf}</option>
                <option value="highshelf">
                  {equalizerTypeLabels.highshelf}
                </option>
                <option value="peaking">{equalizerTypeLabels.peaking}</option>
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

        <div className="grid gap-2 grid-cols-[auto_1fr]">
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
