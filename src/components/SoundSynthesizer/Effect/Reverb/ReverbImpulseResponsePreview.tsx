import { useMemo } from 'react';
import Scatter from 'react-plotly.js/scatter';
import type { ReverbEffectConfig } from '../../../../types';
import { getReverbImpulseResponseSamples } from '../../../../services/synth/ReverbImpulse';
import useElementWidth from '../../../../hooks/useElementWidth';

interface ReverbImpulseResponsePreviewProps {
  title: string;
  reverb: ReverbEffectConfig;
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
  const { elementRef, width } = useElementWidth<HTMLDivElement>();
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
      <div ref={elementRef} className="w-full">
        {width > 0 && (
          <Scatter
            data={[
              {
                x: response.time,
                y: response.amplitude,
                mode: 'lines',
              },
            ]}
            layout={{
              autosize: true,
              margin: { t: 40, r: 40, b: 40, l: 40 },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: {
                ticksuffix: 's',
                fixedrange: true,
                gridcolor: 'rgba(128,128,128,0.25)',
              },
              yaxis: {
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

export default ReverbImpulseResponsePreview;
