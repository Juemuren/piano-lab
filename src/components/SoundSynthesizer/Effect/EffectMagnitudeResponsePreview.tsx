import { useMemo } from 'react';
import Scatter from 'react-plotly.js/scatter';
import type { EqualizerEffectConfig, FilterEffectConfig } from '../../../types';
import { getBiquadEffectMagnitudes } from '../../../services/synth/EffectResponse';
import useElementWidth from '../../../hooks/useElementWidth';

interface EffectMagnitudeResponsePreviewProps {
  title: string;
  filters: FilterEffectConfig[];
  equalizers: EqualizerEffectConfig[];
}

const FREQUENCY_POINT_COUNT = 256;
const MIN_FREQUENCY = 20;
const MAX_FREQUENCY = 20000;

function createFrequencyPoints() {
  const minLog = Math.log10(MIN_FREQUENCY);
  const maxLog = Math.log10(MAX_FREQUENCY);

  return Array.from({ length: FREQUENCY_POINT_COUNT }, (_, index) => {
    const progress = index / (FREQUENCY_POINT_COUNT - 1);
    return 10 ** (minLog + (maxLog - minLog) * progress);
  });
}

function getEffectMagnitudeResponse(
  filters: FilterEffectConfig[],
  equalizers: EqualizerEffectConfig[],
) {
  const frequencies = createFrequencyPoints();
  const totalMagnitudes = getBiquadEffectMagnitudes(frequencies, [
    ...filters,
    ...equalizers,
  ]);

  return {
    frequencies,
    decibels: Array.from(
      totalMagnitudes,
      (magnitude) => 20 * Math.log10(Math.max(magnitude, 1e-8)),
    ),
  };
}

function EffectMagnitudeResponsePreview({
  title,
  filters,
  equalizers,
}: EffectMagnitudeResponsePreviewProps) {
  const { elementRef, width } = useElementWidth<HTMLDivElement>();
  const response = useMemo(
    () => getEffectMagnitudeResponse(filters, equalizers),
    [equalizers, filters],
  );

  return (
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <div ref={elementRef} className="w-full">
        {width > 0 && (
          <Scatter
            data={[
              {
                x: response.frequencies,
                y: response.decibels,
                mode: 'lines',
              },
            ]}
            layout={{
              autosize: true,
              margin: { t: 40, r: 40, b: 40, l: 40 },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: {
                type: 'log',
                ticksuffix: 'Hz',
                fixedrange: true,
                gridcolor: 'rgba(128,128,128,0.25)',
              },
              yaxis: {
                ticksuffix: 'dB',
                fixedrange: true,
                gridcolor: 'rgba(128,128,128,0.25)',
              },
            }}
            config={{
              autosizable: true,
              displayModeBar: false,
            }}
            style={{
              width: `${width}px`,
              height: `100%`,
            }}
            useResizeHandler
          />
        )}
      </div>
    </details>
  );
}

export default EffectMagnitudeResponsePreview;
