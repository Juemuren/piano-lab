import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Timbre, TimbreType } from '../types';
import { getTimbrePreset } from '../services/audio/AudioPresets';
import { AudioEngine } from '../services/audio/AudioEngine';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import ControlRange from './shared/ControlRange';
import VerticalSliderGroup from './shared/VerticalSliderGroup';

interface TimbreAdjusterProps {
  audioEngine: AudioEngine;
  harmonicCount: number;
}

function resizeAmplitudes(amplitudes: number[], length: number) {
  return Array.from({ length }, (_, index) => amplitudes[index] ?? 0);
}

const TimbreAdjuster: React.FC<TimbreAdjusterProps> = ({
  audioEngine,
  harmonicCount,
}) => {
  const { t } = useTranslation('piano');
  const [lambda, setLambda] = useState(0.5);
  const [sigma, setSigma] = useState(0.8);
  const [p, setP] = useState(1.5);
  const [timbreType, setTimbreType] = useState<TimbreType>('ethereal');
  const [customAmplitudes, setCustomAmplitudes] = useState<number[]>(
    () =>
      getTimbrePreset(timbreType, lambda, sigma, p, harmonicCount).amplitudes,
  );

  const timbre = useMemo<Timbre>(() => {
    if (timbreType === 'custom') {
      return {
        type: 'custom',
        amplitudes: resizeAmplitudes(customAmplitudes, harmonicCount),
      };
    }
    return getTimbrePreset(timbreType, lambda, sigma, p, harmonicCount);
  }, [customAmplitudes, harmonicCount, lambda, p, sigma, timbreType]);

  useEffect(() => {
    audioEngine.setTimbre(timbre);
  }, [timbre, audioEngine]);

  const handlePresetChange = (preset: TimbreType) => {
    setCustomAmplitudes(
      getTimbrePreset(preset, lambda, sigma, p, harmonicCount).amplitudes,
    );
    setTimbreType(preset);
  };

  const handleParamsChange = (update: {
    lambda?: number;
    sigma?: number;
    p?: number;
  }) => {
    if (update.lambda !== undefined) setLambda(update.lambda);
    if (update.sigma !== undefined) setSigma(update.sigma);
    if (update.p !== undefined) setP(update.p);
  };

  const handleAmplitudeChange = (index: number, value: number) => {
    setCustomAmplitudes((prev) => {
      const amplitudes = resizeAmplitudes(prev, harmonicCount);
      amplitudes[index] = value;
      return amplitudes;
    });
    setTimbreType('custom');
  };

  const harmonicLabels = Array.from(
    { length: timbre.amplitudes.length },
    (_, index) => (
      <span>
        f<sub>{index + 1}</sub>
      </span>
    ),
  );

  return (
    <ControlPanel>
      <div className="flex flex-col mb-2 gap-3">
        <ControlSelect
          value={timbre.type}
          onChange={(e) => {
            handlePresetChange(e.target.value as TimbreType);
          }}
        >
          <option value="ethereal">{t('timbre.ethereal')}</option>
          <option value="metallic">{t('timbre.metallic')}</option>
          <option value="pure">{t('timbre.pure')}</option>
          <option value="bright">{t('timbre.bright')}</option>
          <option value="normal">{t('timbre.normal')}</option>
          <option value="soft">{t('timbre.soft')}</option>
          <option value="realistic">{t('timbre.realistic')}</option>
          <option value="custom">{t('timbre.custom')}</option>
        </ControlSelect>
      </div>

      {timbre.type === 'normal' && (
        <ControlRange
          label={t('controls.strikePoint')}
          min="0"
          max="1"
          step="0.01"
          value={lambda}
          displayValue={lambda.toFixed(2)}
          onChange={(value) => handleParamsChange({ lambda: value })}
        />
      )}

      {(timbre.type === 'soft' || timbre.type === 'realistic') && (
        <ControlRange
          label={t('controls.decayRate')}
          min="0.01"
          max="1"
          step="0.01"
          value={sigma}
          displayValue={sigma.toFixed(2)}
          onChange={(value) => handleParamsChange({ sigma: value })}
        />
      )}

      {timbre.type === 'realistic' && (
        <ControlRange
          label={t('controls.powerExponent')}
          min="0.5"
          max="4"
          step="0.1"
          value={p}
          displayValue={p.toFixed(2)}
          onChange={(value) => handleParamsChange({ p: value })}
        />
      )}

      <VerticalSliderGroup
        values={timbre.amplitudes}
        labels={harmonicLabels}
        min="0"
        max="1"
        step="0.01"
        onChange={handleAmplitudeChange}
      />
    </ControlPanel>
  );
};

export default TimbreAdjuster;
