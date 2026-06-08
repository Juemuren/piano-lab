import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { Power, PowerOff } from 'lucide-react';
import type { DelayModulationConfig } from '../../../../types';
import { getDelayModulationCurvePoints } from '../../../../services/synth/effect/Modulation';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

interface DelayModulationEffectProps {
  delayModulation: DelayModulationConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (value: number) => void;
  onDepthChange: (value: number) => void;
}

function DelayModulationEffect({
  delayModulation,
  onEnabledChange,
  onFrequencyChange,
  onDepthChange,
}: DelayModulationEffectProps) {
  const { t } = useTranslation('synth');
  const delayModulationCurve = useMemo(
    () =>
      delayModulation ? getDelayModulationCurvePoints(delayModulation) : null,
    [delayModulation],
  );

  return (
    <details open className="space-y-2">
      <summary className="font-semibold">
        {t('effect.modulation.delayModulation')}
      </summary>

      <ControlButton
        title={t('effect.modulation.delayModulationEnabled')}
        icon={delayModulation ? <Power size={18} /> : <PowerOff size={18} />}
        label={t(
          delayModulation
            ? 'effect.modulation.delayModulationDisabled'
            : 'effect.modulation.delayModulationEnabled',
        )}
        onClick={() => onEnabledChange(!delayModulation)}
      />

      {delayModulation && (
        <div className="space-y-2">
          <BlockMath
            math={String.raw`\tau_y(t)=\frac{d}{2}+\frac{d}{2}\sin(2\pi f_m t)`}
          />
          <ControlRange
            label={t('effect.modulation.frequency')}
            symbol={<InlineMath math="f_m" />}
            min="0.1"
            max="10"
            step="0.1"
            value={delayModulation.frequency}
            displayValue={`${delayModulation.frequency.toFixed(1)} Hz`}
            onChange={onFrequencyChange}
          />
          <ControlRange
            label={t('effect.modulation.depth')}
            symbol={<InlineMath math="d" />}
            min="0"
            max="0.02"
            step="0.001"
            value={delayModulation.depth}
            displayValue={`${(delayModulation.depth * 1000).toFixed(0)} ms`}
            onChange={onDepthChange}
          />
          {delayModulationCurve && (
            <ModulationCurvePreview
              title={t('effect.modulation.delayCurve')}
              time={delayModulationCurve.time}
              values={delayModulationCurve.delaySeconds}
            />
          )}
        </div>
      )}
    </details>
  );
}

export default DelayModulationEffect;
