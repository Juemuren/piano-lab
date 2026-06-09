import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PlotParams } from 'react-plotly.js';
import { getPannerConeMesh } from '../../../../services/synth/effect/Panner';
import type { PannerConfig } from '../../../../types';
import Plot3D from '../../../shared/Plot3D';

interface PannerSpatialPreviewProps {
  title: string;
  panner: PannerConfig;
}

function getPlotRange(panner: PannerConfig) {
  return Math.max(
    3,
    Math.abs(panner.positionX) + 1,
    Math.abs(panner.positionY) + 1,
    Math.abs(panner.positionZ) + 1,
  );
}

function PannerSpatialPreview({ title, panner }: PannerSpatialPreviewProps) {
  const { t } = useTranslation('synth');

  const preview = useMemo(() => {
    const coneRadius = Math.max(panner.refDistance, 0.01);
    const range = getPlotRange(panner) + coneRadius;
    const outerCone = getPannerConeMesh(
      panner,
      panner.coneOuterAngle,
      coneRadius,
    );
    const innerCone = getPannerConeMesh(
      panner,
      panner.coneInnerAngle,
      coneRadius,
    );
    const orientationLength = Math.hypot(
      panner.orientationX,
      panner.orientationY,
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
      orientationEndY:
        panner.positionY + panner.orientationY * orientationScale,
      orientationEndZ:
        panner.positionZ + panner.orientationZ * orientationScale,
    };
  }, [panner]);

  return (
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <Plot3D
        data={
          [
            {
              type: 'mesh3d',
              x: preview.outerCone.x,
              y: preview.outerCone.y,
              z: preview.outerCone.z,
              i: Int32Array.from(preview.outerCone.i),
              j: Int32Array.from(preview.outerCone.j),
              k: Int32Array.from(preview.outerCone.k),
              name: t('effect.panner.preview.outerCone'),
              color: 'rgb(239, 68, 68)',
              opacity: 0.12,
            },
            {
              type: 'mesh3d',
              x: preview.innerCone.x,
              y: preview.innerCone.y,
              z: preview.innerCone.z,
              i: Int32Array.from(preview.innerCone.i),
              j: Int32Array.from(preview.innerCone.j),
              k: Int32Array.from(preview.innerCone.k),
              name: t('effect.panner.preview.innerCone'),
              color: 'rgb(34, 197, 94)',
              opacity: 0.18,
            },
            {
              type: 'scatter3d',
              x: [0, panner.positionX],
              y: [0, panner.positionY],
              z: [0, panner.positionZ],
              mode: 'lines',
              name: t('effect.panner.preview.distance'),
              line: { dash: 'dot', color: 'rgba(128,128,128,0.75)' },
            },
            {
              type: 'scatter3d',
              x: [panner.positionX, preview.orientationEndX],
              y: [panner.positionY, preview.orientationEndY],
              z: [panner.positionZ, preview.orientationEndZ],
              mode: 'lines',
              name: t('effect.panner.preview.orientation'),
              line: { color: 'rgba(59, 130, 246, 0.85)', width: 2 },
            },
            {
              type: 'scatter3d',
              x: [0],
              y: [0],
              z: [0],
              mode: 'markers',
              name: t('effect.panner.preview.listener'),
              marker: { size: 4 },
            },
            {
              type: 'scatter3d',
              x: [panner.positionX],
              y: [panner.positionY],
              z: [panner.positionZ],
              mode: 'markers',
              name: t('effect.panner.preview.source'),
              marker: { size: 4 },
            },
          ] as PlotParams['data']
        }
        layout={{
          showlegend: false,
          scene: {
            aspectmode: 'cube',
            camera: {
              eye: { x: 1.35, y: 1.1, z: 0.95 },
            },
            xaxis: {
              title: { text: 'X' },
              range: [-preview.range, preview.range],
            },
            yaxis: {
              title: { text: 'Y' },
              range: [-preview.range, preview.range],
            },
            zaxis: {
              title: { text: 'Z' },
              range: [-preview.range, preview.range],
            },
          },
        }}
      />
    </details>
  );
}

export default PannerSpatialPreview;
