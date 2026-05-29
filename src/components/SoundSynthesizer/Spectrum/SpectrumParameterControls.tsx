import { InlineMath } from 'react-katex';
import type { Spectrum } from '../../../types';
import type { SpectrumParamUpdates } from '../../../hooks/useSpectrumControl';
import ControlRange from '../../shared/ControlRange';

interface SpectrumParameterControlsProps {
  timbre: Spectrum;
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
  timbre,
  lambda,
  sigma,
  p,
  labels,
  onChange,
}: SpectrumParameterControlsProps) {
  return (
    <>
      {timbre.type === 'normal' && (
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

      {(timbre.type === 'soft' || timbre.type === 'realistic') && (
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

      {timbre.type === 'realistic' && (
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
