import { useTranslation } from 'react-i18next';
import type { SpectrumType } from '../../../types';
import type { SpectrumConfig } from '../../../types';
import ControlSelect from '../../shared/ControlSelect';
import SpectrumValueControls from './SpectrumValueControls';
import SpectrumParameterControls from './SpectrumParameterControls';
import SpectrumFormulaPreview from './SpectrumFormulaPreview';
import useSpectrumControl from '../../../hooks/synth/useSpectrumControl';

interface SpectrumProps {
  harmonicCount: number;
  initialConfig?: SpectrumConfig | null;
  onConfigChange?: (config: SpectrumConfig) => void;
}

function Spectrum({
  harmonicCount,
  initialConfig,
  onConfigChange,
}: SpectrumProps) {
  const { t } = useTranslation('synth');
  const {
    lambda,
    sigma,
    p,
    spectrumType,
    spectrum,
    handleSpectrumTypeChange,
    handleParamsChange,
    handleAmplitudeChange,
  } = useSpectrumControl(harmonicCount, initialConfig, onConfigChange);

  return (
    <>
      <ControlSelect
        value={spectrumType}
        onChange={(e) => {
          handleSpectrumTypeChange(e.target.value as SpectrumType);
        }}
      >
        <option value="metallic">{t('spectrum.presers.metallic')}</option>
        <option value="pure">{t('spectrum.presers.pure')}</option>
        <option value="bright">{t('spectrum.presers.bright')}</option>
        <option value="ethereal">{t('spectrum.presers.ethereal')}</option>
        <option value="normal">{t('spectrum.presers.normal')}</option>
        <option value="soft">{t('spectrum.presers.soft')}</option>
        <option value="realistic">{t('spectrum.presers.realistic')}</option>
        <option value="custom">{t('spectrum.presers.custom')}</option>
      </ControlSelect>

      <SpectrumValueControls
        amplitudes={spectrum.amplitudes}
        onChange={handleAmplitudeChange}
      />

      <SpectrumParameterControls
        spectrumType={spectrumType}
        lambda={lambda}
        sigma={sigma}
        p={p}
        labels={{
          strikePoint: t('spectrum.parameters.strikePoint'),
          decayRate: t('spectrum.parameters.decayRate'),
          powerExponent: t('spectrum.parameters.powerExponent'),
        }}
        onChange={handleParamsChange}
      />

      <SpectrumFormulaPreview
        spectrumType={spectrumType}
        label={t('spectrum.harmonicSpectrumFormula')}
      />
    </>
  );
}

export default Spectrum;
