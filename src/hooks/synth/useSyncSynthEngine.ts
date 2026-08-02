import { useEffect, useMemo } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';
import { createSpectrum } from '../../services/synth/Spectrum';
import { useSynthConfigStore } from '../../stores/synthConfigStore';

function useSyncSynthEngine() {
  const synthEngine = useSynthEngine();
  const synth = useSynthConfigStore((state) => state.config.synth);
  const spectrumConfig = useSynthConfigStore((state) => state.config.spectrum);
  const envelope = useSynthConfigStore((state) => state.config.envelope);
  const effect = useSynthConfigStore((state) => state.config.effect);
  const spectrum = useMemo(() => {
    const { customAmplitudes, lambda, p, sigma, type } = spectrumConfig;

    return type === 'custom'
      ? { amplitudes: customAmplitudes }
      : createSpectrum({ lambda, p, sigma, type }, synth.harmonicCount);
  }, [spectrumConfig, synth.harmonicCount]);

  useEffect(() => {
    synthEngine.configureSynth(synth);
  }, [synth, synthEngine]);

  useEffect(() => {
    synthEngine.configureSpectrum(spectrum);
  }, [spectrum, synthEngine]);

  useEffect(() => {
    synthEngine.configureEnvelope(envelope);
  }, [envelope, synthEngine]);

  useEffect(() => {
    synthEngine.configureEffect(effect);
  }, [effect, synthEngine]);
}

export default useSyncSynthEngine;
