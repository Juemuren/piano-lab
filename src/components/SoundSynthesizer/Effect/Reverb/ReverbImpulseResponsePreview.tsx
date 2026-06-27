import { useMemo } from 'react';
import { getReverbImpulseResponseSamples } from '../../../../services/synth/effect/Reverb';
import type { ReverbConfig } from '../../../../types/synth';
import BlockMath from '../../../shared/BlockMath';
import Plot2D from '../../../shared/Plot2D';

interface ReverbImpulseResponsePreviewProps {
  reverb: ReverbConfig;
  title: string;
}

const PREVIEW_AUDIO_SAMPLE_RATE = 44100;
const MAX_PREVIEW_POINTS = 2400;

function downsampleImpulseResponse(time: number[], amplitude: number[]) {
  if (time.length <= MAX_PREVIEW_POINTS) {
    return { amplitude, time };
  }

  const bucketSize = Math.ceil(time.length / MAX_PREVIEW_POINTS);
  const previewTime: number[] = [];
  const previewAmplitude: number[] = [];

  for (let startIndex = 0; startIndex < time.length; startIndex += bucketSize) {
    const endIndex = Math.min(startIndex + bucketSize, time.length);
    let peakIndex = startIndex;
    let peakAmplitude = amplitude[startIndex];

    for (let index = startIndex + 1; index < endIndex; index += 1) {
      if (Math.abs(amplitude[index]) > Math.abs(peakAmplitude)) {
        peakIndex = index;
        peakAmplitude = amplitude[index];
      }
    }

    previewTime.push(time[peakIndex]);
    previewAmplitude.push(peakAmplitude);
  }

  return {
    amplitude: previewAmplitude,
    time: previewTime,
  };
}

function ReverbImpulseResponsePreview({
  title,
  reverb,
}: ReverbImpulseResponsePreviewProps) {
  const response = useMemo(() => {
    const samples = getReverbImpulseResponseSamples(
      reverb,
      PREVIEW_AUDIO_SAMPLE_RATE,
    );

    return downsampleImpulseResponse(samples.time, samples.amplitude);
  }, [reverb]);

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold">{title}</summary>
      <BlockMath math={String.raw`h[n]=\delta[n]+h_e[n]+h_l[n]`} />
      <Plot2D
        data={[
          {
            mode: 'lines',
            x: response.time,
            y: response.amplitude,
          },
        ]}
        xaxis={{
          ticksuffix: 's',
        }}
      />
    </details>
  );
}

export default ReverbImpulseResponsePreview;
