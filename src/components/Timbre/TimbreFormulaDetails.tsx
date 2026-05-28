import { BlockMath } from 'react-katex';
import type { TimbreType } from '../../types';

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

interface TimbreFormulaDetailsProps {
  timbreType: TimbreType;
  label: string;
}

function TimbreFormulaDetails({
  timbreType,
  label,
}: TimbreFormulaDetailsProps) {
  if (timbreType === 'custom') {
    return null;
  }

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold">{label}</summary>
      <BlockMath math={TIMBRE_FORMULAS[timbreType]} />
    </details>
  );
}

export default TimbreFormulaDetails;
