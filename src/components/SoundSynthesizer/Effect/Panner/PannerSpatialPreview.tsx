import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PlotParams } from 'react-plotly.js';
import { getPannerConeMesh } from '../../../../services/synth/effect/Panner';
import type { PannerConfig } from '../../../../types';
import Plot3D from '../../../shared/Plot3D';

interface PannerSpatialPreviewProps {
  panner: PannerConfig;
  title: string;
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
      innerCone,
      orientationEndX:
        panner.positionX + panner.orientationX * orientationScale,
      orientationEndY:
        panner.positionY + panner.orientationY * orientationScale,
      orientationEndZ:
        panner.positionZ + panner.orientationZ * orientationScale,
      outerCone,
      range,
    };
  }, [panner]);

  return (
    <details className="my-2" open>
      <summary className="font-bold my-2">{title}</summary>
      <Plot3D
        data={
          [
            {
              color: 'rgb(239, 68, 68)',
              i: Int32Array.from(preview.outerCone.i),
              j: Int32Array.from(preview.outerCone.j),
              k: Int32Array.from(preview.outerCone.k),
              name: t('effect.panner.preview.outerCone'),
              opacity: 0.12,
              type: 'mesh3d',
              x: preview.outerCone.x,
              y: preview.outerCone.y,
              z: preview.outerCone.z,
            },
            {
              color: 'rgb(34, 197, 94)',
              i: Int32Array.from(preview.innerCone.i),
              j: Int32Array.from(preview.innerCone.j),
              k: Int32Array.from(preview.innerCone.k),
              name: t('effect.panner.preview.innerCone'),
              opacity: 0.18,
              type: 'mesh3d',
              x: preview.innerCone.x,
              y: preview.innerCone.y,
              z: preview.innerCone.z,
            },
            {
              line: { color: 'rgba(128,128,128,0.75)', dash: 'dot' },
              mode: 'lines',
              name: t('effect.panner.preview.distance'),
              type: 'scatter3d',
              x: [0, panner.positionX],
              y: [0, panner.positionY],
              z: [0, panner.positionZ],
            },
            {
              line: { color: 'rgba(59, 130, 246, 0.85)', width: 2 },
              mode: 'lines',
              name: t('effect.panner.preview.orientation'),
              type: 'scatter3d',
              x: [panner.positionX, preview.orientationEndX],
              y: [panner.positionY, preview.orientationEndY],
              z: [panner.positionZ, preview.orientationEndZ],
            },
            {
              marker: { size: 4 },
              mode: 'markers',
              name: t('effect.panner.preview.listener'),
              type: 'scatter3d',
              x: [0],
              y: [0],
              z: [0],
            },
            {
              marker: { size: 4 },
              mode: 'markers',
              name: t('effect.panner.preview.source'),
              type: 'scatter3d',
              x: [panner.positionX],
              y: [panner.positionY],
              z: [panner.positionZ],
            },
          ] as PlotParams['data']
        }
        layout={{
          scene: {
            aspectmode: 'cube',
            camera: {
              eye: { x: 1.35, y: 1.1, z: 0.95 },
            },
            xaxis: {
              range: [-preview.range, preview.range],
              title: { text: 'X' },
            },
            yaxis: {
              range: [-preview.range, preview.range],
              title: { text: 'Y' },
            },
            zaxis: {
              range: [-preview.range, preview.range],
              title: { text: 'Z' },
            },
          },
          showlegend: false,
        }}
      />
    </details>
  );
}

export default PannerSpatialPreview;
