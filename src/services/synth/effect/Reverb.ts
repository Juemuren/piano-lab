import type {
  ReverbConfig,
  ReverbEarlyReflectionConfig,
  ReverbLateTailConfig,
} from '../../../types';
import { degreesToRadians } from '../../../utils/math';
import { createGaussianRandomGenerator } from '../../../utils/random';
import type { BuiltInReverbPreset } from '../config/Options';

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
      { delay: 0.005, gain: 0.3, phase: 0 },
      { delay: 0.01, gain: 0.2, phase: 180 },
      { delay: 0.015, gain: 0.1, phase: 0 },
    ],
    lateTail: {
      alpha: 0.0002,
      amplitude: 0.02,
      delay: 0.02,
      duration: 1,
    },
  },
  cathedral: {
    earlyReflections: [
      { delay: 0.03, gain: 0.12, phase: 0 },
      { delay: 0.05, gain: 0.1, phase: 180 },
      { delay: 0.08, gain: 0.08, phase: 0 },
      { delay: 0.12, gain: 0.06, phase: 180 },
      { delay: 0.17, gain: 0.04, phase: 0 },
      { delay: 0.23, gain: 0.02, phase: 180 },
    ],
    lateTail: {
      alpha: 0.00005,
      amplitude: 0.005,
      delay: 0.25,
      duration: 8,
    },
  },
  garage: {
    earlyReflections: [
      { delay: 0.01, gain: 0.25, phase: 0 },
      { delay: 0.02, gain: 0.2, phase: 180 },
      { delay: 0.03, gain: 0.15, phase: 0 },
      { delay: 0.04, gain: 0.1, phase: 180 },
    ],
    lateTail: {
      alpha: 0.00015,
      amplitude: 0.015,
      delay: 0.05,
      duration: 2,
    },
  },
  hall: {
    earlyReflections: [
      { delay: 0.015, gain: 0.15, phase: 0 },
      { delay: 0.03, gain: 0.125, phase: 180 },
      { delay: 0.045, gain: 0.1, phase: 0 },
      { delay: 0.06, gain: 0.075, phase: 180 },
      { delay: 0.075, gain: 0.05, phase: 0 },
    ],
    lateTail: {
      alpha: 0.0001,
      amplitude: 0.01,
      delay: 0.09,
      duration: 4,
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

    amplitude[index] +=
      reflection.gain * Math.cos(degreesToRadians(reflection.phase));
  }

  const getRandomAmplitude = createGaussianRandomGenerator(
    LATE_TAIL_RANDOM_SEED,
  );

  for (let offset = 0; offset < tailLength; offset += 1) {
    amplitude[tailStartIndex + offset] +=
      lateTail.amplitude *
      getRandomAmplitude() *
      Math.exp(-lateTail.alpha * offset);
  }

  return {
    amplitude,
    time,
  };
}

export function createReverbConfig(
  preset: BuiltInReverbPreset,
  mix: number,
): ReverbConfig {
  const definition = REVERB_PRESET_DEFINITIONS[preset];

  return {
    earlyReflections: definition.earlyReflections.map((reflection) => ({
      ...reflection,
    })),
    lateTail: {
      ...definition.lateTail,
    },
    mix,
    preset,
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
