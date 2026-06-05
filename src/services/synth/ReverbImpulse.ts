import type { ReverbEffectPreset } from '../../types';

interface EarlyReflectionDefinition {
  delay: number;
  gain: number;
  pan: number;
}

interface ReverbImpulseDefinition {
  duration: number;
  decayRate: number;
  brightness: number;
  lateDelay: number;
  lateGain: number;
  earlyReflections: EarlyReflectionDefinition[];
}

const REVERB_IMPULSE_DEFINITIONS: Record<
  ReverbEffectPreset,
  ReverbImpulseDefinition
> = {
  bathroom: {
    duration: 0.45,
    decayRate: 7.5,
    brightness: 0.95,
    lateDelay: 0.018,
    lateGain: 0.32,
    earlyReflections: [
      { delay: 0.004, gain: 0.75, pan: -0.35 },
      { delay: 0.008, gain: 0.6, pan: 0.3 },
      { delay: 0.013, gain: 0.42, pan: -0.15 },
    ],
  },
  garage: {
    duration: 0.9,
    decayRate: 5,
    brightness: 0.72,
    lateDelay: 0.035,
    lateGain: 0.42,
    earlyReflections: [
      { delay: 0.009, gain: 0.55, pan: -0.45 },
      { delay: 0.018, gain: 0.46, pan: 0.35 },
      { delay: 0.028, gain: 0.32, pan: -0.2 },
      { delay: 0.041, gain: 0.24, pan: 0.15 },
    ],
  },
  hall: {
    duration: 2.8,
    decayRate: 3.2,
    brightness: 0.6,
    lateDelay: 0.07,
    lateGain: 0.52,
    earlyReflections: [
      { delay: 0.018, gain: 0.36, pan: -0.5 },
      { delay: 0.033, gain: 0.32, pan: 0.42 },
      { delay: 0.052, gain: 0.25, pan: -0.18 },
      { delay: 0.076, gain: 0.2, pan: 0.24 },
      { delay: 0.108, gain: 0.14, pan: -0.08 },
    ],
  },
  cathedral: {
    duration: 4.8,
    decayRate: 2.35,
    brightness: 0.48,
    lateDelay: 0.12,
    lateGain: 0.62,
    earlyReflections: [
      { delay: 0.028, gain: 0.28, pan: -0.55 },
      { delay: 0.049, gain: 0.25, pan: 0.45 },
      { delay: 0.082, gain: 0.21, pan: -0.28 },
      { delay: 0.127, gain: 0.17, pan: 0.32 },
      { delay: 0.178, gain: 0.13, pan: -0.12 },
      { delay: 0.235, gain: 0.1, pan: 0.18 },
    ],
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

function getPannedGain(reflection: EarlyReflectionDefinition, channel: number) {
  if (channel === 0) {
    return reflection.pan <= 0
      ? reflection.gain
      : reflection.gain * (1 - reflection.pan);
  }

  return reflection.pan >= 0
    ? reflection.gain
    : reflection.gain * (1 + reflection.pan);
}

export function createReverbImpulseResponse(
  audioContext: BaseAudioContext,
  preset: ReverbEffectPreset,
) {
  const definition = REVERB_IMPULSE_DEFINITIONS[preset];
  const sampleRate = audioContext.sampleRate;
  const length = Math.max(1, Math.round(definition.duration * sampleRate));
  const lateDelaySamples = Math.round(definition.lateDelay * sampleRate);
  const buffer = audioContext.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const random = createSeededRandom(getPresetSeed(preset) + channel);
    const channelData = buffer.getChannelData(channel);
    let previousSample = 0;

    for (const reflection of definition.earlyReflections) {
      const index = Math.round(reflection.delay * sampleRate);
      if (index >= length) continue;

      channelData[index] += getPannedGain(reflection, channel);
    }

    for (let index = lateDelaySamples; index < length; index += 1) {
      const elapsedSeconds = (index - lateDelaySamples) / sampleRate;
      const envelope = Math.exp(-definition.decayRate * elapsedSeconds);
      const noise = random() * 2 - 1;
      const sample =
        previousSample * (1 - definition.brightness) +
        noise * definition.brightness;

      channelData[index] += sample * envelope * definition.lateGain;
      previousSample = sample;
    }
  }

  return buffer;
}
