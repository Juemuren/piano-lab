import { useEffect, useMemo, useState } from 'react';
import type {
  Spectrum,
  SpectrumConfig,
  SpectrumParamUpdates,
  SpectrumType,
} from '../../types';
import { createSpectrum } from '../../services/synth/SynthDefinitions';
import { useSynthEngine } from '../../contexts/useSynthEngine';
import {
  DEFAULT_SPECTRUM_TYPE,
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
} from '../../constants';

function resizeAmplitudes(amplitudes: number[], length: number) {
  return Array.from({ length }, (_, index) => amplitudes[index] ?? 0);
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
          type: DEFAULT_SPECTRUM_TYPE,
          lambda: DEFAULT_SPECTRUM_STRIKE_POINT,
          sigma: DEFAULT_SPECTRUM_DECAY_RATE,
          p: DEFAULT_SPECTRUM_POWER_EXPONENT,
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
      { type: spectrumType, lambda, sigma, p },
      harmonicCount,
    );
  }, [customAmplitudes, harmonicCount, lambda, p, sigma, spectrumType]);

  useEffect(() => {
    synthEngine.setSpectrum(spectrum);
  }, [spectrum, synthEngine]);

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

  const handleSpectrumTypeChange = (type: SpectrumType) => {
    if (type !== 'custom') {
      setCustomAmplitudes(
        createSpectrum({ type, lambda, sigma, p }, harmonicCount).amplitudes,
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
    lambda,
    sigma,
    p,
    spectrumType,
    spectrum,
    handleSpectrumTypeChange,
    handleParamsChange,
    handleAmplitudeChange,
  };
}

export default useSpectrumControl;
