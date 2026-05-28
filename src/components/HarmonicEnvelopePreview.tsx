import type { RefObject } from 'react';
import Scatter from 'react-plotly.js/scatter';
import type { EnvelopeCurve } from '../hooks/useHarmonicSynthesizerControl';

interface HarmonicEnvelopePreviewProps {
  title: string;
  envelopeCurve: EnvelopeCurve;
  containerRef: RefObject<HTMLDivElement | null>;
  width: number;
}

function HarmonicEnvelopePreview({
  title,
  envelopeCurve,
  containerRef,
  width,
}: HarmonicEnvelopePreviewProps) {
  return (
    <details open className="mt-4">
      <summary className="text-lg font-bold">{title}</summary>
      <div ref={containerRef} className="w-full">
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

export default HarmonicEnvelopePreview;
