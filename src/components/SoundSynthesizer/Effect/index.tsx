import { useTranslation } from 'react-i18next';
import type { EffectConfig, EffectType } from '../../../types';
import ControlSelect from '../../shared/ControlSelect';
import BaseFrequencyControl from './BaseFrequencyControl';
import EffectParameterControls from './EffectParameterControls';
import EffectResponsePreview from './EffectResponsePreview';
import useBaseFrequencyOptions from '../../../hooks/synth/useBaseFrequencyOptions';
import useEffectControl from '../../../hooks/synth/useEffectControl';
import { getBaseFrequency } from '../../../services/synth/SynthCalculations';

interface EffectProps {
  harmonicCount: number;
  initialConfig?: EffectConfig | null;
  onConfigChange?: (config: EffectConfig) => void;
}

function Effect({ harmonicCount, initialConfig, onConfigChange }: EffectProps) {
  const { t } = useTranslation('synth');
  const {
    baseFrequency,
    effectConfig,
    effect,
    handleEffectTypeChange,
    handleParamsChange,
  } = useEffectControl(harmonicCount, initialConfig, onConfigChange);
  const { selectedPitch, baseFrequencyPitchOptions } =
    useBaseFrequencyOptions(baseFrequency);

  return (
    <>
      <ControlSelect
        value={effectConfig.type}
        onChange={(e) => handleEffectTypeChange(e.target.value as EffectType)}
      >
        <option value="delay">{t('effect.delay')}</option>
        <option value="single_echo">{t('effect.single_echo')}</option>
        <option value="multi_echo">{t('effect.multi_echo')}</option>
        <option value="all_pass">{t('effect.all_pass')}</option>
        <option value="low_pass">{t('effect.low_pass')}</option>
        <option value="high_pass">{t('effect.high_pass')}</option>
        <option value="band_pass">{t('effect.band_pass')}</option>
      </ControlSelect>

      <BaseFrequencyControl
        labelRange={t('controls.baseFrequency')}
        labelSelect={t('controls.pitch')}
        hint={t('controls.baseFrequencyPreviewHint')}
        value={baseFrequency}
        selectedPitch={selectedPitch}
        pitchOptions={baseFrequencyPitchOptions}
        getBaseFrequency={getBaseFrequency}
        onChange={(value) => handleParamsChange({ baseFrequency: value })}
      />

      <EffectParameterControls
        effectConfig={effectConfig}
        labels={{
          delayTime: t('controls.delayTime'),
          attenuation: t('controls.attenuation'),
          minFrequency: t('controls.minFrequency'),
          maxFrequency: t('controls.maxFrequency'),
        }}
        onChange={handleParamsChange}
      />

      <EffectResponsePreview
        effectType={effectConfig.type}
        effect={effect}
        labels={{
          magnitudeResponse: t('charts.magnitudeResponse'),
          phaseResponse: t('charts.phaseResponse'),
        }}
      />
    </>
  );
}

export default Effect;
