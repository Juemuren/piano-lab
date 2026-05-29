import { useEffect, useMemo, useState } from 'react';
import type { Spectrum, SpectrumType } from '../types';
import type { AudioEngine } from '../services/audio/AudioEngine';
import { getSpectrumPreset } from '../services/audio/AudioPresets';
import {
  DEFAULT_SPECTRUM_TYPE,
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
} from '../constants';

export interface SpectrumParamUpdates {
  lambda?: number;
  sigma?: number;
  p?: number;
}

function resizeAmplitudes(amplitudes: number[], length: number) {
  return Array.from({ length }, (_, index) => amplitudes[index] ?? 0);
}

function useSpectrumControl(audioEngine: AudioEngine, harmonicCount: number) {
  const [lambda, setLambda] = useState(DEFAULT_SPECTRUM_STRIKE_POINT);
  const [sigma, setSigma] = useState(DEFAULT_SPECTRUM_DECAY_RATE);
  const [p, setP] = useState(DEFAULT_SPECTRUM_POWER_EXPONENT);
  const [timbreType, setSpectrumType] = useState<SpectrumType>(
    DEFAULT_SPECTRUM_TYPE,
  );
  const [customAmplitudes, setCustomAmplitudes] = useState<number[]>(
    () =>
      getSpectrumPreset(
        DEFAULT_SPECTRUM_TYPE,
        DEFAULT_SPECTRUM_STRIKE_POINT,
        DEFAULT_SPECTRUM_DECAY_RATE,
        DEFAULT_SPECTRUM_POWER_EXPONENT,
        harmonicCount,
      ).amplitudes,
  );

  const timbre = useMemo<Spectrum>(() => {
    if (timbreType === 'custom') {
      return {
        type: 'custom',
        amplitudes: resizeAmplitudes(customAmplitudes, harmonicCount),
      };
    }
    return getSpectrumPreset(timbreType, lambda, sigma, p, harmonicCount);
  }, [customAmplitudes, harmonicCount, lambda, p, sigma, timbreType]);

  useEffect(() => {
    audioEngine.setSpectrum(timbre);
  }, [timbre, audioEngine]);

  const handlePresetChange = (preset: SpectrumType) => {
    setCustomAmplitudes(
      getSpectrumPreset(preset, lambda, sigma, p, harmonicCount).amplitudes,
    );
    setSpectrumType(preset);
  };

  const handleParamsChange = (update: SpectrumParamUpdates) => {
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
    setSpectrumType('custom');
  };

  return {
    lambda,
    sigma,
    p,
    timbre,
    handlePresetChange,
    handleParamsChange,
    handleAmplitudeChange,
  };
}

export default useSpectrumControl;
