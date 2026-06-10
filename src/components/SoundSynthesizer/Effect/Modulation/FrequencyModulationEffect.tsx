import { Power, PowerOff } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { getFrequencyModulationCurvePoints } from '../../../../services/synth/effect/Modulation';
import type { FrequencyModulationConfig } from '../../../../types';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

interface FrequencyModulationEffectProps {
  frequencyModulation: FrequencyModulationConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (value: number) => void;
  onDepthChange: (value: number) => void;
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
    <details open className="space-y-2">
      <summary className="font-semibold">
        {t('effect.modulation.frequencyModulation')}
      </summary>

      <ControlButton
        title={t('effect.modulation.frequencyModulationEnabled')}
        icon={
          frequencyModulation ? <Power size={18} /> : <PowerOff size={18} />
        }
        label={t(
          frequencyModulation
            ? 'effect.modulation.frequencyModulationDisabled'
            : 'effect.modulation.frequencyModulationEnabled',
        )}
        onClick={() => onEnabledChange(!frequencyModulation)}
      />

      {frequencyModulation && (
        <div className="space-y-2">
          <BlockMath
            math={String.raw`f_y(t)=[1 + (2^{\Delta c/1200}-1)\sin(2\pi f_m t)]f_x(t)`}
          />
          <ControlRange
            label={t('effect.modulation.frequency')}
            symbol={<InlineMath math="f_m" />}
            min="0.1"
            max="20"
            step="0.1"
            value={frequencyModulation.frequency}
            displayValue={`${frequencyModulation.frequency.toFixed(1)} Hz`}
            onChange={onFrequencyChange}
          />
          <ControlRange
            label={t('effect.modulation.depth')}
            symbol={<InlineMath math="\Delta c" />}
            min="0"
            max="100"
            step="1"
            value={frequencyModulation.depth}
            displayValue={`${frequencyModulation.depth.toFixed(0)} ¢`}
            onChange={onDepthChange}
          />
          {frequencyModulationCurve && (
            <ModulationCurvePreview
              title={t('effect.modulation.frequencyCurve')}
              time={frequencyModulationCurve.time}
              values={frequencyModulationCurve.frequencyRatio}
            />
          )}
        </div>
      )}
    </details>
  );
}

export default FrequencyModulationEffect;
