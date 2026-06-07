import { useMemo } from 'react';
import type { WaveShaperConfig } from '../../../../types';
import { getWaveShaperCurvePoints } from '../../../../services/synth/effect/WaveShaper';
import BlockMath from '../../../shared/BlockMath';
import Plot2D from '../../../shared/Plot2D';

interface WaveShaperCurvePreviewProps {
  title: string;
  formula: string;
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
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <BlockMath math={formula} />
      <Plot2D
        data={[
          {
            x: points.x,
            y: points.y,
            mode: 'lines',
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
