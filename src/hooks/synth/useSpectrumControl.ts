import { useCallback, useMemo } from 'react';
import type { SpectrumType } from '../../services/synth/config/Options';
import type {
  Spectrum,
  SpectrumParamUpdates,
} from '../../services/synth/Spectrum';
import { createSpectrum } from '../../services/synth/Spectrum';
import { useSynthConfigStore } from '../../stores/synthConfigStore';

function resizeAmplitudes(amplitudes: number[], length: number) {
  return Array.from({ length }, (_, index) => amplitudes[index] ?? 0);
}

function createEmptyAmplitudes(length: number) {
  return Array.from({ length }, () => 0);
}

function useSpectrumControl() {
  const harmonicCount = useSynthConfigStore(
    (state) => state.config.synth.harmonicCount,
  );
  const config = useSynthConfigStore((state) => state.config.spectrum);
  const setSpectrumConfig = useSynthConfigStore(
    (state) => state.setSpectrumConfig,
  );
  const { customAmplitudes, lambda, p, sigma, type: spectrumType } = config;

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

  const handleSpectrumTypeChange = useCallback(
    (type: SpectrumType) => {
      setSpectrumConfig((current) => ({
        ...current,
        customAmplitudes:
          type === 'custom'
            ? createEmptyAmplitudes(harmonicCount)
            : createSpectrum({ ...current, type }, harmonicCount).amplitudes,
        type,
      }));
    },
    [harmonicCount, setSpectrumConfig],
  );

  const handleParamsChange = useCallback(
    (update: SpectrumParamUpdates) => {
      setSpectrumConfig((current) => ({ ...current, ...update }));
    },
    [setSpectrumConfig],
  );

  const handleAmplitudeChange = useCallback(
    (index: number, value: number) => {
      setSpectrumConfig((current) => {
        const customAmplitudes = resizeAmplitudes(
          current.customAmplitudes,
          harmonicCount,
        );
        customAmplitudes[index] = value;

        return { ...current, customAmplitudes, type: 'custom' };
      });
    },
    [harmonicCount, setSpectrumConfig],
  );

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
