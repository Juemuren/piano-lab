import { Power, PowerOff } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { useDelayModulationControl } from '../../../../hooks/synth/effect/useModulationControl';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import { getDelayModulationCurvePoints } from '../../../../services/synth/effect/Modulation';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

function DelayModulationEffect() {
  const { t } = useTranslation('synth');
  const {
    config: delayModulation,
    updateDepth: onDepthChange,
    updateEnabled: onEnabledChange,
    updateFrequency: onFrequencyChange,
  } = useDelayModulationControl();
  const delayModulationCurve = useMemo(
    () =>
      delayModulation ? getDelayModulationCurvePoints(delayModulation) : null,
    [delayModulation],
  );

  return (
    <details className="space-y-2" open>
      <summary className="font-semibold">
        {t('effect.modulation.delayModulation')}
      </summary>

      <ControlButton
        icon={delayModulation ? <Power size={18} /> : <PowerOff size={18} />}
        label={t(
          delayModulation
            ? 'effect.modulation.delayModulationDisabled'
            : 'effect.modulation.delayModulationEnabled',
        )}
        onClick={() => onEnabledChange(!delayModulation)}
        title={t('effect.modulation.delayModulationEnabled')}
      />

      {delayModulation && (
        <div className="space-y-2">
          <BlockMath
            math={String.raw`\tau(t)=\frac{\tau_{\max}}{2}+\frac{\tau_{\max}}{2}\sin(2\pi f_m t)`}
          />
          <ControlRange
            {...SYNTH_CONFIG_RANGES.effect.delayModulation.frequency}
            displayValue={`${delayModulation.frequency.toFixed(1)} Hz`}
            label={t('effect.modulation.frequency')}
            onChange={onFrequencyChange}
            step="0.1"
            symbol={<InlineMath math="f_m" />}
            value={delayModulation.frequency}
          />
          <ControlRange
            {...SYNTH_CONFIG_RANGES.effect.delayModulation.depth}
            displayValue={`${(delayModulation.depth * 1000).toFixed(0)} ms`}
            label={t('effect.modulation.depth')}
            onChange={onDepthChange}
            step="0.001"
            symbol={<InlineMath math="\tau_{\max}" />}
            value={delayModulation.depth}
          />
          {delayModulationCurve && (
            <ModulationCurvePreview
              time={delayModulationCurve.time}
              title={t('effect.modulation.delayCurve')}
              values={delayModulationCurve.delaySeconds}
            />
          )}
        </div>
      )}
    </details>
  );
}

export default DelayModulationEffect;
