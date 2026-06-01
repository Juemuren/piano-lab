import { useTranslation } from 'react-i18next';
import type { TransferFunctionType } from '../../../types';
import type { TransferFunctionConfig } from '../../../types';
import ControlSelect from '../../shared/ControlSelect';
import BaseFrequencyControl from './BaseFrequencyControl';
import TransferFunctionParameterControls from './TransferFunctionParameterControls';
import TransferFunctionResponsePreview from './TransferFunctionResponsePreview';
import useBaseFrequencyOptions from '../../../hooks/synth/useBaseFrequencyOptions';
import useTransferFunctionControl from '../../../hooks/synth/useTransferFunctionControl';
import { useSynthEngine } from '../../../contexts/useSynthEngine';

interface TransferFunctionProps {
  harmonicCount: number;
  initialConfig?: TransferFunctionConfig | null;
  onConfigChange?: (config: TransferFunctionConfig) => void;
}

function TransferFunction({
  harmonicCount,
  initialConfig,
  onConfigChange,
}: TransferFunctionProps) {
  const { t } = useTranslation('synth');
  const synthEngine = useSynthEngine();
  const {
    baseFrequency,
    transferFunctionConfig,
    transferFunction,
    handleTransferFunctionTypeChange,
    handleParamsChange,
  } = useTransferFunctionControl(harmonicCount, initialConfig, onConfigChange);
  const { selectedPitch, baseFrequencyPitchOptions } =
    useBaseFrequencyOptions(baseFrequency);

  return (
    <>
      <ControlSelect
        value={transferFunctionConfig.type}
        onChange={(e) =>
          handleTransferFunctionTypeChange(
            e.target.value as TransferFunctionType,
          )
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
        getBaseFrequency={(pitch) => synthEngine.getBaseFrequency(pitch)}
        onChange={(value) => handleParamsChange({ baseFrequency: value })}
      />

      <TransferFunctionParameterControls
        transferFunctionConfig={transferFunctionConfig}
        labels={{
          delayTime: t('controls.delayTime'),
          attenuation: t('controls.attenuation'),
          minFrequency: t('controls.minFrequency'),
          maxFrequency: t('controls.maxFrequency'),
        }}
        onChange={handleParamsChange}
      />

      <TransferFunctionResponsePreview
        transferFunctionType={transferFunctionConfig.type}
        transferFunction={transferFunction}
        labels={{
          magnitudeResponse: t('charts.magnitudeResponse'),
          phaseResponse: t('charts.phaseResponse'),
        }}
      />
    </>
  );
}

export default TransferFunction;
