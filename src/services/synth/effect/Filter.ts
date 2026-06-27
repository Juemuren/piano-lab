import type { EqualizerConfig, FilterConfig } from './FilterEqualizer';

export type BiquadConfig = FilterConfig | EqualizerConfig;

const FILTER_RESPONSE_SAMPLE_RATE = 44100;
export const FILTER_RESPONSE_NYQUIST_FREQUENCY =
  FILTER_RESPONSE_SAMPLE_RATE / 2;

export function applyBiquadConfig(
  filterNode: BiquadFilterNode,
  effectConfig: BiquadConfig,
) {
  filterNode.type = effectConfig.type;
  filterNode.frequency.value = effectConfig.frequency;
  filterNode.Q.value = effectConfig.q;

  if ('gain' in effectConfig) {
    filterNode.gain.value = effectConfig.gain;
  }
}

export function getBiquadMagnitudes(
  frequencies: number[],
  effects: BiquadConfig[],
) {
  const totalMagnitudes = frequencies.map((frequency) =>
    Number.isFinite(frequency) && frequency <= FILTER_RESPONSE_NYQUIST_FREQUENCY
      ? 1
      : 0,
  );
  const responseFrequencies = frequencies.map((frequency) =>
    Number.isFinite(frequency) && frequency <= FILTER_RESPONSE_NYQUIST_FREQUENCY
      ? Math.max(frequency, 0)
      : FILTER_RESPONSE_NYQUIST_FREQUENCY,
  );

  if (effects.length === 0 || typeof OfflineAudioContext === 'undefined') {
    return totalMagnitudes;
  }

  const audioContext = new OfflineAudioContext(
    1,
    1,
    FILTER_RESPONSE_SAMPLE_RATE,
  );
  const frequencyValues = Float32Array.from(responseFrequencies);

  for (const effect of effects) {
    const filterNode = audioContext.createBiquadFilter();
    const magnitudes = new Float32Array(frequencies.length);
    const phases = new Float32Array(frequencies.length);

    applyBiquadConfig(filterNode, effect);
    filterNode.getFrequencyResponse(frequencyValues, magnitudes, phases);

    for (const [index, magnitude] of magnitudes.entries()) {
      totalMagnitudes[index] *= Number.isFinite(magnitude) ? magnitude : 0;
    }
  }

  return totalMagnitudes;
}
