import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { useAmplitudeModulationControl } from '../../../../hooks/synth/effect/useModulationControl';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import { getAmplitudeModulationCurvePoints } from '../../../../services/synth/effect/Modulation';
import BlockMath from '../../../shared/BlockMath';
import ControlRange from '../../../shared/ControlRange';
import EffectToggleButton from '../EffectToggleButton';
import ModulationCurvePreview from './ModulationCurvePreview';

function AmplitudeModulationEffect() {
  const { t } = useTranslation('synth');
  const {
    config: amplitudeModulation,
    updateDepth: onDepthChange,
    updateEnabled: onEnabledChange,
    updateFrequency: onFrequencyChange,
  } = useAmplitudeModulationControl();
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

      <EffectToggleButton
        disableLabel={t('effect.modulation.amplitudeModulationDisabled')}
        enabled={Boolean(amplitudeModulation)}
        enableLabel={t('effect.modulation.amplitudeModulationEnabled')}
        onClick={() => onEnabledChange(!amplitudeModulation)}
        title={t('effect.modulation.amplitudeModulationEnabled')}
      />

      {amplitudeModulation && (
        <div className="space-y-2">
          <BlockMath
            math={String.raw`A_y(t)=[1-\Delta G+\Delta G\sin(2\pi f_m t)]A_x(t)`}
          />
          <ControlRange
            {...SYNTH_CONFIG_RANGES.effect.amplitudeModulation.frequency}
            displayValue={`${amplitudeModulation.frequency.toFixed(1)} Hz`}
            label={t('effect.modulation.frequency')}
            onChange={onFrequencyChange}
            step="0.1"
            symbol={<InlineMath math="f_m" />}
            value={amplitudeModulation.frequency}
          />
          <ControlRange
            {...SYNTH_CONFIG_RANGES.effect.amplitudeModulation.depth}
            displayValue={`${amplitudeModulation.depth.toFixed(2)}`}
            label={t('effect.modulation.depth')}
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
