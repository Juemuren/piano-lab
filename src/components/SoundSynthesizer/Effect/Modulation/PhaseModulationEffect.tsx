import { Power, PowerOff } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { getPhaseModulationCurvePoints } from '../../../../services/synth/effect/Modulation';
import type { PhaseModulationConfig } from '../../../../types';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

interface PhaseModulationEffectProps {
  onDepthChange: (value: number) => void;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (value: number) => void;
  phaseModulation: PhaseModulationConfig | null;
}

function PhaseModulationEffect({
  phaseModulation,
  onEnabledChange,
  onFrequencyChange,
  onDepthChange,
}: PhaseModulationEffectProps) {
  const { t } = useTranslation('synth');
  const phaseModulationCurve = useMemo(
    () =>
      phaseModulation ? getPhaseModulationCurvePoints(phaseModulation) : null,
    [phaseModulation],
  );

  return (
    <details className="space-y-2" open>
      <summary className="font-semibold">
        {t('effect.modulation.phaseModulation')}
      </summary>

      <ControlButton
        icon={phaseModulation ? <Power size={18} /> : <PowerOff size={18} />}
        label={t(
          phaseModulation
            ? 'effect.modulation.phaseModulationDisabled'
            : 'effect.modulation.phaseModulationEnabled',
        )}
        onClick={() => onEnabledChange(!phaseModulation)}
        title={t('effect.modulation.phaseModulationEnabled')}
      />

      {phaseModulation && (
        <div className="space-y-2">
          <BlockMath math={String.raw`\phi(t)=\phi_{\max}\sin(2\pi f_m t)`} />
          <ControlRange
            displayValue={`${phaseModulation.frequency.toFixed(1)} Hz`}
            label={t('effect.modulation.frequency')}
            max="10"
            min="0.1"
            onChange={onFrequencyChange}
            step="0.1"
            symbol={<InlineMath math="f_m" />}
            value={phaseModulation.frequency}
          />
          <ControlRange
            displayValue={`${phaseModulation.depth.toFixed(2)} rad`}
            label={t('effect.modulation.depth')}
            max={Math.PI}
            min="0"
            onChange={onDepthChange}
            step="0.01"
            symbol={<InlineMath math="\phi_{\max}" />}
            value={phaseModulation.depth}
          />
          {phaseModulationCurve && (
            <ModulationCurvePreview
              time={phaseModulationCurve.time}
              title={t('effect.modulation.phaseCurve')}
              values={phaseModulationCurve.phase}
            />
          )}
        </div>
      )}
    </details>
  );
}

export default PhaseModulationEffect;
