import { useEffect, useMemo, useState } from 'react';
import type { Spectrum, SpectrumConfig, SpectrumType } from '../types';
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

function useSpectrumControl(
  audioEngine: AudioEngine,
  harmonicCount: number,
  initialConfig?: SpectrumConfig | null,
  onConfigChange?: (config: SpectrumConfig) => void,
) {
  const [lambda, setLambda] = useState(
    () => initialConfig?.lambda ?? DEFAULT_SPECTRUM_STRIKE_POINT,
  );
  const [sigma, setSigma] = useState(
    () => initialConfig?.sigma ?? DEFAULT_SPECTRUM_DECAY_RATE,
  );
  const [p, setP] = useState(
    () => initialConfig?.p ?? DEFAULT_SPECTRUM_POWER_EXPONENT,
  );
  const [spectrumType, setSpectrumType] = useState<SpectrumType>(
    () => initialConfig?.type ?? DEFAULT_SPECTRUM_TYPE,
  );
  const [customAmplitudes, setCustomAmplitudes] = useState<number[]>(
    () =>
      initialConfig?.customAmplitudes ??
      getSpectrumPreset(
        DEFAULT_SPECTRUM_TYPE,
        DEFAULT_SPECTRUM_STRIKE_POINT,
        DEFAULT_SPECTRUM_DECAY_RATE,
        DEFAULT_SPECTRUM_POWER_EXPONENT,
        harmonicCount,
      ).amplitudes,
  );

  const spectrum = useMemo<Spectrum>(() => {
    if (spectrumType === 'custom') {
      return {
        type: 'custom',
        amplitudes: resizeAmplitudes(customAmplitudes, harmonicCount),
      };
    }
    return getSpectrumPreset(spectrumType, lambda, sigma, p, harmonicCount);
  }, [customAmplitudes, harmonicCount, lambda, p, sigma, spectrumType]);

  useEffect(() => {
    audioEngine.setSpectrum(spectrum);
  }, [spectrum, audioEngine]);

  useEffect(() => {
    onConfigChange?.({
      type: spectrumType,
      lambda,
      sigma,
      p,
      customAmplitudes: resizeAmplitudes(customAmplitudes, harmonicCount),
    });
  }, [
    customAmplitudes,
    harmonicCount,
    lambda,
    onConfigChange,
    p,
    sigma,
    spectrumType,
  ]);

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
    spectrum,
    handlePresetChange,
    handleParamsChange,
    handleAmplitudeChange,
  };
}

export default useSpectrumControl;
