import { Power, PowerOff } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import type { FrequencyModulationConfig } from '../../../../services/synth/effect/Modulation';
import { getFrequencyModulationCurvePoints } from '../../../../services/synth/effect/Modulation';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

interface FrequencyModulationEffectProps {
  frequencyModulation: FrequencyModulationConfig | null;
  onDepthChange: (value: number) => void;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (value: number) => void;
}

function FrequencyModulationEffect({
  frequencyModulation,
  onEnabledChange,
  onFrequencyChange,
  onDepthChange,
}: FrequencyModulationEffectProps) {
  const { t } = useTranslation('synth');
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
            displayValue={`${frequencyModulation.frequency.toFixed(1)} Hz`}
            label={t('effect.modulation.frequency')}
            max="20"
            min="0.1"
            onChange={onFrequencyChange}
            step="0.1"
            symbol={<InlineMath math="f_m" />}
            value={frequencyModulation.frequency}
          />
          <ControlRange
            displayValue={`${frequencyModulation.depth.toFixed(0)} ¢`}
            label={t('effect.modulation.depth')}
            max="100"
            min="0"
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
