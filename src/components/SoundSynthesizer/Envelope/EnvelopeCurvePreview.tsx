import Scatter from 'react-plotly.js/scatter';
import type { EnvelopeCurve } from '../../../types';
import useElementWidth from '../../../hooks/useElementWidth';
import BlockMath from '../../shared/BlockMath';

interface EnvelopeCurvePreviewProps {
  title: string;
  envelopeCurve: EnvelopeCurve;
}

function EnvelopeCurvePreview({
  title,
  envelopeCurve,
}: EnvelopeCurvePreviewProps) {
  const { elementRef, width } = useElementWidth<HTMLDivElement>();

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
      <div ref={elementRef} className="w-full">
        {width > 0 && (
          <Scatter
            data={[
              {
                x: envelopeCurve.time,
                y: envelopeCurve.gain,
                mode: 'lines',
              },
            ]}
            layout={{
              autosize: true,
              margin: { t: 40, r: 40, b: 40, l: 40 },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: {
                ticksuffix: 's',
                fixedrange: true,
                gridcolor: 'rgba(128,128,128,0.25)',
              },
              yaxis: {
                fixedrange: true,
                gridcolor: 'rgba(128,128,128,0.25)',
              },
            }}
            config={{
              autosizable: true,
              displayModeBar: false,
            }}
            style={{
              width: `${width}px`,
              height: `100%`,
            }}
            useResizeHandler
          />
        )}
      </div>
    </details>
  );
}

export default EnvelopeCurvePreview;
