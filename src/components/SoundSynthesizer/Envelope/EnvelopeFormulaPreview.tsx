import BlockMath from '../../shared/BlockMath';

interface EnvelopeFormulaPreviewProps {
  title: string;
}

function EnvelopeFormulaPreview({ title }: EnvelopeFormulaPreviewProps) {
  return (
    <details open className="my-2">
      <summary className="text-lg font-bold">{title}</summary>
      <BlockMath
        math={String.raw`
            \begin{cases}
            y(t) = \varepsilon (\frac{1}{\varepsilon})^{\frac{t}{\tau_a}}
            & 0\le t < \tau_a \\
            y(t) = S^{\frac{t-\tau_a}{\tau_d}}
            & \tau_a\le t < \tau_a + \tau_d \\
            y(t) = S
            & \tau_a + \tau_d \le t < \tau_a + \tau_d + T \\
            y(t) = S (\frac{\varepsilon}{S})^{\frac{t-\tau_a-\tau_d-T}{\tau_r}}
            & \tau_a + \tau_d + T \le t < \tau_a + \tau_d + T + \tau_r
            \end{cases}
          `}
      />
    </details>
  );
}

export default EnvelopeFormulaPreview;
