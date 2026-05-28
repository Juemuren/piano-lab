import { useEffect, useMemo, useState } from 'react';
import type { Timbre, TimbreType } from '../types';
import type { AudioEngine } from '../services/audio/AudioEngine';
import { getTimbrePreset } from '../services/audio/AudioPresets';
import {
  DEFAULT_TIMBRE_TYPE,
  DEFAULT_TIMBRE_DECAY_RATE,
  DEFAULT_TIMBRE_POWER_EXPONENT,
  DEFAULT_TIMBRE_STRIKE_POINT,
} from '../constants';

export interface TimbreParamUpdates {
  lambda?: number;
  sigma?: number;
  p?: number;
}

function resizeAmplitudes(amplitudes: number[], length: number) {
  return Array.from({ length }, (_, index) => amplitudes[index] ?? 0);
}

function useTimbreControl(audioEngine: AudioEngine, harmonicCount: number) {
  const [lambda, setLambda] = useState(DEFAULT_TIMBRE_STRIKE_POINT);
  const [sigma, setSigma] = useState(DEFAULT_TIMBRE_DECAY_RATE);
  const [p, setP] = useState(DEFAULT_TIMBRE_POWER_EXPONENT);
  const [timbreType, setTimbreType] = useState<TimbreType>(
    DEFAULT_TIMBRE_TYPE,
  );
  const [customAmplitudes, setCustomAmplitudes] = useState<number[]>(
    () =>
      getTimbrePreset(
        DEFAULT_TIMBRE_TYPE,
        DEFAULT_TIMBRE_STRIKE_POINT,
        DEFAULT_TIMBRE_DECAY_RATE,
        DEFAULT_TIMBRE_POWER_EXPONENT,
        harmonicCount,
      ).amplitudes,
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

  const handleParamsChange = (update: TimbreParamUpdates) => {
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

export default useTimbreControl;
