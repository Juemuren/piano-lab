import type { EnvelopeCurve } from '../../../types';
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
