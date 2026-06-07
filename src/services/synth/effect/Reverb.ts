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
const UNIFORM_RANDOM_MEAN_SQUARE = 1 / 3;

export const REVERB_PRESET_DEFINITIONS: Record<
  BuiltInReverbPreset,
  ReverbPresetDefinition
> = {
  bathroom: {
    earlyReflections: [
      { delay: 0.004, gain: 0.28 },
      { delay: 0.008, gain: 0.18 },
      { delay: 0.013, gain: 0.12 },
    ],
    lateTail: {
      delay: 0.018,
      duration: 0.45,
      amplitude: 0.15,
      alpha: 0.00035,
    },
  },
  garage: {
    earlyReflections: [
      { delay: 0.009, gain: 0.24 },
      { delay: 0.018, gain: 0.19 },
      { delay: 0.028, gain: 0.14 },
      { delay: 0.041, gain: 0.1 },
    ],
    lateTail: {
      delay: 0.035,
      duration: 0.9,
      amplitude: 0.26,
      alpha: 0.00017,
    },
  },
  hall: {
    earlyReflections: [
      { delay: 0.018, gain: 0.18 },
      { delay: 0.033, gain: 0.14 },
      { delay: 0.052, gain: 0.1 },
      { delay: 0.076, gain: 0.075 },
      { delay: 0.108, gain: 0.05 },
    ],
    lateTail: {
      delay: 0.07,
      duration: 2.8,
      amplitude: 0.32,
      alpha: 0.000056,
    },
  },
  cathedral: {
    earlyReflections: [
      { delay: 0.028, gain: 0.15 },
      { delay: 0.049, gain: 0.12 },
      { delay: 0.082, gain: 0.09 },
      { delay: 0.127, gain: 0.065 },
      { delay: 0.178, gain: 0.045 },
      { delay: 0.235, gain: 0.03 },
    ],
    lateTail: {
      delay: 0.12,
      duration: 4.8,
      amplitude: 0.38,
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

function getLateTailEnergyScale(alpha: number, length: number) {
  if (length <= 0) return 0;

  let energy = 0;

  for (let offset = 0; offset < length; offset += 1) {
    const envelope = Math.exp(-alpha * offset);
    energy += UNIFORM_RANDOM_MEAN_SQUARE * envelope * envelope;
  }

  return energy > 0 ? 1 / Math.sqrt(energy) : 0;
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

  const tailEnergyScale = getLateTailEnergyScale(lateTail.alpha, tailLength);
  const getRandomAmplitude = createRandomAmplitudeGenerator();

  for (let offset = 0; offset < tailLength; offset += 1) {
    amplitude[tailStartIndex + offset] +=
      lateTail.amplitude *
      tailEnergyScale *
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
