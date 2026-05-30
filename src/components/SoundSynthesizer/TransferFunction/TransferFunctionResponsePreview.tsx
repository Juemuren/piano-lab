import { BlockMath } from 'react-katex';
import type { TransferFunction, TransferFunctionType } from '../../../types';
import VerticalSliderGroup from '../../shared/VerticalSliderGroup';
import { getHarmonicLabels } from '../../../utils/harmonic';

const TRANSFER_FORMULAS: Record<
  TransferFunctionType,
  { magnitude: string; phase: string }
> = {
  delay: {
    magnitude: String.raw`|H(f)| = 1`,
    phase: String.raw`\angle H(f) = -2\pi\tau f`,
  },
  single_echo: {
    magnitude: String.raw`|H(f)| = \sqrt{1 + \alpha^2 + 2\alpha\cos(2\pi\tau f)}`,
    phase: String.raw`\angle H(f) = -\arctan\frac{\alpha\sin(2\pi\tau f)}{1 + \alpha\cos(2\pi\tau f)}`,
  },
  multi_echo: {
    magnitude: String.raw`|H(f)| = \frac1{\sqrt{1 + \alpha^2 - 2\alpha\cos(2\pi\tau f)}}`,
    phase: String.raw`\angle H(f) = -\arctan\frac{\alpha\sin(2\pi\tau f)}{1 - \alpha\cos(2\pi\tau f)}`,
  },
  all_pass: {
    magnitude: String.raw`|H(f)| = 1`,
    phase: String.raw`\angle H(f) = -2\pi\tau f - 2\arctan\frac{\alpha\sin(2\pi\tau f)}{1 - \alpha\cos(2\pi\tau f)}`,
  },
  low_pass: {
    magnitude: String.raw`\mathbf{1}_{f \le f_{\max}}`,
    phase: String.raw`\angle H(f) = 0`,
  },
  high_pass: {
    magnitude: String.raw`\mathbf{1}_{f \ge f_{\min}}`,
    phase: String.raw`\angle H(f) = 0`,
  },
  band_pass: {
    magnitude: String.raw`\mathbf{1}_{f \le f_{\max} \land f \ge f_{\min}}`,
    phase: String.raw`\angle H(f) = 0`,
  },
};

interface TransferFunctionResponsePreviewProps {
  transferFunction: TransferFunction;
  labels: {
    magnitudeResponse: string;
    phaseResponse: string;
  };
}

function TransferFunctionResponsePreview({
  transferFunction,
  labels,
}: TransferFunctionResponsePreviewProps) {
  const harmonicLabels = getHarmonicLabels(transferFunction.magnitudes.length);

  return (
    <>
      <details open className="my-2">
        <summary className="text-lg font-bold">
          {labels.magnitudeResponse}
        </summary>
        <BlockMath math={TRANSFER_FORMULAS[transferFunction.type].magnitude} />
        <VerticalSliderGroup
          values={transferFunction.magnitudes}
          labels={harmonicLabels}
          min="0"
          max="2"
          step="0.01"
          getKey={(index) => `magnitude-${index}`}
          disabled
        />
      </details>

      <details open className="my-2">
        <summary className="text-lg font-bold">{labels.phaseResponse}</summary>
        <BlockMath math={TRANSFER_FORMULAS[transferFunction.type].phase} />
        <VerticalSliderGroup
          values={transferFunction.phases}
          labels={harmonicLabels}
          min="-180"
          max="180"
          step="1"
          getKey={(index) => `phase-${index}`}
          formatValue={(value) => `${value.toFixed(0)}°`}
          disabled
        />
      </details>
    </>
  );
}

export default TransferFunctionResponsePreview;
