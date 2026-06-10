import { Power, PowerOff } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { getAmplitudeModulationCurvePoints } from '../../../../services/synth/effect/Modulation';
import type { AmplitudeModulationConfig } from '../../../../types';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

interface AmplitudeModulationEffectProps {
  amplitudeModulation: AmplitudeModulationConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (value: number) => void;
  onDepthChange: (value: number) => void;
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
    <details open className="space-y-2">
      <summary className="font-semibold">
        {t('effect.modulation.amplitudeModulation')}
      </summary>

      <ControlButton
        title={t('effect.modulation.amplitudeModulationEnabled')}
        icon={
          amplitudeModulation ? <Power size={18} /> : <PowerOff size={18} />
        }
        label={t(
          amplitudeModulation
            ? 'effect.modulation.amplitudeModulationDisabled'
            : 'effect.modulation.amplitudeModulationEnabled',
        )}
        onClick={() => onEnabledChange(!amplitudeModulation)}
      />

      {amplitudeModulation && (
        <div className="space-y-2">
          <BlockMath
            math={String.raw`A_y(t)=[1-\Delta G+\Delta G\sin(2\pi f_m t)]A_x(t)`}
          />
          <ControlRange
            label={t('effect.modulation.frequency')}
            symbol={<InlineMath math="f_m" />}
            min="0.1"
            max="20"
            step="0.1"
            value={amplitudeModulation.frequency}
            displayValue={`${amplitudeModulation.frequency.toFixed(1)} Hz`}
            onChange={onFrequencyChange}
          />
          <ControlRange
            label={t('effect.modulation.depth')}
            symbol={<InlineMath math="\Delta G" />}
            min="0"
            max="0.5"
            step="0.01"
            value={amplitudeModulation.depth}
            displayValue={`${amplitudeModulation.depth.toFixed(2)}`}
            onChange={onDepthChange}
          />
          {amplitudeModulationCurve && (
            <ModulationCurvePreview
              title={t('effect.modulation.amplitudeCurve')}
              time={amplitudeModulationCurve.time}
              values={amplitudeModulationCurve.gainRatio}
            />
          )}
        </div>
      )}
    </details>
  );
}

export default AmplitudeModulationEffect;
