import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { Power, PowerOff } from 'lucide-react';
import type { TremoloConfig } from '../../../../types';
import { getTremoloCurvePoints } from '../../../../services/synth/effect/Modulation';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

interface TremoloEffectProps {
  tremolo: TremoloConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (value: number) => void;
  onDepthChange: (value: number) => void;
}

function TremoloEffect({
  tremolo,
  onEnabledChange,
  onFrequencyChange,
  onDepthChange,
}: TremoloEffectProps) {
  const { t } = useTranslation('synth');
  const tremoloCurve = useMemo(
    () => (tremolo ? getTremoloCurvePoints(tremolo) : null),
    [tremolo],
  );

  return (
    <details open className="space-y-2">
      <summary className="font-semibold">
        {t('effect.modulation.tremolo')}
      </summary>

      <ControlButton
        title={t('effect.modulation.tremoloEnabled')}
        icon={tremolo ? <Power size={18} /> : <PowerOff size={18} />}
        label={t(
          tremolo
            ? 'effect.modulation.tremoloDisabled'
            : 'effect.modulation.tremoloEnabled',
        )}
        onClick={() => onEnabledChange(!tremolo)}
      />

      {tremolo && (
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
            value={tremolo.frequency}
            displayValue={`${tremolo.frequency.toFixed(1)} Hz`}
            onChange={onFrequencyChange}
          />
          <ControlRange
            label={t('effect.modulation.depth')}
            symbol={<InlineMath math="\Delta G" />}
            min="0"
            max="0.5"
            step="0.01"
            value={tremolo.depth}
            displayValue={`${tremolo.depth.toFixed(2)}`}
            onChange={onDepthChange}
          />
          {tremoloCurve && (
            <ModulationCurvePreview
              title={t('effect.modulation.amplitudeCurve')}
              time={tremoloCurve.time}
              values={tremoloCurve.gainRatio}
            />
          )}
        </div>
      )}
    </details>
  );
}

export default TremoloEffect;
