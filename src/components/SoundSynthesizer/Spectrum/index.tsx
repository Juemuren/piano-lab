import { useTranslation } from 'react-i18next';
import useSpectrumControl from '../../../hooks/synth/useSpectrumControl';
import type { SpectrumType } from '../../../services/synth/config/Options';
import { SPECTRUM_TYPES } from '../../../services/synth/config/Options';
import BlockMath from '../../shared/BlockMath';
import ControlSelect from '../../shared/ControlSelect';
import SpectrumFormulaPreview from './SpectrumFormulaPreview';
import SpectrumParameterControls from './SpectrumParameterControls';
import SpectrumValueControls from './SpectrumValueControls';

function Spectrum() {
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
  } = useSpectrumControl();

  return (
    <>
      <BlockMath math={String.raw`p(t) = \sum_{n=1}^{N}A_n\sin(2\pi f_n t)`} />
      <ControlSelect
        label={t('spectrum.preset')}
        onChange={(e) => {
          handleSpectrumTypeChange(e.target.value as SpectrumType);
        }}
        value={spectrumType}
      >
        {SPECTRUM_TYPES.map((type) => (
          <option key={type} value={type}>
            {t(`spectrum.presers.${type}`)}
          </option>
        ))}
      </ControlSelect>

      <SpectrumValueControls
        amplitudes={spectrum.amplitudes}
        onChange={handleAmplitudeChange}
      />

      <SpectrumParameterControls
        labels={{
          decayRate: t('spectrum.parameters.decayRate'),
          powerExponent: t('spectrum.parameters.powerExponent'),
          strikePoint: t('spectrum.parameters.strikePoint'),
        }}
        lambda={lambda}
        onChange={handleParamsChange}
        p={p}
        sigma={sigma}
        spectrumType={spectrumType}
      />

      <SpectrumFormulaPreview
        label={t('spectrum.harmonicSpectrumFormula')}
        spectrumType={spectrumType}
      />
    </>
  );
}

export default Spectrum;
