import { useEffect, useMemo, useState } from 'react';
import type { TransferFunction, TransferFunctionType } from '../types';
import type { AudioEngine } from '../services/audio/AudioEngine';
import { getTransferFunctionPreset } from '../services/audio/AudioPresets';
import {
  DEFAULT_TRANSFER_TYPE,
  DEFAULT_TRANSFER_BASE_FREQUENCY_HZ,
  DEFAULT_TRANSFER_DELAY_MS,
  DEFAULT_TRANSFER_MAX_FREQUENCY_HZ,
  DEFAULT_TRANSFER_MIN_FREQUENCY_HZ,
  DEFAULT_TRANSFER_ATTENUATION,
} from '../constants';

export interface TransferFunctionParamUpdates {
  tau?: number;
  alpha?: number;
  minFreq?: number;
  maxFreq?: number;
  baseFreq?: number;
}

function useTransferFunctionControl(
  audioEngine: AudioEngine,
  harmonicCount: number,
) {
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

  const handleParamsChange = (updates: TransferFunctionParamUpdates) => {
    if (updates.tau !== undefined) setTau(updates.tau);
    if (updates.alpha !== undefined) setAlpha(updates.alpha);
    if (updates.minFreq !== undefined) setMinFreq(updates.minFreq);
    if (updates.maxFreq !== undefined) setMaxFreq(updates.maxFreq);
    if (updates.baseFreq !== undefined) setBaseFreq(updates.baseFreq);
  };

  return {
    baseFreq,
    transferFunction,
    handlePresetChange,
    handleParamsChange,
  };
}

export default useTransferFunctionControl;
