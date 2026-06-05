import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import { DEFAULT_REVERB_EFFECT_PRESET } from '../../../constants/synth';
import type { ReverbEffectConfig, ReverbEffectPreset } from '../../../types';
import ControlButton from '../../shared/ControlButton';
import ControlRange from '../../shared/ControlRange';
import ControlSelect from '../../shared/ControlSelect';

interface ReverbEffectProps {
  reverb: ReverbEffectConfig | null;
  onAdd: (preset: ReverbEffectPreset) => void;
  onRemove: () => void;
  onPresetChange: (preset: ReverbEffectPreset) => void;
  onMixChange: (value: number) => void;
}

function ReverbEffect({
  reverb,
  onAdd,
  onRemove,
  onPresetChange,
  onMixChange,
}: ReverbEffectProps) {
  const { t } = useTranslation('synth');
  const [selectedPreset, setSelectedPreset] = useState<ReverbEffectPreset>(
    DEFAULT_REVERB_EFFECT_PRESET,
  );

  const presetLabels: Record<ReverbEffectPreset, string> = {
    bathroom: t('effect.reverb.presets.bathroom'),
    garage: t('effect.reverb.presets.garage'),
    hall: t('effect.reverb.presets.hall'),
    cathedral: t('effect.reverb.presets.cathedral'),
  };
  const presetOptions: ReverbEffectPreset[] = [
    'bathroom',
    'garage',
    'hall',
    'cathedral',
  ];

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        {t('effect.reverb.name')}
      </summary>

      <div className="space-y-3">
        {reverb ? (
          <div className="space-y-2">
            <div className="grid gap-2 grid-cols-[auto_1fr]">
              <ControlButton
                title={t('effect.reverb.name')}
                icon={<Minus size={18} />}
                onClick={onRemove}
              />
              <ControlSelect
                value={reverb.preset}
                onChange={(e) =>
                  onPresetChange(e.target.value as ReverbEffectPreset)
                }
              >
                {presetOptions.map((preset) => (
                  <option key={preset} value={preset}>
                    {presetLabels[preset]}
                  </option>
                ))}
              </ControlSelect>
            </div>

            <ControlRange
              label={t('effect.reverb.mix')}
              min="0"
              max="1"
              step="0.01"
              value={reverb.mix}
              displayValue={`${(reverb.mix * 100).toFixed(0)}%`}
              onChange={onMixChange}
            />
          </div>
        ) : (
          <div className="grid gap-2 grid-cols-[auto_1fr]">
            <ControlButton
              title={t('effect.reverb.name')}
              icon={<Plus size={18} />}
              onClick={() => onAdd(selectedPreset)}
            />
            <ControlSelect
              value={selectedPreset}
              onChange={(e) =>
                setSelectedPreset(e.target.value as ReverbEffectPreset)
              }
            >
              {presetOptions.map((preset) => (
                <option key={preset} value={preset}>
                  {presetLabels[preset]}
                </option>
              ))}
            </ControlSelect>
          </div>
        )}
      </div>
    </details>
  );
}

export default ReverbEffect;
