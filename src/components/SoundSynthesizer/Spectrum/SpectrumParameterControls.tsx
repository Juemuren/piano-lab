import { InlineMath } from 'react-katex';
import type { SpectrumType } from '../../../services/synth/config/Options';
import { SYNTH_CONFIG_RANGES } from '../../../services/synth/config/Ranges';
import type { SpectrumParamUpdates } from '../../../services/synth/Spectrum';
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
          {...SYNTH_CONFIG_RANGES.spectrum.lambda}
          displayValue={lambda.toFixed(2)}
          label={labels.strikePoint}
          onChange={(value) => onChange({ lambda: value })}
          step="0.01"
          symbol={<InlineMath math="\lambda" />}
          value={lambda}
        />
      )}

      {(spectrumType === 'soft' || spectrumType === 'realistic') && (
        <ControlRange
          {...SYNTH_CONFIG_RANGES.spectrum.sigma}
          displayValue={sigma.toFixed(2)}
          label={labels.decayRate}
          onChange={(value) => onChange({ sigma: value })}
          step="0.01"
          symbol={<InlineMath math="\sigma" />}
          value={sigma}
        />
      )}

      {spectrumType === 'realistic' && (
        <ControlRange
          {...SYNTH_CONFIG_RANGES.spectrum.p}
          displayValue={p.toFixed(2)}
          label={labels.powerExponent}
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
