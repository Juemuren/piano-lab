import { useEffect, useMemo, useState } from 'react';
import type {
  TransferFunction,
  TransferFunctionConfig,
  TransferFunctionParamUpdates,
  TransferFunctionType,
} from '../../types';
import { createTransferFunction } from '../../services/synth/SynthDefinitions';
import { useSynthEngine } from '../../contexts/synthEngine';
import {
  DEFAULT_TRANSFER_FUNCTION_TYPE,
  DEFAULT_TRANSFER_FUNCTION_BASE_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_DELAY_MS,
  DEFAULT_TRANSFER_FUNCTION_MAX_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_MIN_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_ATTENUATION,
} from '../../constants';

function useTransferFunctionControl(
  harmonicCount: number,
  initialConfig?: TransferFunctionConfig | null,
  onConfigChange?: (config: TransferFunctionConfig) => void,
) {
  const synthEngine = useSynthEngine();
  const [baseFrequency, setBaseFrequency] = useState<number>(
    () =>
      initialConfig?.baseFrequency ??
      DEFAULT_TRANSFER_FUNCTION_BASE_FREQUENCY_HZ,
  );
  const [transferFunctionType, setTransferFunctionType] =
    useState<TransferFunctionType>(
      () => initialConfig?.type ?? DEFAULT_TRANSFER_FUNCTION_TYPE,
    );
  const [tau, setTau] = useState(
    () => initialConfig?.tau ?? DEFAULT_TRANSFER_FUNCTION_DELAY_MS,
  );
  const [alpha, setAlpha] = useState(
    () => initialConfig?.alpha ?? DEFAULT_TRANSFER_FUNCTION_ATTENUATION,
  );
  const [minFrequency, setMinFrequency] = useState(
    () =>
      initialConfig?.minFrequency ?? DEFAULT_TRANSFER_FUNCTION_MIN_FREQUENCY_HZ,
  );
  const [maxFrequency, setMaxFrequency] = useState(
    () =>
      initialConfig?.maxFrequency ?? DEFAULT_TRANSFER_FUNCTION_MAX_FREQUENCY_HZ,
  );

  const transferFunction = useMemo<TransferFunction>(
    () =>
      createTransferFunction(
        {
          type: transferFunctionType,
          tau,
          alpha,
          minFrequency,
          maxFrequency,
          baseFrequency,
        },
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

  const transferFunctionConfig = useMemo<TransferFunctionConfig>(
    () => ({
      type: transferFunctionType,
      tau,
      alpha,
      minFrequency,
      maxFrequency,
      baseFrequency,
    }),
    [
      alpha,
      baseFrequency,
      maxFrequency,
      minFrequency,
      tau,
      transferFunctionType,
    ],
  );

  useEffect(() => {
    synthEngine.setTransferFunction(transferFunction, transferFunctionConfig);
  }, [synthEngine, transferFunction, transferFunctionConfig]);

  useEffect(() => {
    onConfigChange?.(transferFunctionConfig);
  }, [onConfigChange, transferFunctionConfig]);

  const handleTransferFunctionTypeChange = (type: TransferFunctionType) => {
    setTransferFunctionType(type);
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
    transferFunctionConfig,
    transferFunction,
    handleTransferFunctionTypeChange,
    handleParamsChange,
  };
}

export default useTransferFunctionControl;
