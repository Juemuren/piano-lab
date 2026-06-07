import type {
  BuiltInReverbPreset,
  ReverbConfig,
  ReverbEarlyReflectionConfig,
  ReverbLateTailConfig,
} from '../../../types';

type ReverbPresetDefinition = Pick<
  ReverbConfig,
  'earlyReflections' | 'lateTail'
>;

const LATE_TAIL_RANDOM_SEED = 0x4d595df4;

export const REVERB_PRESET_DEFINITIONS: Record<
  BuiltInReverbPreset,
  ReverbPresetDefinition
> = {
  bathroom: {
    earlyReflections: [
      { delay: 0.005, gain: 0.3 },
      { delay: 0.01, gain: 0.2 },
      { delay: 0.015, gain: 0.1 },
    ],
    lateTail: {
      delay: 0.02,
      duration: 0.5,
      amplitude: 0.02,
      alpha: 0.0002,
    },
  },
  garage: {
    earlyReflections: [
      { delay: 0.01, gain: 0.25 },
      { delay: 0.02, gain: 0.2 },
      { delay: 0.03, gain: 0.15 },
      { delay: 0.04, gain: 0.1 },
    ],
    lateTail: {
      delay: 0.05,
      duration: 1,
      amplitude: 0.015,
      alpha: 0.00015,
    },
  },
  hall: {
    earlyReflections: [
      { delay: 0.015, gain: 0.15 },
      { delay: 0.03, gain: 0.125 },
      { delay: 0.045, gain: 0.1 },
      { delay: 0.06, gain: 0.075 },
      { delay: 0.075, gain: 0.05 },
    ],
    lateTail: {
      delay: 0.09,
      duration: 2,
      amplitude: 0.01,
      alpha: 0.0001,
    },
  },
  cathedral: {
    earlyReflections: [
      { delay: 0.03, gain: 0.12 },
      { delay: 0.05, gain: 0.1 },
      { delay: 0.08, gain: 0.08 },
      { delay: 0.12, gain: 0.06 },
      { delay: 0.17, gain: 0.04 },
      { delay: 0.23, gain: 0.02 },
    ],
    lateTail: {
      delay: 0.25,
      duration: 4,
      amplitude: 0.005,
      alpha: 0.00005,
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

function createRandomAmplitudeGenerator() {
  let state = LATE_TAIL_RANDOM_SEED;

  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return (state / 0xffffffff) * 2 - 1;
  };
}

export function getReverbImpulseResponseSamples(
  config: ReverbConfig,
  sampleRate: number,
) {
  const { earlyReflections, lateTail } = config;
  const duration = getImpulseDuration(earlyReflections, lateTail);
  const length = Math.max(1, Math.round(duration * sampleRate));
  const tailStartIndex = Math.round(lateTail.delay * sampleRate);
  const tailLength = Math.min(
    length - tailStartIndex,
    Math.round(lateTail.duration * sampleRate),
  );
  const time = Array.from({ length }, (_, index) => index / sampleRate);
  const amplitude = new Array<number>(length).fill(0);

  amplitude[0] += 1;

  for (const reflection of earlyReflections) {
    const index = Math.round(reflection.delay * sampleRate);
    if (index >= length) continue;

    amplitude[index] += reflection.gain;
  }

  const getRandomAmplitude = createRandomAmplitudeGenerator();

  for (let offset = 0; offset < tailLength; offset += 1) {
    amplitude[tailStartIndex + offset] +=
      lateTail.amplitude *
      getRandomAmplitude() *
      Math.exp(-lateTail.alpha * offset);
  }

  return {
    time,
    amplitude,
  };
}

export function createReverbConfig(
  preset: BuiltInReverbPreset,
  mix: number,
): ReverbConfig {
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
  config: ReverbConfig,
) {
  const sampleRate = audioContext.sampleRate;
  const samples = getReverbImpulseResponseSamples(config, sampleRate);
  const buffer = audioContext.createBuffer(
    1,
    samples.amplitude.length,
    sampleRate,
  );
  const channelData = buffer.getChannelData(0);

  channelData.set(samples.amplitude);

  return buffer;
}
