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
    spectrum,
    handlePresetChange,
    handleParamsChange,
    handleAmplitudeChange,
  } = useSpectrumControl(audioEngine, harmonicCount);

  return (
    <ControlPanel>
      <ControlSelect
        value={spectrum.type}
        onChange={(e) => {
          handlePresetChange(e.target.value as SpectrumType);
        }}
      >
        <option value="metallic">{t('spectrum.metallic')}</option>
        <option value="pure">{t('spectrum.pure')}</option>
        <option value="bright">{t('spectrum.bright')}</option>
        <option value="ethereal">{t('spectrum.ethereal')}</option>
        <option value="normal">{t('spectrum.normal')}</option>
        <option value="soft">{t('spectrum.soft')}</option>
        <option value="realistic">{t('spectrum.realistic')}</option>
        <option value="custom">{t('spectrum.custom')}</option>
      </ControlSelect>

      <SpectrumValueControls
        amplitudes={spectrum.amplitudes}
        onChange={handleAmplitudeChange}
      />

      <SpectrumParameterControls
        spectrum={spectrum}
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
        spectrumType={spectrum.type}
        label={t('controls.relativeAmplitudeRelation')}
      />
    </ControlPanel>
  );
}

export default Spectrum;
