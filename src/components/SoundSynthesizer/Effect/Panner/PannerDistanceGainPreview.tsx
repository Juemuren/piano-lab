import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PannerConfig } from '../../../../types';
import {
  getPannerDistance,
  getPannerDistanceCurve,
  getPannerDistanceGain,
} from '../../../../services/synth/effect/Panner';
import Plot2D from '../../../shared/Plot2D';

interface PannerDistanceGainPreviewProps {
  title: string;
  panner: PannerConfig;
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
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <Plot2D
        data={[
          {
            x: preview.distances,
            y: preview.gains,
            mode: 'lines',
            name: t('effect.panner.preview.distanceGain'),
          },
          {
            x: [preview.currentDistance],
            y: [preview.currentGain],
            mode: 'markers',
            name: t('effect.panner.preview.currentSourceDistance'),
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
