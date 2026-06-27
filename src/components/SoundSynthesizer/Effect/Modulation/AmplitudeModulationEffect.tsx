import { Power, PowerOff } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { getAmplitudeModulationCurvePoints } from '../../../../services/synth/effect/Modulation';
import type { AmplitudeModulationConfig } from '../../../../types/synth';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

interface AmplitudeModulationEffectProps {
  amplitudeModulation: AmplitudeModulationConfig | null;
  onDepthChange: (value: number) => void;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (value: number) => void;
}

function AmplitudeModulationEffect({
  amplitudeModulation,
  onEnabledChange,
  onFrequencyChange,
  onDepthChange,
}: AmplitudeModulationEffectProps) {
  const { t } = useTranslation('synth');
  const amplitudeModulationCurve = useMemo(
    () =>
      amplitudeModulation
        ? getAmplitudeModulationCurvePoints(amplitudeModulation)
        : null,
    [amplitudeModulation],
  );

  return (
    <details className="space-y-2" open>
      <summary className="font-semibold">
        {t('effect.modulation.amplitudeModulation')}
      </summary>

      <ControlButton
        icon={
          amplitudeModulation ? <Power size={18} /> : <PowerOff size={18} />
        }
        label={t(
          amplitudeModulation
            ? 'effect.modulation.amplitudeModulationDisabled'
            : 'effect.modulation.amplitudeModulationEnabled',
        )}
        onClick={() => onEnabledChange(!amplitudeModulation)}
        title={t('effect.modulation.amplitudeModulationEnabled')}
      />

      {amplitudeModulation && (
        <div className="space-y-2">
          <BlockMath
            math={String.raw`A_y(t)=[1-\Delta G+\Delta G\sin(2\pi f_m t)]A_x(t)`}
          />
          <ControlRange
            displayValue={`${amplitudeModulation.frequency.toFixed(1)} Hz`}
            label={t('effect.modulation.frequency')}
            max="20"
            min="0.1"
            onChange={onFrequencyChange}
            step="0.1"
            symbol={<InlineMath math="f_m" />}
            value={amplitudeModulation.frequency}
          />
          <ControlRange
            displayValue={`${amplitudeModulation.depth.toFixed(2)}`}
            label={t('effect.modulation.depth')}
            max="0.5"
            min="0"
            onChange={onDepthChange}
            step="0.01"
            symbol={<InlineMath math="\Delta G" />}
            value={amplitudeModulation.depth}
          />
          {amplitudeModulationCurve && (
            <ModulationCurvePreview
              time={amplitudeModulationCurve.time}
              title={t('effect.modulation.amplitudeCurve')}
              values={amplitudeModulationCurve.gainRatio}
            />
          )}
        </div>
      )}
    </details>
  );
}

export default AmplitudeModulationEffect;
