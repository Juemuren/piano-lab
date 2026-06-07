import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PannerConfig } from '../../../../types';
import { getPannerConePolygon } from '../../../../services/synth/effect/Panner';
import Scatter from '../../../shared/Scatter';

interface PannerSpatialPreviewProps {
  title: string;
  panner: PannerConfig;
}

function getPlotRange(panner: PannerConfig) {
  return Math.max(
    3,
    Math.abs(panner.positionX) + 1,
    Math.abs(panner.positionZ) + 1,
  );
}

function PannerSpatialPreview({ title, panner }: PannerSpatialPreviewProps) {
  const { t } = useTranslation('synth');

  const preview = useMemo(() => {
    const range = getPlotRange(panner);
    const coneRadius = Math.max(panner.refDistance, 0.01);
    const outerCone = getPannerConePolygon(
      panner,
      panner.coneOuterAngle,
      coneRadius,
    );
    const innerCone = getPannerConePolygon(
      panner,
      panner.coneInnerAngle,
      coneRadius,
    );
    const orientationLength = Math.hypot(
      panner.orientationX,
      panner.orientationZ,
    );
    const orientationScale =
      orientationLength === 0 ? 0 : Math.min(1, range / orientationLength / 3);

    return {
      range,
      outerCone,
      innerCone,
      orientationEndX:
        panner.positionX + panner.orientationX * orientationScale,
      orientationEndZ:
        panner.positionZ + panner.orientationZ * orientationScale,
    };
  }, [panner]);

  return (
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <Scatter
        data={[
          {
            x: preview.outerCone.x,
            y: preview.outerCone.z,
            mode: 'lines',
            fill: 'toself',
            name: t('effect.panner.preview.outerCone'),
            line: { color: 'rgba(239, 68, 68, 0.35)' },
            fillcolor: 'rgba(239, 68, 68, 0.12)',
          },
          {
            x: preview.innerCone.x,
            y: preview.innerCone.z,
            mode: 'lines',
            fill: 'toself',
            name: t('effect.panner.preview.innerCone'),
            line: { color: 'rgba(34, 197, 94, 0.45)' },
            fillcolor: 'rgba(34, 197, 94, 0.16)',
          },
          {
            x: [0, panner.positionX],
            y: [0, panner.positionZ],
            mode: 'lines',
            name: t('effect.panner.preview.distance'),
            line: { dash: 'dot', color: 'rgba(128,128,128,0.75)' },
          },
          {
            x: [panner.positionX, preview.orientationEndX],
            y: [panner.positionZ, preview.orientationEndZ],
            mode: 'lines',
            name: t('effect.panner.preview.orientation'),
            line: { color: 'rgba(59, 130, 246, 0.85)', width: 2 },
          },
          {
            x: [0],
            y: [0],
            mode: 'text+markers',
            name: t('effect.panner.preview.listener'),
            text: ['L'],
            textposition: 'top center',
            marker: { size: 12 },
          },
          {
            x: [panner.positionX],
            y: [panner.positionZ],
            mode: 'text+markers',
            name: t('effect.panner.preview.source'),
            text: ['S'],
            textposition: 'top center',
            marker: { size: 12 },
          },
        ]}
        layout={{
          showlegend: false,
        }}
        xaxis={{
          title: { text: 'X' },
        }}
        yaxis={{
          title: { text: 'Z' },
        }}
      />
    </details>
  );
}

export default PannerSpatialPreview;
