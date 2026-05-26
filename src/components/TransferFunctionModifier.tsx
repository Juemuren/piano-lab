import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TransferFunction, TransferFunctionType } from '../types';
import { getTransferFunctionPreset } from '../services/audio/AudioPresets';
import { AudioEngine } from '../services/audio/AudioEngine';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import ControlRange from './shared/ControlRange';
import VerticalSliderGroup from './shared/VerticalSliderGroup';
import {
  MAX_PIANO_PITCH,
  MIN_PIANO_PITCH,
  getPitchLabel,
  getPitchOptions,
} from '../utils/pitch';
import {
  DEFAULT_TRANSFER_TYPE,
  DEFAULT_TRANSFER_BASE_FREQUENCY_HZ,
  DEFAULT_TRANSFER_DELAY_MS,
  DEFAULT_TRANSFER_MAX_FREQUENCY_HZ,
  DEFAULT_TRANSFER_MIN_FREQUENCY_HZ,
  DEFAULT_TRANSFER_ATTENUATION,
} from '../constants';

interface TransferFunctionModifierProps {
  audioEngine: AudioEngine;
  harmonicCount: number;
}

const PITCH_OPTIONS = getPitchOptions();

function TransferFunctionModifier({
  audioEngine,
  harmonicCount,
}: TransferFunctionModifierProps) {
  const { t } = useTranslation('piano');
  const [baseFreq, setBaseFreq] = useState<number>(
    DEFAULT_TRANSFER_BASE_FREQUENCY_HZ,
  );
  const [transferFunctionType, setTransferFunctionType] =
    useState<TransferFunctionType>(DEFAULT_TRANSFER_TYPE);
  const [tau, setTau] = useState(DEFAULT_TRANSFER_DELAY_MS);
  const [alpha, setAlpha] = useState(DEFAULT_TRANSFER_ATTENUATION);
  const [minFreq, setMinFreq] = useState(DEFAULT_TRANSFER_MIN_FREQUENCY_HZ);
  const [maxFreq, setMaxFreq] = useState(DEFAULT_TRANSFER_MAX_FREQUENCY_HZ);

  const transferFunction = useMemo<TransferFunction>(
    () =>
      getTransferFunctionPreset(
        transferFunctionType,
        tau,
        alpha,
        minFreq,
        maxFreq,
        baseFreq,
        harmonicCount,
      ),
    [
      alpha,
      baseFreq,
      harmonicCount,
      maxFreq,
      minFreq,
      tau,
      transferFunctionType,
    ],
  );

  useEffect(() => {
    audioEngine.setTransferFunction(transferFunction);
  }, [transferFunction, audioEngine]);

  const handlePresetChange = (preset: TransferFunctionType) => {
    setTransferFunctionType(preset);
  };

  const handleParamsChange = (updates: {
    tau?: number;
    alpha?: number;
    minFreq?: number;
    maxFreq?: number;
    baseFreq?: number;
  }) => {
    if (updates.tau !== undefined) setTau(updates.tau);
    if (updates.alpha !== undefined) setAlpha(updates.alpha);
    if (updates.minFreq !== undefined) setMinFreq(updates.minFreq);
    if (updates.maxFreq !== undefined) setMaxFreq(updates.maxFreq);
    if (updates.baseFreq !== undefined) setBaseFreq(updates.baseFreq);
  };

  const minBaseFreq = audioEngine.getBaseFreq(MIN_PIANO_PITCH);
  const maxBaseFreq = audioEngine.getBaseFreq(MAX_PIANO_PITCH);
  const selectedPitch = PITCH_OPTIONS.find(
    ({ pitch }) => audioEngine.getBaseFreq(pitch) === baseFreq,
  )?.pitch;
  let lowerPitch = MIN_PIANO_PITCH;
  for (const { pitch } of PITCH_OPTIONS) {
    if (audioEngine.getBaseFreq(pitch) <= baseFreq) {
      lowerPitch = pitch;
    }
  }
  const upperPitch = Math.min(lowerPitch + 1, MAX_PIANO_PITCH);
  const pitchRangeLabel = selectedPitch
    ? getPitchLabel(selectedPitch)
    : `${getPitchLabel(lowerPitch)} ~ ${getPitchLabel(upperPitch)}`;

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

      <div
        className="
          mb-4 p-4 rounded-2xl
          border border-app-border dark:border-app-border-dark
        "
      >
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <ControlRange
            label={t('controls.baseFrequency')}
            min={minBaseFreq}
            max={maxBaseFreq}
            step="1"
            value={baseFreq}
            displayValue={`${baseFreq.toFixed(2)} Hz`}
            accentClassName="accent-app-info dark:accent-app-info-dark"
            onChange={(value) => handleParamsChange({ baseFreq: value })}
          />
          <ControlSelect
            value={selectedPitch ?? 'custom'}
            aria-label={t('controls.baseFrequencyPitch')}
            onChange={(e) =>
              handleParamsChange({
                baseFreq: audioEngine.getBaseFreq(Number(e.target.value)),
              })
            }
          >
            {selectedPitch === undefined && (
              <option value="custom">{pitchRangeLabel}</option>
            )}
            {PITCH_OPTIONS.map(({ pitch, label }) => (
              <option key={pitch} value={pitch}>
                {label}
              </option>
            ))}
          </ControlSelect>
        </div>
        <p className="text-xs leading-5 text-app-text/50 dark:text-app-text-dark/50">
          {t('controls.baseFrequencyPreviewHint')}
        </p>
      </div>

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
}

export default TransferFunctionModifier;
