import type {
  BuiltInReverbEffectPreset,
  ReverbEffectConfig,
  ReverbEarlyReflectionConfig,
  ReverbLateTailConfig,
} from '../../types';

type ReverbPresetDefinition = Pick<
  ReverbEffectConfig,
  'earlyReflections' | 'lateTail'
>;

export const REVERB_PRESET_DEFINITIONS: Record<
  BuiltInReverbEffectPreset,
  ReverbPresetDefinition
> = {
  bathroom: {
    earlyReflections: [
      { delay: 0.004, gain: 0.75 },
      { delay: 0.008, gain: 0.58 },
      { delay: 0.013, gain: 0.4 },
    ],
    lateTail: {
      delay: 0.018,
      duration: 0.45,
      amplitude: 0.32,
      alpha: 0.00035,
    },
  },
  garage: {
    earlyReflections: [
      { delay: 0.009, gain: 0.55 },
      { delay: 0.018, gain: 0.46 },
      { delay: 0.028, gain: 0.32 },
      { delay: 0.041, gain: 0.24 },
    ],
    lateTail: {
      delay: 0.035,
      duration: 0.9,
      amplitude: 0.42,
      alpha: 0.00017,
    },
  },
  hall: {
    earlyReflections: [
      { delay: 0.018, gain: 0.36 },
      { delay: 0.033, gain: 0.32 },
      { delay: 0.052, gain: 0.25 },
      { delay: 0.076, gain: 0.2 },
      { delay: 0.108, gain: 0.14 },
    ],
    lateTail: {
      delay: 0.07,
      duration: 2.8,
      amplitude: 0.52,
      alpha: 0.000056,
    },
  },
  cathedral: {
    earlyReflections: [
      { delay: 0.028, gain: 0.28 },
      { delay: 0.049, gain: 0.25 },
      { delay: 0.082, gain: 0.21 },
      { delay: 0.127, gain: 0.17 },
      { delay: 0.178, gain: 0.13 },
      { delay: 0.235, gain: 0.1 },
    ],
    lateTail: {
      delay: 0.12,
      duration: 4.8,
      amplitude: 0.62,
      alpha: 0.000033,
    },
  },
};

function getImpulseDuration(
  earlyReflections: ReverbEarlyReflectionConfig[],
  lateTail: ReverbLateTailConfig,
) {
  const maxReflectionDelay = earlyReflections.reduce(
    (maxDelay, reflection) => Math.max(maxDelay, reflection.delay),
    0,
  );

  return Math.max(maxReflectionDelay, lateTail.delay + lateTail.duration);
}

export function createReverbEffectConfig(
  preset: BuiltInReverbEffectPreset,
  mix: number,
): ReverbEffectConfig {
  const definition = REVERB_PRESET_DEFINITIONS[preset];

  return {
    preset,
    mix,
    earlyReflections: definition.earlyReflections.map((reflection) => ({
      ...reflection,
    })),
    lateTail: {
      ...definition.lateTail,
    },
  };
}

export function createReverbImpulseResponse(
  audioContext: BaseAudioContext,
  config: ReverbEffectConfig,
) {
  const { earlyReflections, lateTail } = config;
  const sampleRate = audioContext.sampleRate;
  const duration = getImpulseDuration(earlyReflections, lateTail);
  const length = Math.max(1, Math.round(duration * sampleRate));
  const tailStartIndex = Math.round(lateTail.delay * sampleRate);
  const tailLength = Math.min(
    length - tailStartIndex,
    Math.round(lateTail.duration * sampleRate),
  );
  const buffer = audioContext.createBuffer(1, length, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (const reflection of earlyReflections) {
    const index = Math.round(reflection.delay * sampleRate);
    if (index >= length) continue;

    channelData[index] += reflection.gain;
  }

  for (let offset = 0; offset < tailLength; offset += 1) {
    channelData[tailStartIndex + offset] +=
      lateTail.amplitude * Math.exp(-lateTail.alpha * offset);
  }

  return buffer;
}
