import { useTranslation } from 'react-i18next';
import type { TransferFunctionType } from '../types';
import { AudioEngine } from '../services/audio/AudioEngine';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import BaseFrequencyControl from './TransferFunction/BaseFrequencyControl';
import TransferFunctionParameterControls from './TransferFunction/TransferFunctionParameterControls';
import TransferFunctionResponsePreview from './TransferFunction/TransferFunctionResponsePreview';
import useBaseFrequencyOptions from '../hooks/useBaseFrequencyOptions';
import useTransferFunctionControl from '../hooks/useTransferFunctionControl';

interface TransferFunctionModifierProps {
  audioEngine: AudioEngine;
  harmonicCount: number;
}

function TransferFunctionModifier({
  audioEngine,
  harmonicCount,
}: TransferFunctionModifierProps) {
  const { t } = useTranslation('piano');
  const { baseFreq, transferFunction, handlePresetChange, handleParamsChange } =
    useTransferFunctionControl(audioEngine, harmonicCount);
  const { selectedPitch, baseFrequencyPitchOptions } = useBaseFrequencyOptions(
    audioEngine,
    baseFreq,
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
        value={baseFreq}
        selectedPitch={selectedPitch}
        pitchOptions={baseFrequencyPitchOptions}
        getBaseFreq={(pitch) => audioEngine.getBaseFreq(pitch)}
        onChange={(value) => handleParamsChange({ baseFreq: value })}
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

export default TransferFunctionModifier;
