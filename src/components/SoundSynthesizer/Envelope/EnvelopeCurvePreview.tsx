import Scatter from 'react-plotly.js/scatter';
import type { EnvelopeCurve } from '../../../types';
import useElementWidth from '../../../hooks/useElementWidth';

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
