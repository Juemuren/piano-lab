import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getPannerDistance,
  getPannerDistanceCurve,
  getPannerDistanceGain,
} from '../../../../services/synth/effect/Panner';
import type { PannerConfig } from '../../../../types/synth';
import Plot2D from '../../../shared/Plot2D';

interface PannerDistanceGainPreviewProps {
  panner: PannerConfig;
  title: string;
}

function PannerDistanceGainPreview({
  title,
  panner,
}: PannerDistanceGainPreviewProps) {
  const { t } = useTranslation('synth');

  const preview = useMemo(() => {
    const curve = getPannerDistanceCurve(panner);
    const currentDistance = getPannerDistance(panner);

    return {
      ...curve,
      currentDistance,
      currentGain: getPannerDistanceGain(panner, currentDistance),
    };
  }, [panner]);

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold">{title}</summary>
      <Plot2D
        data={[
          {
            mode: 'lines',
            name: t('effect.panner.preview.distanceGain'),
            x: preview.distances,
            y: preview.gains,
          },
          {
            mode: 'markers',
            name: t('effect.panner.preview.currentSourceDistance'),
            x: [preview.currentDistance],
            y: [preview.currentGain],
          },
        ]}
        layout={{
          showlegend: false,
        }}
      />
    </details>
  );
}

export default PannerDistanceGainPreview;
