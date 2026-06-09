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
  phaseModulation: PhaseModulationConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (value: number) => void;
  onDepthChange: (value: number) => void;
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
    <details open className="space-y-2">
      <summary className="font-semibold">
        {t('effect.modulation.phaseModulation')}
      </summary>

      <ControlButton
        title={t('effect.modulation.phaseModulationEnabled')}
        icon={phaseModulation ? <Power size={18} /> : <PowerOff size={18} />}
        label={t(
          phaseModulation
            ? 'effect.modulation.phaseModulationDisabled'
            : 'effect.modulation.phaseModulationEnabled',
        )}
        onClick={() => onEnabledChange(!phaseModulation)}
      />

      {phaseModulation && (
        <div className="space-y-2">
          <BlockMath math={String.raw`\phi(t)=\phi_{\max}\sin(2\pi f_m t)`} />
          <ControlRange
            label={t('effect.modulation.frequency')}
            symbol={<InlineMath math="f_m" />}
            min="0.1"
            max="10"
            step="0.1"
            value={phaseModulation.frequency}
            displayValue={`${phaseModulation.frequency.toFixed(1)} Hz`}
            onChange={onFrequencyChange}
          />
          <ControlRange
            label={t('effect.modulation.depth')}
            symbol={<InlineMath math="\phi_{\max}" />}
            min="0"
            max={Math.PI}
            step="0.01"
            value={phaseModulation.depth}
            displayValue={`${phaseModulation.depth.toFixed(2)} rad`}
            onChange={onDepthChange}
          />
          {phaseModulationCurve && (
            <ModulationCurvePreview
              title={t('effect.modulation.phaseCurve')}
              time={phaseModulationCurve.time}
              values={phaseModulationCurve.phase}
            />
          )}
        </div>
      )}
    </details>
  );
}

export default PhaseModulationEffect;
