import { InlineMath } from 'react-katex';
import type { SpectrumType } from '../../../types';
import type { SpectrumParamUpdates } from '../../../hooks/synth/useSpectrumControl';
import ControlRange from '../../shared/ControlRange';

interface SpectrumParameterControlsProps {
  spectrumType: SpectrumType;
  lambda: number;
  sigma: number;
  p: number;
  labels: {
    strikePoint: string;
    decayRate: string;
    powerExponent: string;
  };
  onChange: (updates: SpectrumParamUpdates) => void;
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
          label={labels.strikePoint}
          symbol={<InlineMath math="\lambda" />}
          min="0"
          max="1"
          step="0.01"
          value={lambda}
          displayValue={lambda.toFixed(2)}
          onChange={(value) => onChange({ lambda: value })}
        />
      )}

      {(spectrumType === 'soft' || spectrumType === 'realistic') && (
        <ControlRange
          label={labels.decayRate}
          symbol={<InlineMath math="\sigma" />}
          min="0.01"
          max="1"
          step="0.01"
          value={sigma}
          displayValue={sigma.toFixed(2)}
          onChange={(value) => onChange({ sigma: value })}
        />
      )}

      {spectrumType === 'realistic' && (
        <ControlRange
          label={labels.powerExponent}
          symbol={<InlineMath math="p" />}
          min="0.5"
          max="4"
          step="0.1"
          value={p}
          displayValue={p.toFixed(2)}
          onChange={(value) => onChange({ p: value })}
        />
      )}
    </>
  );
}

export default SpectrumParameterControls;
