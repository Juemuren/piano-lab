import { useTranslation } from 'react-i18next';
import useSpectrumControl from '../../../hooks/synth/useSpectrumControl';
import type { SpectrumConfig, SpectrumType } from '../../../types';
import BlockMath from '../../shared/BlockMath';
import ControlSelect from '../../shared/ControlSelect';
import SpectrumFormulaPreview from './SpectrumFormulaPreview';
import SpectrumParameterControls from './SpectrumParameterControls';
import SpectrumValueControls from './SpectrumValueControls';

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
      <BlockMath math={String.raw`p(t) = \sum_{n=1}^{N}A_n\sin(2\pi f_n t)`} />
      <ControlSelect
        label={t('spectrum.preset')}
        onChange={(e) => {
          handleSpectrumTypeChange(e.target.value as SpectrumType);
        }}
        value={spectrumType}
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
