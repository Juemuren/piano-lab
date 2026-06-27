import type { EnvelopeCurve } from '../../../hooks/synth/useEnvelopeControl';
import Plot2D from '../../shared/Plot2D';

interface EnvelopeCurvePreviewProps {
  envelopeCurve: EnvelopeCurve;
  title: string;
}

function EnvelopeCurvePreview({
  title,
  envelopeCurve,
}: EnvelopeCurvePreviewProps) {
  return (
    <details className="my-2" open>
      <summary className="font-bold text-lg">{title}</summary>
      <Plot2D
        data={[
          {
            mode: 'lines',
            x: envelopeCurve.time,
            y: envelopeCurve.gain,
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
