import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Scatter from 'react-plotly.js/scatter';
import type { FilterEffectConfig } from '../../../types';

interface FilterMagnitudeResponsePreviewProps {
  title: string;
  filters: FilterEffectConfig[];
}

const FREQUENCY_POINT_COUNT = 256;
const MIN_FREQUENCY = 20;
const MAX_FREQUENCY = 10000;
const MIN_DECIBELS = -80;
const MAX_DECIBELS = 24;

function createFrequencyPoints() {
  const minLog = Math.log10(MIN_FREQUENCY);
  const maxLog = Math.log10(MAX_FREQUENCY);

  return Array.from({ length: FREQUENCY_POINT_COUNT }, (_, index) => {
    const progress = index / (FREQUENCY_POINT_COUNT - 1);
    return 10 ** (minLog + (maxLog - minLog) * progress);
  });
}

function getFilterMagnitudeResponse(filters: FilterEffectConfig[]) {
  const frequencies = createFrequencyPoints();
  const totalMagnitudes = new Float32Array(frequencies.length);
  totalMagnitudes.fill(1);

  if (filters.length === 0 || typeof OfflineAudioContext === 'undefined') {
    return {
      frequencies,
      decibels: Array.from(totalMagnitudes, () => 0),
    };
  }

  const audioContext = new OfflineAudioContext(1, 1, 44100);
  const frequencyValues = Float32Array.from(frequencies);

  for (const filter of filters) {
    const filterNode = audioContext.createBiquadFilter();
    const magnitudes = new Float32Array(frequencies.length);
    const phases = new Float32Array(frequencies.length);

    filterNode.type = filter.type;
    filterNode.frequency.value = filter.frequency;
    filterNode.Q.value = filter.q;
    filterNode.getFrequencyResponse(frequencyValues, magnitudes, phases);

    for (const [index, magnitude] of magnitudes.entries()) {
      totalMagnitudes[index] *= magnitude;
    }
  }

  return {
    frequencies,
    decibels: Array.from(totalMagnitudes, (magnitude) =>
      Math.max(
        MIN_DECIBELS,
        Math.min(MAX_DECIBELS, 20 * Math.log10(Math.max(magnitude, 1e-8))),
      ),
    ),
  };
}

function FilterMagnitudeResponsePreview({
  title,
  filters,
}: FilterMagnitudeResponsePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const response = useMemo(
    () => getFilterMagnitudeResponse(filters),
    [filters],
  );

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      setWidth(element.getBoundingClientRect().width);
    };
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <details open className="my-3">
      <summary className="text-sm">{title}</summary>
      <div ref={containerRef} className="w-full">
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
                range: [MIN_DECIBELS, MAX_DECIBELS],
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

export default FilterMagnitudeResponsePreview;
