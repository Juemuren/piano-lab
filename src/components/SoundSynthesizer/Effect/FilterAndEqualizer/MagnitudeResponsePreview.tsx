import { useMemo } from 'react';
import type { EqualizerConfig, FilterConfig } from '../../../../types';
import { getBiquadMagnitudes } from '../../../../services/synth/effect/Filter';
import Scatter from '../../../shared/Scatter';

interface MagnitudeResponsePreviewProps {
  title: string;
  filters: FilterConfig[];
  equalizers: EqualizerConfig[];
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
  filters: FilterConfig[],
  equalizers: EqualizerConfig[],
) {
  const frequencies = createFrequencyPoints();
  const totalMagnitudes = getBiquadMagnitudes(frequencies, [
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

function MagnitudeResponsePreview({
  title,
  filters,
  equalizers,
}: MagnitudeResponsePreviewProps) {
  const response = useMemo(
    () => getEffectMagnitudeResponse(filters, equalizers),
    [equalizers, filters],
  );

  return (
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <Scatter
        data={[
          {
            x: response.frequencies,
            y: response.decibels,
            mode: 'lines',
          },
        ]}
        xaxis={{
          type: 'log',
          ticksuffix: 'Hz',
        }}
        yaxis={{
          ticksuffix: 'dB',
        }}
      />
    </details>
  );
}

export default MagnitudeResponsePreview;
