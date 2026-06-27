import { InlineMath } from 'react-katex';
import type { SpectrumType } from '../../../services/synth/config/Options';
import type { SpectrumParamUpdates } from '../../../types';
import ControlRange from '../../shared/ControlRange';

interface SpectrumParameterControlsProps {
  labels: {
    strikePoint: string;
    decayRate: string;
    powerExponent: string;
  };
  lambda: number;
  onChange: (updates: SpectrumParamUpdates) => void;
  p: number;
  sigma: number;
  spectrumType: SpectrumType;
}

function SpectrumParameterControls({
  spectrumType,
  lambda,
  sigma,
  p,
  labels,
  onChange,
}: SpectrumParameterControlsProps) {
  return (
    <>
      {spectrumType === 'normal' && (
        <ControlRange
          displayValue={lambda.toFixed(2)}
          label={labels.strikePoint}
          max="1"
          min="0"
          onChange={(value) => onChange({ lambda: value })}
          step="0.01"
          symbol={<InlineMath math="\lambda" />}
          value={lambda}
        />
      )}

      {(spectrumType === 'soft' || spectrumType === 'realistic') && (
        <ControlRange
          displayValue={sigma.toFixed(2)}
          label={labels.decayRate}
          max="1"
          min="0.01"
          onChange={(value) => onChange({ sigma: value })}
          step="0.01"
          symbol={<InlineMath math="\sigma" />}
          value={sigma}
        />
      )}

      {spectrumType === 'realistic' && (
        <ControlRange
          displayValue={p.toFixed(2)}
          label={labels.powerExponent}
          max="4"
          min="0.5"
          onChange={(value) => onChange({ p: value })}
          step="0.1"
          symbol={<InlineMath math="p" />}
          value={p}
        />
      )}
    </>
  );
}

export default SpectrumParameterControls;
