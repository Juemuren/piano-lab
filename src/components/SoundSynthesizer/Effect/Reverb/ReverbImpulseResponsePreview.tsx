import { useMemo } from 'react';
import type { ReverbConfig } from '../../../../types';
import { getReverbImpulseResponseSamples } from '../../../../services/synth/Reverb';
import BlockMath from '../../../shared/BlockMath';
import Scatter from '../../../shared/Scatter';

interface ReverbImpulseResponsePreviewProps {
  title: string;
  reverb: ReverbConfig;
}

const PREVIEW_AUDIO_SAMPLE_RATE = 44100;
const MAX_PREVIEW_POINTS = 2400;

function downsampleImpulseResponse(time: number[], amplitude: number[]) {
  if (time.length <= MAX_PREVIEW_POINTS) {
    return { time, amplitude };
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
    time: previewTime,
    amplitude: previewAmplitude,
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
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <BlockMath math={String.raw`h[n]=\delta[n]+h_e[n]+h_l[n]`} />
      <Scatter
        data={[
          {
            x: response.time,
            y: response.amplitude,
            mode: 'lines',
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
