import { useEffect, useMemo, useState } from 'react';
import type { TransferFunction, TransferFunctionType } from '../types';
import type { AudioEngine } from '../services/audio/AudioEngine';
import { getTransferFunctionPreset } from '../services/audio/AudioPresets';
import {
  DEFAULT_TRANSFER_FUNCTION_TYPE,
  DEFAULT_TRANSFER_FUNCTION_BASE_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_DELAY_MS,
  DEFAULT_TRANSFER_FUNCTION_MAX_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_MIN_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_ATTENUATION,
} from '../constants';

export interface TransferFunctionParamUpdates {
  tau?: number;
  alpha?: number;
  minFrequency?: number;
  maxFrequency?: number;
  baseFrequency?: number;
}

function useTransferFunctionControl(
  audioEngine: AudioEngine,
  harmonicCount: number,
) {
  const [baseFrequency, setBaseFrequency] = useState<number>(
    DEFAULT_TRANSFER_FUNCTION_BASE_FREQUENCY_HZ,
  );
  const [transferFunctionType, setTransferFunctionType] =
    useState<TransferFunctionType>(DEFAULT_TRANSFER_FUNCTION_TYPE);
  const [tau, setTau] = useState(DEFAULT_TRANSFER_FUNCTION_DELAY_MS);
  const [alpha, setAlpha] = useState(DEFAULT_TRANSFER_FUNCTION_ATTENUATION);
  const [minFrequency, setMinFrequency] = useState(
    DEFAULT_TRANSFER_FUNCTION_MIN_FREQUENCY_HZ,
  );
  const [maxFrequency, setMaxFrequency] = useState(
    DEFAULT_TRANSFER_FUNCTION_MAX_FREQUENCY_HZ,
  );

  const transferFunction = useMemo<TransferFunction>(
    () =>
      getTransferFunctionPreset(
        transferFunctionType,
        tau,
        alpha,
        minFrequency,
        maxFrequency,
        baseFrequency,
        harmonicCount,
      ),
    [
      alpha,
      baseFrequency,
      harmonicCount,
      maxFrequency,
      minFrequency,
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

  const handleParamsChange = (updates: TransferFunctionParamUpdates) => {
    if (updates.tau !== undefined) setTau(updates.tau);
    if (updates.alpha !== undefined) setAlpha(updates.alpha);
    if (updates.minFrequency !== undefined) {
      setMinFrequency(updates.minFrequency);
    }
    if (updates.maxFrequency !== undefined) {
      setMaxFrequency(updates.maxFrequency);
    }
    if (updates.baseFrequency !== undefined) {
      setBaseFrequency(updates.baseFrequency);
    }
  };

  return {
    baseFrequency,
    transferFunction,
    handlePresetChange,
    handleParamsChange,
  };
}

export default useTransferFunctionControl;
