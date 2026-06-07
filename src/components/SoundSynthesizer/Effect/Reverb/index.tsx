import { useTranslation } from 'react-i18next';
import { Waves } from 'lucide-react';
import { InlineMath } from 'react-katex';
import type { BuiltInReverbPreset, ReverbConfig } from '../../../../types';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';
import EarlyReflections from './EarlyReflections';
import LateTail from './LateTail';
import ReverbImpulseResponsePreview from './ReverbImpulseResponsePreview';

interface ReverbProps {
  reverb: ReverbConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onPresetChange: (preset: BuiltInReverbPreset) => void;
  onMixChange: (value: number) => void;
  onEarlyReflectionAdd: () => void;
  onEarlyReflectionRemove: (index: number) => void;
  onEarlyReflectionDelayChange: (index: number, value: number) => void;
  onEarlyReflectionGainChange: (index: number, value: number) => void;
  onLateTailDelayChange: (value: number) => void;
  onLateTailDurationChange: (value: number) => void;
  onLateTailAmplitudeChange: (value: number) => void;
  onLateTailAlphaChange: (value: number) => void;
}

const presetOptions: BuiltInReverbPreset[] = [
  'bathroom',
  'garage',
  'hall',
  'cathedral',
];

function Reverb({
  reverb,
  onEnabledChange,
  onPresetChange,
  onMixChange,
  onEarlyReflectionAdd,
  onEarlyReflectionRemove,
  onEarlyReflectionDelayChange,
  onEarlyReflectionGainChange,
  onLateTailDelayChange,
  onLateTailDurationChange,
  onLateTailAmplitudeChange,
  onLateTailAlphaChange,
}: ReverbProps) {
  const { t } = useTranslation('synth');

  const presetLabels: Record<BuiltInReverbPreset, string> = {
    bathroom: t('effect.reverb.presets.bathroom'),
    garage: t('effect.reverb.presets.garage'),
    hall: t('effect.reverb.presets.hall'),
    cathedral: t('effect.reverb.presets.cathedral'),
  };

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        {t('effect.reverb.name')}
      </summary>

      <div className="space-y-3">
        <ControlButton
          title={t('effect.reverb.enabled')}
          icon={<Waves size={18} />}
          label={t(reverb ? 'effect.reverb.disabled' : 'effect.reverb.enabled')}
          onClick={() => onEnabledChange(!reverb)}
        />

        {reverb && (
          <div className="space-y-3">
            <BlockMath math={String.raw`y(t)=(1-m)x(t)+m(x*h)(t)`} />
            <ControlRange
              label={t('effect.reverb.mix')}
              symbol={<InlineMath math="m" />}
              min="0"
              max="1"
              step="0.01"
              value={reverb.mix}
              displayValue={`${(reverb.mix * 100).toFixed(0)}%`}
              onChange={onMixChange}
            />

            <ControlSelect
              value={reverb.preset}
              onChange={(e) =>
                onPresetChange(e.target.value as BuiltInReverbPreset)
              }
            >
              {reverb.preset === 'custom' && (
                <option value="custom" disabled>
                  {t('effect.reverb.presets.custom')}
                </option>
              )}
              {presetOptions.map((preset) => (
                <option key={preset} value={preset}>
                  {presetLabels[preset]}
                </option>
              ))}
            </ControlSelect>

            <EarlyReflections
              earlyReflections={reverb.earlyReflections}
              onAdd={onEarlyReflectionAdd}
              onRemove={onEarlyReflectionRemove}
              onDelayChange={onEarlyReflectionDelayChange}
              onGainChange={onEarlyReflectionGainChange}
            />

            <LateTail
              lateTail={reverb.lateTail}
              onDelayChange={onLateTailDelayChange}
              onDurationChange={onLateTailDurationChange}
              onAmplitudeChange={onLateTailAmplitudeChange}
              onAlphaChange={onLateTailAlphaChange}
            />

            <ReverbImpulseResponsePreview
              title={t('effect.reverb.impulseResponse')}
              reverb={reverb}
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default Reverb;
