import { useMemo } from 'react';
import type { WaveShaperConfig } from '../../../../services/synth/effect/WaveShaper';
import { getWaveShaperCurvePoints } from '../../../../services/synth/effect/WaveShaper';
import BlockMath from '../../../shared/BlockMath';
import Plot2D from '../../../shared/Plot2D';

interface WaveShaperCurvePreviewProps {
  formula: string;
  title: string;
  waveShaper: WaveShaperConfig;
}

function WaveShaperCurvePreview({
  title,
  formula,
  waveShaper,
}: WaveShaperCurvePreviewProps) {
  const points = useMemo(
    () => getWaveShaperCurvePoints(waveShaper),
    [waveShaper],
  );

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold">{title}</summary>
      <BlockMath math={formula} />
      <Plot2D
        data={[
          {
            mode: 'lines',
            x: points.x,
            y: points.y,
          },
        ]}
        xaxis={{
          range: [-1, 1],
        }}
        yaxis={{
          range: [-1, 1],
        }}
      />
    </details>
  );
}

export default WaveShaperCurvePreview;
