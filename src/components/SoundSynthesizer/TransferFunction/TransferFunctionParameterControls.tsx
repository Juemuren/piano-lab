import { InlineMath } from 'react-katex';
import type {
  TransferFunctionConfig,
  TransferFunctionParamUpdates,
} from '../../../types';
import ControlRange from '../../shared/ControlRange';

interface TransferFunctionParameterControlsProps {
  transferFunctionConfig: TransferFunctionConfig;
  labels: {
    delayTime: string;
    attenuation: string;
    minFrequency: string;
    maxFrequency: string;
  };
  onChange: (updates: TransferFunctionParamUpdates) => void;
}

function TransferFunctionParameterControls({
  transferFunctionConfig,
  labels,
  onChange,
}: TransferFunctionParameterControlsProps) {
  return (
    <>
      {(transferFunctionConfig.type === 'delay' ||
        transferFunctionConfig.type === 'single_echo' ||
        transferFunctionConfig.type === 'multi_echo' ||
        transferFunctionConfig.type === 'all_pass') && (
        <ControlRange
          label={labels.delayTime}
          symbol={<InlineMath math="\tau" />}
          min="0"
          max="100"
          step="0.1"
          value={transferFunctionConfig.tau}
          displayValue={`${transferFunctionConfig.tau.toFixed(1)} ms`}
          onChange={(value) => onChange({ tau: value })}
        />
      )}

      {(transferFunctionConfig.type === 'single_echo' ||
        transferFunctionConfig.type === 'multi_echo' ||
        transferFunctionConfig.type === 'all_pass') && (
        <ControlRange
          label={labels.attenuation}
          symbol={<InlineMath math="\alpha" />}
          min="0"
          max="0.5"
          step="0.01"
          value={transferFunctionConfig.alpha}
          displayValue={transferFunctionConfig.alpha.toFixed(2)}
          onChange={(value) => onChange({ alpha: value })}
        />
      )}

      {(transferFunctionConfig.type === 'high_pass' ||
        transferFunctionConfig.type === 'band_pass') && (
        <ControlRange
          label={labels.minFrequency}
          symbol={<InlineMath math="f_{\min}" />}
          min="20"
          max="20000"
          step="10"
          value={transferFunctionConfig.minFrequency}
          displayValue={`${transferFunctionConfig.minFrequency} Hz`}
          onChange={(value) => onChange({ minFrequency: value })}
        />
      )}

      {(transferFunctionConfig.type === 'low_pass' ||
        transferFunctionConfig.type === 'band_pass') && (
        <ControlRange
          label={labels.maxFrequency}
          symbol={<InlineMath math="f_{\max}" />}
          min="20"
          max="20000"
          step="10"
          value={transferFunctionConfig.maxFrequency}
          displayValue={`${transferFunctionConfig.maxFrequency} Hz`}
          onChange={(value) => onChange({ maxFrequency: value })}
        />
      )}
    </>
  );
}

export default TransferFunctionParameterControls;
