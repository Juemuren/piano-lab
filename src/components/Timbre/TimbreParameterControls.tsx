import { BlockMath, InlineMath } from 'react-katex';
import type { Timbre, TimbreType } from '../../types';
import type { TimbreParamUpdates } from '../../hooks/useTimbreControl';
import ControlRange from '../shared/ControlRange';

const TIMBRE_FORMULAS: Record<TimbreType, string> = {
  metallic: String.raw`A_n \propto \frac1n`,
  pure: String.raw`A_n \propto \frac1{n^2}`,
  bright: String.raw`A_n \propto \frac1n \left|\sin\frac{n\pi}2\right|`,
  ethereal: String.raw`A_n \propto \frac{1}{n^2} \left|\sin\frac{n\pi}2\right|`,
  normal: String.raw`A_n \propto \frac1{n^2} \left|\sin(n\pi\lambda)\right|`,
  soft: String.raw`A_n \propto e^{-\sigma n}`,
  realistic: String.raw`A_n \propto \frac1{n^p} e^{-\sigma n}`,
  custom: String.raw`A_n = \text{custom}`,
};

interface TimbreParameterControlsProps {
  timbre: Timbre;
  lambda: number;
  sigma: number;
  p: number;
  labels: {
    strikePoint: string;
    decayRate: string;
    powerExponent: string;
  };
  onChange: (updates: TimbreParamUpdates) => void;
}

function TimbreParameterControls({
  timbre,
  lambda,
  sigma,
  p,
  labels,
  onChange,
}: TimbreParameterControlsProps) {
  return (
    <>
      {timbre.type !== 'custom' && (
        <BlockMath math={TIMBRE_FORMULAS[timbre.type]} />
      )}

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

export default TimbreParameterControls;
