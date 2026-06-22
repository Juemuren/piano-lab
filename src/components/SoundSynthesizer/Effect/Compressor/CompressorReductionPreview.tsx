import useCompressorReductionHistory from '../../../../hooks/synth/useCompressorReductionHistory';
import Plot2D from '../../../shared/Plot2D';

interface CompressorReductionPreviewProps {
  enabled: boolean;
  title: string;
}

function CompressorReductionPreview({
  title,
  enabled,
}: CompressorReductionPreviewProps) {
  const samples = useCompressorReductionHistory(enabled);

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold">{title}</summary>
      <Plot2D
        data={[
          {
            mode: 'lines',
            x: samples.map((sample) => sample.time),
            y: samples.map((sample) => sample.reduction),
          },
        ]}
        xaxis={{
          ticksuffix: 's',
        }}
        yaxis={{
          ticksuffix: 'dB',
        }}
      />
    </details>
  );
}

export default CompressorReductionPreview;
