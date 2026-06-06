import type { EnvelopeCurve } from '../../../types';
import BlockMath from '../../shared/BlockMath';
import Scatter from '../../shared/Scatter';

interface EnvelopeCurvePreviewProps {
  title: string;
  envelopeCurve: EnvelopeCurve;
}

function EnvelopeCurvePreview({
  title,
  envelopeCurve,
}: EnvelopeCurvePreviewProps) {
  return (
    <details open className="my-2">
      <summary className="text-lg font-bold">{title}</summary>
      <BlockMath
        math={String.raw`
            \begin{cases}
            y(t) = \varepsilon (\frac{A}{\varepsilon})^{\frac{t}{\tau_a}} & 0\le t < \tau_a \\
            y(t) = A (\frac{S}{A})^{\frac{t-\tau_a}{\tau_d}} & \tau_a\le t < \tau_a + \tau_d \\
            y(t) = S & \tau_a + \tau_d \le t < \tau_a + \tau_d + T \\
            y(t) = S (\frac{\varepsilon}{S})^{\frac{t-\tau_a-\tau_d-T}{\tau_r}} & \tau_a + \tau_d + T \le t < \tau_a + \tau_d + T + \tau_r
            \end{cases}
          `}
      />
      <Scatter
        data={[
          {
            x: envelopeCurve.time,
            y: envelopeCurve.gain,
            mode: 'lines',
          },
        ]}
        xaxis={{
          ticksuffix: 's',
        }}
      />
    </details>
  );
}

export default EnvelopeCurvePreview;
