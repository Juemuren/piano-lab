import { InlineMath } from 'react-katex';
import type { TransferFunction } from '../../../types';
import type { TransferFunctionParamUpdates } from '../../../hooks/synth/useTransferFunctionControl';
import ControlRange from '../../shared/ControlRange';

interface TransferFunctionParameterControlsProps {
  transferFunction: TransferFunction;
  labels: {
    delayTime: string;
    attenuation: string;
    minFrequency: string;
    maxFrequency: string;
  };
  onChange: (updates: TransferFunctionParamUpdates) => void;
}

function TransferFunctionParameterControls({
  transferFunction,
  labels,
  onChange,
}: TransferFunctionParameterControlsProps) {
  return (
    <>
      {(transferFunction.type === 'delay' ||
        transferFunction.type === 'single_echo' ||
        transferFunction.type === 'multi_echo' ||
        transferFunction.type === 'all_pass') && (
        <ControlRange
          label={labels.delayTime}
          symbol={<InlineMath math="\tau" />}
          min="0"
          max="100"
          step="0.1"
          value={transferFunction.tau}
          displayValue={`${transferFunction.tau.toFixed(1)} ms`}
          onChange={(value) => onChange({ tau: value })}
        />
      )}

      {(transferFunction.type === 'single_echo' ||
        transferFunction.type === 'multi_echo' ||
        transferFunction.type === 'all_pass') && (
        <ControlRange
          label={labels.attenuation}
          symbol={<InlineMath math="\alpha" />}
          min="0"
          max="0.5"
          step="0.01"
          value={transferFunction.alpha}
          displayValue={transferFunction.alpha.toFixed(2)}
          onChange={(value) => onChange({ alpha: value })}
        />
      )}

      {(transferFunction.type === 'high_pass' ||
        transferFunction.type === 'band_pass') && (
        <ControlRange
          label={labels.minFrequency}
          symbol={<InlineMath math="f_{\min}" />}
          min="20"
          max="20000"
          step="10"
          value={transferFunction.minFrequency}
          displayValue={`${transferFunction.minFrequency} Hz`}
          onChange={(value) => onChange({ minFrequency: value })}
        />
      )}

      {(transferFunction.type === 'low_pass' ||
        transferFunction.type === 'band_pass') && (
        <ControlRange
          label={labels.maxFrequency}
          symbol={<InlineMath math="f_{\max}" />}
          min="20"
          max="20000"
          step="10"
          value={transferFunction.maxFrequency}
          displayValue={`${transferFunction.maxFrequency} Hz`}
          onChange={(value) => onChange({ maxFrequency: value })}
        />
      )}
    </>
  );
}

export default TransferFunctionParameterControls;
