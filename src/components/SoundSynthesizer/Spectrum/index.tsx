import { useTranslation } from 'react-i18next';
import type { SpectrumType } from '../../../types';
import { AudioEngine } from '../../../services/audio/AudioEngine';
import ControlPanel from '../../shared/ControlPanel';
import ControlSelect from '../../shared/ControlSelect';
import SpectrumValueControls from './SpectrumValueControls';
import SpectrumParameterControls from './SpectrumParameterControls';
import SpectrumFormulaPreview from './SpectrumFormulaPreview';
import useSpectrumControl from '../../../hooks/useSpectrumControl';

interface SpectrumProps {
  audioEngine: AudioEngine;
  harmonicCount: number;
}

function Spectrum({ audioEngine, harmonicCount }: SpectrumProps) {
  const { t } = useTranslation('piano');
  const {
    lambda,
    sigma,
    p,
    timbre,
    handlePresetChange,
    handleParamsChange,
    handleAmplitudeChange,
  } = useSpectrumControl(audioEngine, harmonicCount);

  return (
    <ControlPanel>
      <ControlSelect
        value={timbre.type}
        onChange={(e) => {
          handlePresetChange(e.target.value as SpectrumType);
        }}
      >
        <option value="metallic">{t('timbre.metallic')}</option>
        <option value="pure">{t('timbre.pure')}</option>
        <option value="bright">{t('timbre.bright')}</option>
        <option value="ethereal">{t('timbre.ethereal')}</option>
        <option value="normal">{t('timbre.normal')}</option>
        <option value="soft">{t('timbre.soft')}</option>
        <option value="realistic">{t('timbre.realistic')}</option>
        <option value="custom">{t('timbre.custom')}</option>
      </ControlSelect>

      <SpectrumValueControls
        amplitudes={timbre.amplitudes}
        onChange={handleAmplitudeChange}
      />

      <SpectrumParameterControls
        timbre={timbre}
        lambda={lambda}
        sigma={sigma}
        p={p}
        labels={{
          strikePoint: t('controls.strikePoint'),
          decayRate: t('controls.decayRate'),
          powerExponent: t('controls.powerExponent'),
        }}
        onChange={handleParamsChange}
      />

      <SpectrumFormulaPreview
        timbreType={timbre.type}
        label={t('controls.relativeAmplitudeRelation')}
      />
    </ControlPanel>
  );
}

export default Spectrum;
