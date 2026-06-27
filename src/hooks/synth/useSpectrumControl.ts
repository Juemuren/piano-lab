import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
  DEFAULT_SPECTRUM_TYPE,
} from '../../constants/synth';
import { useSynthEngine } from '../../contexts/synthEngine';
import type { SpectrumType } from '../../services/synth/config/Options';
import { createSpectrum } from '../../services/synth/Spectrum';
import type {
  Spectrum,
  SpectrumConfig,
  SpectrumParamUpdates,
} from '../../types/synth';

function resizeAmplitudes(amplitudes: number[], length: number) {
  return Array.from({ length }, (_, index) => amplitudes[index] ?? 0);
}

function createEmptyAmplitudes(length: number) {
  return Array.from({ length }, () => 0);
}

function useSpectrumControl(
  harmonicCount: number,
  initialConfig?: SpectrumConfig | null,
  onConfigChange?: (config: SpectrumConfig) => void,
) {
  const synthEngine = useSynthEngine();
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
      createSpectrum(
        {
          lambda: DEFAULT_SPECTRUM_STRIKE_POINT,
          p: DEFAULT_SPECTRUM_POWER_EXPONENT,
          sigma: DEFAULT_SPECTRUM_DECAY_RATE,
          type: DEFAULT_SPECTRUM_TYPE,
        },
        harmonicCount,
      ).amplitudes,
  );

  const spectrum = useMemo<Spectrum>(() => {
    if (spectrumType === 'custom') {
      return {
        amplitudes: resizeAmplitudes(customAmplitudes, harmonicCount),
      };
    }
    return createSpectrum(
      { lambda, p, sigma, type: spectrumType },
      harmonicCount,
    );
  }, [customAmplitudes, harmonicCount, lambda, p, sigma, spectrumType]);

  useEffect(() => {
    synthEngine.configureSpectrum(spectrum);
  }, [spectrum, synthEngine]);

  useEffect(() => {
    onConfigChange?.({
      customAmplitudes: resizeAmplitudes(customAmplitudes, harmonicCount),
      lambda,
      p,
      sigma,
      type: spectrumType,
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

  const handleSpectrumTypeChange = (type: SpectrumType) => {
    if (type === 'custom') {
      setCustomAmplitudes(createEmptyAmplitudes(harmonicCount));
    } else {
      setCustomAmplitudes(
        createSpectrum({ lambda, p, sigma, type }, harmonicCount).amplitudes,
      );
    }
    setSpectrumType(type);
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
    handleAmplitudeChange,
    handleParamsChange,
    handleSpectrumTypeChange,
    lambda,
    p,
    sigma,
    spectrum,
    spectrumType,
  };
}

export default useSpectrumControl;
