import { Power, PowerOff } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { getVibratoCurvePoints } from '../../../../services/synth/effect/Modulation';
import type { VibratoConfig } from '../../../../types';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

interface VibratoEffectProps {
  vibrato: VibratoConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (value: number) => void;
  onDepthChange: (value: number) => void;
}

function VibratoEffect({
  vibrato,
  onEnabledChange,
  onFrequencyChange,
  onDepthChange,
}: VibratoEffectProps) {
  const { t } = useTranslation('synth');
  const vibratoCurve = useMemo(
    () => (vibrato ? getVibratoCurvePoints(vibrato) : null),
    [vibrato],
  );

  return (
    <details open className="space-y-2">
      <summary className="font-semibold">
        {t('effect.modulation.vibrato')}
      </summary>

      <ControlButton
        title={t('effect.modulation.vibratoEnabled')}
        icon={vibrato ? <Power size={18} /> : <PowerOff size={18} />}
        label={t(
          vibrato
            ? 'effect.modulation.vibratoDisabled'
            : 'effect.modulation.vibratoEnabled',
        )}
        onClick={() => onEnabledChange(!vibrato)}
      />

      {vibrato && (
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
            value={vibrato.frequency}
            displayValue={`${vibrato.frequency.toFixed(1)} Hz`}
            onChange={onFrequencyChange}
          />
          <ControlRange
            label={t('effect.modulation.depth')}
            symbol={<InlineMath math="\Delta c" />}
            min="0"
            max="100"
            step="1"
            value={vibrato.depth}
            displayValue={`${vibrato.depth.toFixed(0)} ¢`}
            onChange={onDepthChange}
          />
          {vibratoCurve && (
            <ModulationCurvePreview
              title={t('effect.modulation.frequencyCurve')}
              time={vibratoCurve.time}
              values={vibratoCurve.frequencyRatio}
            />
          )}
        </div>
      )}
    </details>
  );
}

export default VibratoEffect;
