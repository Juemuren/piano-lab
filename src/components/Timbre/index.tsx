import { useTranslation } from 'react-i18next';
import type { TimbreType } from '../../types';
import { AudioEngine } from '../../services/audio/AudioEngine';
import ControlPanel from '../shared/ControlPanel';
import ControlSelect from '../shared/ControlSelect';
import HarmonicAmplitudeControls from './HarmonicAmplitudeControls';
import TimbreParameterControls from './TimbreParameterControls';
import TimbreFormulaDetails from './TimbreFormulaDetails';
import useTimbreControl from '../../hooks/useTimbreControl';

interface TimbreAdjusterProps {
  audioEngine: AudioEngine;
  harmonicCount: number;
}

function TimbreAdjuster({ audioEngine, harmonicCount }: TimbreAdjusterProps) {
  const { t } = useTranslation('piano');
  const {
    lambda,
    sigma,
    p,
    timbre,
    handlePresetChange,
    handleParamsChange,
    handleAmplitudeChange,
  } = useTimbreControl(audioEngine, harmonicCount);

  return (
    <ControlPanel>
      <ControlSelect
        value={timbre.type}
        onChange={(e) => {
          handlePresetChange(e.target.value as TimbreType);
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

      <HarmonicAmplitudeControls
        amplitudes={timbre.amplitudes}
        onChange={handleAmplitudeChange}
      />

      <TimbreParameterControls
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

      <TimbreFormulaDetails
        timbreType={timbre.type}
        label={t('controls.relativeAmplitudeRelation')}
      />
    </ControlPanel>
  );
}

export default TimbreAdjuster;
