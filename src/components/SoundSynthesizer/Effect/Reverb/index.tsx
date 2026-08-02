import { House } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import useReverbControl from '../../../../hooks/synth/effect/useReverbControl';
import type { ReverbPreset } from '../../../../services/synth/config/Options';
import { REVERB_PRESETS } from '../../../../services/synth/config/Options';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import BlockMath from '../../../shared/BlockMath';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';
import EffectToggleButton from '../EffectToggleButton';
import EarlyReflections from './EarlyReflections';
import LateTail from './LateTail';
import ReverbImpulseResponsePreview from './ReverbImpulseResponsePreview';

function Reverb() {
  const { t } = useTranslation('synth');
  const {
    addReverbEarlyReflection: onEarlyReflectionAdd,
    removeReverbEarlyReflection: onEarlyReflectionRemove,
    reverb,
    updateReverbEarlyReflection: onEarlyReflectionChange,
    updateReverbEnabled: onEnabledChange,
    updateReverbLateTail: onLateTailChange,
    updateReverbMix: onMixChange,
    updateReverbPreset: onPresetChange,
  } = useReverbControl();

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
        <EffectToggleButton
          disableLabel={t('effect.reverb.disabled')}
          enabled={Boolean(reverb)}
          enableLabel={t('effect.reverb.enabled')}
          onClick={() => onEnabledChange(!reverb)}
          title={t('effect.reverb.enabled')}
        />

        {reverb && (
          <div className="space-y-3">
            <BlockMath math={String.raw`y(t)=(1-m)x(t)+m(x*h)(t)`} />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.reverb.mix}
              displayValue={`${(reverb.mix * 100).toFixed(0)}%`}
              label={t('effect.reverb.mix')}
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
              onChange={onEarlyReflectionChange}
              onRemove={onEarlyReflectionRemove}
            />

            <LateTail lateTail={reverb.lateTail} onChange={onLateTailChange} />

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
