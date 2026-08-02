import { Power, PowerOff } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { useFrequencyModulationControl } from '../../../../hooks/synth/effect/useModulationControl';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import { getFrequencyModulationCurvePoints } from '../../../../services/synth/effect/Modulation';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

function FrequencyModulationEffect() {
  const { t } = useTranslation('synth');
  const {
    config: frequencyModulation,
    updateDepth: onDepthChange,
    updateEnabled: onEnabledChange,
    updateFrequency: onFrequencyChange,
  } = useFrequencyModulationControl();
  const frequencyModulationCurve = useMemo(
    () =>
      frequencyModulation
        ? getFrequencyModulationCurvePoints(frequencyModulation)
        : null,
    [frequencyModulation],
  );

  return (
    <details className="space-y-2" open>
      <summary className="font-semibold">
        {t('effect.modulation.frequencyModulation')}
      </summary>

      <ControlButton
        icon={
          frequencyModulation ? <Power size={18} /> : <PowerOff size={18} />
        }
        label={t(
          frequencyModulation
            ? 'effect.modulation.frequencyModulationDisabled'
            : 'effect.modulation.frequencyModulationEnabled',
        )}
        onClick={() => onEnabledChange(!frequencyModulation)}
        title={t('effect.modulation.frequencyModulationEnabled')}
      />

      {frequencyModulation && (
        <div className="space-y-2">
          <BlockMath
            math={String.raw`f_y(t)=[1 + (2^{\Delta c/1200}-1)\sin(2\pi f_m t)]f_x(t)`}
          />
          <ControlRange
            {...SYNTH_CONFIG_RANGES.effect.frequencyModulation.frequency}
            displayValue={`${frequencyModulation.frequency.toFixed(1)} Hz`}
            label={t('effect.modulation.frequency')}
            onChange={onFrequencyChange}
            step="0.1"
            symbol={<InlineMath math="f_m" />}
            value={frequencyModulation.frequency}
          />
          <ControlRange
            {...SYNTH_CONFIG_RANGES.effect.frequencyModulation.depth}
            displayValue={`${frequencyModulation.depth.toFixed(0)} ¢`}
            label={t('effect.modulation.depth')}
            onChange={onDepthChange}
            step="1"
            symbol={<InlineMath math="\Delta c" />}
            value={frequencyModulation.depth}
          />
          {frequencyModulationCurve && (
            <ModulationCurvePreview
              time={frequencyModulationCurve.time}
              title={t('effect.modulation.frequencyCurve')}
              values={frequencyModulationCurve.frequencyRatio}
            />
          )}
        </div>
      )}
    </details>
  );
}

export default FrequencyModulationEffect;
