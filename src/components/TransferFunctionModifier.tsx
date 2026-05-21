import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TransferFunction, TransferFunctionType } from '../types';
import { getTransferFunctionPreset } from '../services/audio/AudioPresets';
import { AudioEngine } from '../services/audio/AudioEngine';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import ControlRange from './shared/ControRange';
import VerticalSliderGroup from './shared/VerticalSliderGroup';

interface TransferFunctionModifierProps {
  audioEngine: AudioEngine;
}

const TransferFunctionModifier: React.FC<TransferFunctionModifierProps> = ({
  audioEngine,
}) => {
  const { t } = useTranslation('piano');
  const [baseFreq, setBaseFreq] = useState<number>(440);
  const [transferFunction, setTransferFunction] = useState<TransferFunction>(
    () => getTransferFunctionPreset('delay', 0, 0.1, 20, 20000, 440),
  );

  useEffect(() => {
    audioEngine.setTransferFunction(transferFunction);
  }, [transferFunction, audioEngine]);

  const handlePresetChange = (preset: TransferFunctionType) => {
    setTransferFunction((prev) =>
      getTransferFunctionPreset(
        preset,
        prev.tau,
        prev.alpha,
        prev.minFreq,
        prev.maxFreq,
        baseFreq,
      ),
    );
  };

  const handleParamsChange = (updates: {
    tau?: number;
    alpha?: number;
    minFreq?: number;
    maxFreq?: number;
    baseFreq?: number;
  }) => {
    setTransferFunction((prev) =>
      getTransferFunctionPreset(
        prev.type,
        updates.tau ?? prev.tau,
        updates.alpha ?? prev.alpha,
        updates.minFreq ?? prev.minFreq,
        updates.maxFreq ?? prev.maxFreq,
        updates.baseFreq ?? baseFreq,
      ),
    );
    if (updates.baseFreq) setBaseFreq(updates.baseFreq);
  };

  const harmonicLabels = Array.from(
    { length: transferFunction.magnitudes.length },
    (_, index) => (
      <span>
        f<sub>{index + 1}</sub>
      </span>
    ),
  );

  return (
    <ControlPanel>
      <div className="mb-2 flex flex-col gap-3">
        <div className="space-y-2">
          <ControlSelect
            value={transferFunction.type}
            onChange={(e) =>
              handlePresetChange(e.target.value as TransferFunctionType)
            }
          >
            <option value="delay">{t('transferFunction.delay')}</option>
            <option value="single_echo">
              {t('transferFunction.single_echo')}
            </option>
            <option value="multi_echo">
              {t('transferFunction.multi_echo')}
            </option>
            <option value="all_pass">{t('transferFunction.all_pass')}</option>
            <option value="low_pass">{t('transferFunction.low_pass')}</option>
            <option value="high_pass">{t('transferFunction.high_pass')}</option>
            <option value="band_pass">{t('transferFunction.band_pass')}</option>
          </ControlSelect>
        </div>
      </div>

      <ControlRange
        label={t('controls.baseFrequency')}
        min="20"
        max="20000"
        step="1"
        value={baseFreq}
        displayValue={`${baseFreq} Hz`}
        accentClassName="accent-sky-500"
        onChange={(value) => handleParamsChange({ baseFreq: value })}
      />

      {(transferFunction.type === 'delay' ||
        transferFunction.type === 'single_echo' ||
        transferFunction.type === 'multi_echo' ||
        transferFunction.type === 'all_pass') && (
        <ControlRange
          label={t('controls.delayTime')}
          min="0"
          max="100"
          step="0.1"
          value={transferFunction.tau}
          displayValue={`${transferFunction.tau.toFixed(1)} ms`}
          onChange={(value) => handleParamsChange({ tau: value })}
        />
      )}

      {(transferFunction.type === 'single_echo' ||
        transferFunction.type === 'multi_echo' ||
        transferFunction.type === 'all_pass') && (
        <ControlRange
          label={t('controls.attenuation')}
          min="0"
          max="0.5"
          step="0.01"
          value={transferFunction.alpha}
          displayValue={transferFunction.alpha.toFixed(2)}
          onChange={(value) => handleParamsChange({ alpha: value })}
        />
      )}

      {(transferFunction.type === 'high_pass' ||
        transferFunction.type === 'band_pass') && (
        <ControlRange
          label={t('controls.minFrequency')}
          min="20"
          max="20000"
          step="10"
          value={transferFunction.minFreq}
          displayValue={`${transferFunction.minFreq} Hz`}
          onChange={(value) => handleParamsChange({ minFreq: value })}
        />
      )}

      {(transferFunction.type === 'low_pass' ||
        transferFunction.type === 'band_pass') && (
        <ControlRange
          label={t('controls.maxFrequency')}
          min="20"
          max="20000"
          step="10"
          value={transferFunction.maxFreq}
          displayValue={`${transferFunction.maxFreq} Hz`}
          onChange={(value) => handleParamsChange({ maxFreq: value })}
        />
      )}

      <h3 className="mb-2 text-lg font-medium">
        {t('charts.magnitudeResponse')}
      </h3>
      <VerticalSliderGroup
        values={transferFunction.magnitudes}
        labels={harmonicLabels}
        min="0"
        max="2"
        step="0.01"
        getKey={(index) => `mag-${index}`}
        disabled
      />

      <h3 className="mb-2 text-lg font-medium">{t('charts.phaseResponse')}</h3>
      <VerticalSliderGroup
        values={transferFunction.phases}
        labels={harmonicLabels}
        min="-180"
        max="180"
        step="1"
        getKey={(index) => `phase-${index}`}
        formatValue={(value) => `${value.toFixed(0)}°`}
        disabled
      />
    </ControlPanel>
  );
};

export default TransferFunctionModifier;
