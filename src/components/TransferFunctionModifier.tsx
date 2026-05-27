import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import type { TransferFunction, TransferFunctionType } from '../types';
import { getTransferFunctionPreset } from '../services/audio/AudioPresets';
import { AudioEngine } from '../services/audio/AudioEngine';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import ControlRange from './shared/ControlRange';
import VerticalSliderGroup from './shared/VerticalSliderGroup';
import { getPitchOptions } from '../utils/pitch';
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

const TRANSFER_FORMULAS: Record<
  TransferFunctionType,
  { magnitude: string; phase: string }
> = {
  delay: {
    magnitude: String.raw`|H(f)| = 1`,
    phase: String.raw`\angle H(f) = -2\pi\tau f`,
  },
  single_echo: {
    magnitude: String.raw`|H(f)| = \sqrt{1 + \alpha^2 + 2\alpha\cos(2\pi\tau f)}`,
    phase: String.raw`\angle H(f) = -\arctan\frac{\alpha\sin(2\pi\tau f)}{1 + \alpha\cos(2\pi\tau f)}`,
  },
  multi_echo: {
    magnitude: String.raw`|H(f)| = \frac1{\sqrt{1 + \alpha^2 - 2\alpha\cos(2\pi\tau f)}}`,
    phase: String.raw`\angle H(f) = -\arctan\frac{\alpha\sin(2\pi\tau f)}{1 - \alpha\cos(2\pi\tau f)}`,
  },
  all_pass: {
    magnitude: String.raw`|H(f)| = 1`,
    phase: String.raw`\angle H(f) = -2\pi\tau f - 2\arctan\frac{\alpha\sin(2\pi\tau f)}{1 - \alpha\cos(2\pi\tau f)}`,
  },
  low_pass: {
    magnitude: String.raw`\mathbf{1}_{f \le f_{\max}}`,
    phase: String.raw`\angle H(f) = 0`,
  },
  high_pass: {
    magnitude: String.raw`\mathbf{1}_{f \ge f_{\min}}`,
    phase: String.raw`\angle H(f) = 0`,
  },
  band_pass: {
    magnitude: String.raw`\mathbf{1}_{f \le f_{\max} \land f \ge f_{\min}}`,
    phase: String.raw`\angle H(f) = 0`,
  },
};

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

  const selectedPitch = PITCH_OPTIONS.find(
    ({ pitch }) =>
      Math.abs(audioEngine.getBaseFreq(pitch) - baseFreq) < Number.EPSILON,
  )?.pitch;

  const firstHigherPitchIndex = PITCH_OPTIONS.findIndex(
    ({ pitch }) => audioEngine.getBaseFreq(pitch) > baseFreq,
  );
  let pitchRangeLabel;
  switch (firstHigherPitchIndex) {
    case -1:
      pitchRangeLabel = `> ${PITCH_OPTIONS.at(firstHigherPitchIndex)?.label}`;
      break;
    case 0:
      pitchRangeLabel = `< ${PITCH_OPTIONS.at(firstHigherPitchIndex)?.label}`;
      break;
    default:
      pitchRangeLabel = `${PITCH_OPTIONS.at(firstHigherPitchIndex - 1)?.label} ~ ${PITCH_OPTIONS.at(firstHigherPitchIndex)?.label}`;
      break;
  }

  const customPitchOptionIndex =
    firstHigherPitchIndex === -1 ? PITCH_OPTIONS.length : firstHigherPitchIndex;
  const baseFrequencyPitchOptions =
    selectedPitch === undefined
      ? [
          ...PITCH_OPTIONS.slice(0, customPitchOptionIndex),
          { pitch: 'custom' as const, label: pitchRangeLabel },
          ...PITCH_OPTIONS.slice(customPitchOptionIndex),
        ]
      : PITCH_OPTIONS;

  const harmonicLabels = Array.from(
    { length: transferFunction.magnitudes.length },
    (_, index) => (
      <span key={index}>
        f<sub>{index + 1}</sub>
      </span>
    ),
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

      <div className="my-4">
        <div className="grid sm:gap-3 sm:grid-cols-[2fr_1fr]">
          <ControlRange
            label={t('controls.baseFrequency')}
            symbol={<InlineMath math="f" />}
            min="20"
            max="5000"
            step="1"
            value={baseFreq}
            displayValue={`${baseFreq.toFixed(2)} Hz`}
            accentClassName="accent-app-info dark:accent-app-info-dark"
            onChange={(value) => handleParamsChange({ baseFreq: value })}
          />
          <ControlSelect
            value={selectedPitch ?? 'custom'}
            onChange={(e) => {
              if (e.target.value === 'custom') return;
              handleParamsChange({
                baseFreq: audioEngine.getBaseFreq(Number(e.target.value)),
              });
            }}
          >
            {baseFrequencyPitchOptions.map(({ pitch, label }) => (
              <option key={pitch} value={pitch}>
                {label}
              </option>
            ))}
          </ControlSelect>
        </div>
        <p className="mt-2 text-xs text-app-info/50 dark:text-app-info-dark/50">
          {t('controls.baseFrequencyPreviewHint')}
        </p>
      </div>

      {(transferFunction.type === 'delay' ||
        transferFunction.type === 'single_echo' ||
        transferFunction.type === 'multi_echo' ||
        transferFunction.type === 'all_pass') && (
        <ControlRange
          label={t('controls.delayTime')}
          symbol={<InlineMath math="\tau" />}
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
          symbol={<InlineMath math="\alpha" />}
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
          symbol={<InlineMath math="f_{\min}" />}
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
          symbol={<InlineMath math="f_{\max}" />}
          min="20"
          max="20000"
          step="10"
          value={transferFunction.maxFreq}
          displayValue={`${transferFunction.maxFreq} Hz`}
          onChange={(value) => handleParamsChange({ maxFreq: value })}
        />
      )}

      <h3 className="my-3 text-lg font-medium">
        {t('charts.magnitudeResponse')}
      </h3>
      <BlockMath math={TRANSFER_FORMULAS[transferFunction.type].magnitude} />
      <VerticalSliderGroup
        values={transferFunction.magnitudes}
        labels={harmonicLabels}
        min="0"
        max="2"
        step="0.01"
        getKey={(index) => `mag-${index}`}
        disabled
      />

      <h3 className="my-3 text-lg font-medium">{t('charts.phaseResponse')}</h3>
      <BlockMath math={TRANSFER_FORMULAS[transferFunction.type].phase} />
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
