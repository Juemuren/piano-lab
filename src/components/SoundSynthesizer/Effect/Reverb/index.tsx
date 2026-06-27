import { House, Power, PowerOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import type { ReverbPreset } from '../../../../services/synth/config/Options';
import { REVERB_PRESETS } from '../../../../services/synth/config/Options';
import type { ReverbConfig } from '../../../../types';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';
import EarlyReflections from './EarlyReflections';
import LateTail from './LateTail';
import ReverbImpulseResponsePreview from './ReverbImpulseResponsePreview';

interface ReverbProps {
  onEarlyReflectionAdd: () => void;
  onEarlyReflectionDelayChange: (index: number, value: number) => void;
  onEarlyReflectionGainChange: (index: number, value: number) => void;
  onEarlyReflectionPhaseChange: (index: number, value: number) => void;
  onEarlyReflectionRemove: (index: number) => void;
  onEnabledChange: (enabled: boolean) => void;
  onLateTailAlphaChange: (value: number) => void;
  onLateTailAmplitudeChange: (value: number) => void;
  onLateTailDelayChange: (value: number) => void;
  onLateTailDurationChange: (value: number) => void;
  onMixChange: (value: number) => void;
  onPresetChange: (preset: ReverbPreset) => void;
  reverb: ReverbConfig | null;
}

function Reverb({
  reverb,
  onEnabledChange,
  onPresetChange,
  onMixChange,
  onEarlyReflectionAdd,
  onEarlyReflectionRemove,
  onEarlyReflectionDelayChange,
  onEarlyReflectionGainChange,
  onEarlyReflectionPhaseChange,
  onLateTailDelayChange,
  onLateTailDurationChange,
  onLateTailAmplitudeChange,
  onLateTailAlphaChange,
}: ReverbProps) {
  const { t } = useTranslation('synth');

  const presetLabels: Record<ReverbPreset, string> = {
    bathroom: t('effect.reverb.presets.bathroom'),
    cathedral: t('effect.reverb.presets.cathedral'),
    custom: t('effect.reverb.presets.custom'),
    garage: t('effect.reverb.presets.garage'),
    hall: t('effect.reverb.presets.hall'),
  };

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold text-lg">
        <span className="inline-flex items-center gap-1">
          <House size={18} />
          {t('effect.reverb.name')}
        </span>
      </summary>

      <div className="space-y-3">
        <ControlButton
          icon={reverb ? <Power size={18} /> : <PowerOff size={18} />}
          label={t(reverb ? 'effect.reverb.disabled' : 'effect.reverb.enabled')}
          onClick={() => onEnabledChange(!reverb)}
          title={t('effect.reverb.enabled')}
        />

        {reverb && (
          <div className="space-y-3">
            <BlockMath math={String.raw`y(t)=(1-m)x(t)+m(x*h)(t)`} />
            <ControlRange
              displayValue={`${(reverb.mix * 100).toFixed(0)}%`}
              label={t('effect.reverb.mix')}
              max="1"
              min="0"
              onChange={onMixChange}
              step="0.01"
              symbol={<InlineMath math="m" />}
              value={reverb.mix}
            />

            <ControlSelect
              label={t('effect.reverb.preset')}
              onChange={(e) => onPresetChange(e.target.value as ReverbPreset)}
              value={reverb.preset}
            >
              {REVERB_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {presetLabels[preset]}
                </option>
              ))}
            </ControlSelect>

            <EarlyReflections
              earlyReflections={reverb.earlyReflections}
              onAdd={onEarlyReflectionAdd}
              onDelayChange={onEarlyReflectionDelayChange}
              onGainChange={onEarlyReflectionGainChange}
              onPhaseChange={onEarlyReflectionPhaseChange}
              onRemove={onEarlyReflectionRemove}
            />

            <LateTail
              lateTail={reverb.lateTail}
              onAlphaChange={onLateTailAlphaChange}
              onAmplitudeChange={onLateTailAmplitudeChange}
              onDelayChange={onLateTailDelayChange}
              onDurationChange={onLateTailDurationChange}
            />

            <ReverbImpulseResponsePreview
              reverb={reverb}
              title={t('effect.reverb.impulseResponse')}
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default Reverb;
