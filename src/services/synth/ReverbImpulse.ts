import type { ReverbEffectPreset } from '../../types';

interface ReverbImpulseDefinition {
  duration: number;
  decay: number;
  brightness: number;
  preDelay: number;
}

const REVERB_IMPULSE_DEFINITIONS: Record<
  ReverbEffectPreset,
  ReverbImpulseDefinition
> = {
  bathroom: {
    duration: 0.45,
    decay: 2.6,
    brightness: 0.95,
    preDelay: 0.003,
  },
  garage: {
    duration: 0.9,
    decay: 2.1,
    brightness: 0.72,
    preDelay: 0.01,
  },
  hall: {
    duration: 2.8,
    decay: 3.6,
    brightness: 0.6,
    preDelay: 0.03,
  },
  cathedral: {
    duration: 4.8,
    decay: 4.8,
    brightness: 0.48,
    preDelay: 0.055,
  },
};

function createSeededRandom(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function getPresetSeed(preset: ReverbEffectPreset) {
  const seeds: Record<ReverbEffectPreset, number> = {
    bathroom: 29,
    garage: 11,
    hall: 47,
    cathedral: 83,
  };

  return seeds[preset];
}

export function createReverbImpulseResponse(
  audioContext: BaseAudioContext,
  preset: ReverbEffectPreset,
) {
  const definition = REVERB_IMPULSE_DEFINITIONS[preset];
  const sampleRate = audioContext.sampleRate;
  const length = Math.max(1, Math.round(definition.duration * sampleRate));
  const preDelaySamples = Math.round(definition.preDelay * sampleRate);
  const buffer = audioContext.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const random = createSeededRandom(getPresetSeed(preset) + channel);
    const channelData = buffer.getChannelData(channel);
    let previousSample = 0;

    for (let index = preDelaySamples; index < length; index += 1) {
      const progress = (index - preDelaySamples) / (length - preDelaySamples);
      const envelope = Math.pow(1 - progress, definition.decay);
      const noise = random() * 2 - 1;
      const sample =
        previousSample * (1 - definition.brightness) +
        noise * definition.brightness;

      channelData[index] = sample * envelope;
      previousSample = sample;
    }
  }

  return buffer;
}
