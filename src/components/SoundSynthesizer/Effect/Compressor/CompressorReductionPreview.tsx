import useCompressorReductionHistory from '../../../../hooks/synth/useCompressorReductionHistory';
import Scatter from '../../../shared/Scatter';

interface CompressorReductionPreviewProps {
  title: string;
  enabled: boolean;
}

function CompressorReductionPreview({
  title,
  enabled,
}: CompressorReductionPreviewProps) {
  const samples = useCompressorReductionHistory(enabled);

  return (
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <Scatter
        data={[
          {
            x: samples.map((sample) => sample.time),
            y: samples.map((sample) => sample.reduction),
            mode: 'lines',
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
