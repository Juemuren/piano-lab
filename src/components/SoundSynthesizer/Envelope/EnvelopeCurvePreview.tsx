import type { EnvelopeCurve } from '../../../types';
import Plot2D from '../../shared/Plot2D';

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
      <Plot2D
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
