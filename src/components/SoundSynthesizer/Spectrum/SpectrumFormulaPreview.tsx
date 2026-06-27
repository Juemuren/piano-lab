import type { SpectrumType } from '../../../services/synth/config/Options';
import BlockMath from '../../shared/BlockMath';

const SPECTRUM_FORMULAS: Record<SpectrumType, string> = {
  bright: String.raw`A_n \propto \frac1n \left|\sin\frac{n\pi}2\right|`,
  custom: String.raw`A_n = \text{custom}`,
  ethereal: String.raw`A_n \propto \frac{1}{n^2} \left|\sin\frac{n\pi}2\right|`,
  metallic: String.raw`A_n \propto \frac1n`,
  normal: String.raw`A_n \propto \frac1{n^2} \left|\sin(n\pi\lambda)\right|`,
  pure: String.raw`A_n \propto \frac1{n^2}`,
  realistic: String.raw`A_n \propto \frac1{n^p} e^{-\sigma n}`,
  soft: String.raw`A_n \propto e^{-\sigma n}`,
};

interface SpectrumFormulaPreviewProps {
  label: string;
  spectrumType: SpectrumType;
}

function SpectrumFormulaPreview({
  spectrumType,
  label,
}: SpectrumFormulaPreviewProps) {
  if (spectrumType === 'custom') {
    return null;
  }

  return (
    <details className="my-2" open>
      <summary className="font-bold text-lg">{label}</summary>
      <BlockMath math={SPECTRUM_FORMULAS[spectrumType]} />
    </details>
  );
}

export default SpectrumFormulaPreview;
