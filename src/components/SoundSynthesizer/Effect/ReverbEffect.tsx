import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Minus, Plus } from 'lucide-react';
import type {
  BuiltInReverbEffectPreset,
  ReverbEffectConfig,
} from '../../../types';
import ControlButton from '../../shared/ControlButton';
import ControlRange from '../../shared/ControlRange';
import ControlSelect from '../../shared/ControlSelect';

interface ReverbEffectProps {
  reverb: ReverbEffectConfig;
  onPresetChange: (preset: BuiltInReverbEffectPreset) => void;
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

const presetOptions: BuiltInReverbEffectPreset[] = [
  'bathroom',
  'garage',
  'hall',
  'cathedral',
];

function ReverbEffect({
  reverb,
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
}: ReverbEffectProps) {
  const { t } = useTranslation('synth');

  const presetLabels: Record<BuiltInReverbEffectPreset, string> = {
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
            onPresetChange(e.target.value as BuiltInReverbEffectPreset)
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

        <details open className="my-2">
          <summary className="font-bold my-2">
            {t('effect.reverb.earlyReflection.name')}
          </summary>
          <BlockMath math={String.raw`h_e[n]=\sum_i a_i\delta[n-d_if_s]`} />
          <div className="space-y-3">
            {reverb.earlyReflections.map((reflection, index) => (
              <div key={index} className="space-y-2">
                <div className="grid gap-2 grid-cols-[auto_1fr] items-center">
                  <ControlButton
                    title={t('effect.reverb.earlyReflection.name')}
                    icon={<Minus size={18} />}
                    onClick={() => onEarlyReflectionRemove(index)}
                  />
                  <div className="text-left text-sm font-semibold">
                    {t('effect.reverb.earlyReflection.item', {
                      index: index + 1,
                    })}
                  </div>
                </div>
                <ControlRange
                  label={t('effect.reverb.earlyReflection.delay')}
                  symbol={<InlineMath math="d_i" />}
                  min="0"
                  max="0.5"
                  step="0.001"
                  value={reflection.delay}
                  displayValue={`${(reflection.delay * 1000).toFixed(0)} ms`}
                  onChange={(value) =>
                    onEarlyReflectionDelayChange(index, value)
                  }
                />
                <ControlRange
                  label={t('effect.reverb.earlyReflection.gain')}
                  symbol={<InlineMath math="a_i" />}
                  min="0"
                  max="1"
                  step="0.01"
                  value={reflection.gain}
                  displayValue={reflection.gain.toFixed(2)}
                  onChange={(value) =>
                    onEarlyReflectionGainChange(index, value)
                  }
                />
              </div>
            ))}
            <div className="grid gap-2 grid-cols-[auto_1fr] items-center">
              <ControlButton
                title={t('effect.reverb.earlyReflection.name')}
                icon={<Plus size={18} />}
                onClick={onEarlyReflectionAdd}
              />
              <div className="text-left text-sm font-semibold">
                {t('effect.reverb.earlyReflection.item', {
                  index: reverb.earlyReflections.length + 1,
                })}
              </div>
            </div>
          </div>
        </details>

        <details open className="my-2">
          <summary className="font-bold my-2">
            {t('effect.reverb.lateTail.name')}
          </summary>
          <BlockMath
            math={String.raw`h_l[n]=Ae^{-\alpha(n-Df_s)} \quad Df_s \le n \le (D+T)f_s`}
          />
          <ControlRange
            label={t('effect.reverb.lateTail.delay')}
            symbol={<InlineMath math="D" />}
            min="0"
            max="1"
            step="0.001"
            value={reverb.lateTail.delay}
            displayValue={`${(reverb.lateTail.delay * 1000).toFixed(0)} ms`}
            onChange={onLateTailDelayChange}
          />
          <ControlRange
            label={t('effect.reverb.lateTail.duration')}
            symbol={<InlineMath math="T" />}
            min="0.1"
            max="8"
            step="0.01"
            value={reverb.lateTail.duration}
            displayValue={`${reverb.lateTail.duration.toFixed(2)} s`}
            onChange={onLateTailDurationChange}
          />
          <ControlRange
            label={t('effect.reverb.lateTail.amplitude')}
            symbol={<InlineMath math="A" />}
            min="0"
            max="1"
            step="0.01"
            value={reverb.lateTail.amplitude}
            displayValue={reverb.lateTail.amplitude.toFixed(2)}
            onChange={onLateTailAmplitudeChange}
          />
          <ControlRange
            label={t('effect.reverb.lateTail.alpha')}
            symbol={<InlineMath math="\alpha" />}
            min="0.00001"
            max="0.001"
            step="0.00001"
            value={reverb.lateTail.alpha}
            displayValue={reverb.lateTail.alpha.toFixed(5)}
            onChange={onLateTailAlphaChange}
          />
        </details>
      </div>
    </details>
  );
}

export default ReverbEffect;
