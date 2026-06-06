import Scatter from 'react-plotly.js/scatter';
import useElementWidth from '../../../../hooks/useElementWidth';
import useCompressorReductionHistory from '../../../../hooks/synth/useCompressorReductionHistory';

interface CompressorReductionPreviewProps {
  title: string;
  enabled: boolean;
}

function CompressorReductionPreview({
  title,
  enabled,
}: CompressorReductionPreviewProps) {
  const { elementRef, width } = useElementWidth<HTMLDivElement>();
  const samples = useCompressorReductionHistory(enabled);

  return (
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <div ref={elementRef} className="w-full">
        {width > 0 && (
          <Scatter
            data={[
              {
                x: samples.map((sample) => sample.time),
                y: samples.map((sample) => sample.reduction),
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
                ticksuffix: 'dB',
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

export default CompressorReductionPreview;
