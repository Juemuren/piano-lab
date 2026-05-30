import { useTranslation } from 'react-i18next';
import type { TransferFunctionType } from '../../../types';
import type { TransferFunctionConfig } from '../../../types';
import { AudioEngine } from '../../../services/audio/AudioEngine';
import ControlPanel from '../../shared/ControlPanel';
import ControlSelect from '../../shared/ControlSelect';
import BaseFrequencyControl from './BaseFrequencyControl';
import TransferFunctionParameterControls from './TransferFunctionParameterControls';
import TransferFunctionResponsePreview from './TransferFunctionResponsePreview';
import useBaseFrequencyOptions from '../../../hooks/useBaseFrequencyOptions';
import useTransferFunctionControl from '../../../hooks/useTransferFunctionControl';

interface TransferFunctionProps {
  audioEngine: AudioEngine;
  harmonicCount: number;
  initialConfig?: TransferFunctionConfig | null;
  onConfigChange?: (config: TransferFunctionConfig) => void;
}

function TransferFunction({
  audioEngine,
  harmonicCount,
  initialConfig,
  onConfigChange,
}: TransferFunctionProps) {
  const { t } = useTranslation('piano');
  const {
    baseFrequency,
    transferFunction,
    handlePresetChange,
    handleParamsChange,
  } = useTransferFunctionControl(
    audioEngine,
    harmonicCount,
    initialConfig,
    onConfigChange,
  );
  const { selectedPitch, baseFrequencyPitchOptions } = useBaseFrequencyOptions(
    audioEngine,
    baseFrequency,
  );

  return (
    <ControlPanel>
      <ControlSelect
        value={transferFunction.type}
        onChange={(e) =>
          handlePresetChange(e.target.value as TransferFunctionType)
        }
      >
        <option value="delay">{t('transferFunction.delay')}</option>
        <option value="single_echo">{t('transferFunction.single_echo')}</option>
        <option value="multi_echo">{t('transferFunction.multi_echo')}</option>
        <option value="all_pass">{t('transferFunction.all_pass')}</option>
        <option value="low_pass">{t('transferFunction.low_pass')}</option>
        <option value="high_pass">{t('transferFunction.high_pass')}</option>
        <option value="band_pass">{t('transferFunction.band_pass')}</option>
      </ControlSelect>

      <BaseFrequencyControl
        label={t('controls.baseFrequency')}
        hint={t('controls.baseFrequencyPreviewHint')}
        value={baseFrequency}
        selectedPitch={selectedPitch}
        pitchOptions={baseFrequencyPitchOptions}
        getBaseFrequency={(pitch) => audioEngine.getBaseFrequency(pitch)}
        onChange={(value) => handleParamsChange({ baseFrequency: value })}
      />

      <TransferFunctionParameterControls
        transferFunction={transferFunction}
        labels={{
          delayTime: t('controls.delayTime'),
          attenuation: t('controls.attenuation'),
          minFrequency: t('controls.minFrequency'),
          maxFrequency: t('controls.maxFrequency'),
        }}
        onChange={handleParamsChange}
      />

      <TransferFunctionResponsePreview
        transferFunction={transferFunction}
        labels={{
          magnitudeResponse: t('charts.magnitudeResponse'),
          phaseResponse: t('charts.phaseResponse'),
        }}
      />
    </ControlPanel>
  );
}

export default TransferFunction;
