import { z } from 'zod';
import {
  EQUALIZER_TYPES,
  FILTER_EQUALIZER_PRESETS,
  FILTER_TYPES,
  OSCILLATOR_TYPES,
  PANNER_DISTANCE_MODELS,
  PANNER_PANNING_MODELS,
  REVERB_PRESETS,
  SPECTRUM_TYPES,
  WAVE_SHAPER_PRESETS,
} from './Options';

const MAX_EFFECT_ITEMS = 64;

const modulationFrequencySchema = z.number().min(0.1).max(20);

const filterSchema = z.strictObject({
  frequency: z.number().min(20).max(20000),
  q: z.number().min(0.1).max(20),
  type: z.enum(FILTER_TYPES),
});

const equalizerSchema = z.strictObject({
  frequency: z.number().min(20).max(20000),
  gain: z.number().min(-24).max(24),
  q: z.number().min(0.1).max(20),
  type: z.enum(EQUALIZER_TYPES),
});

const filterEqualizerSchema = z.strictObject({
  equalizers: z.array(equalizerSchema).max(MAX_EFFECT_ITEMS),
  filters: z.array(filterSchema).max(MAX_EFFECT_ITEMS),
  preset: z.enum(FILTER_EQUALIZER_PRESETS),
});

const compressorSchema = z.strictObject({
  attack: z.number().min(0).max(1),
  knee: z.number().min(0).max(40),
  ratio: z.number().min(1).max(20),
  release: z.number().min(0).max(1),
  threshold: z.number().min(-100).max(0),
});

const pannerSchema = z.strictObject({
  coneInnerAngle: z.number().min(0).max(360),
  coneOuterAngle: z.number().min(0).max(360),
  coneOuterGain: z.number().min(0).max(1),
  distanceModel: z.enum(PANNER_DISTANCE_MODELS),
  maxDistance: z.number().min(1).max(10000),
  orientationX: z.number().min(-1).max(1),
  orientationY: z.number().min(-1).max(1),
  orientationZ: z.number().min(-1).max(1),
  panningModel: z.enum(PANNER_PANNING_MODELS),
  positionX: z.number().min(-10).max(10),
  positionY: z.number().min(-10).max(10),
  positionZ: z.number().min(-10).max(10),
  refDistance: z.number().min(0.01).max(10),
  rolloffFactor: z.number().min(0).max(10),
});

const reverbSchema = z.strictObject({
  earlyReflections: z
    .array(
      z.strictObject({
        delay: z.number().min(0).max(0.5),
        gain: z.number().min(0).max(1),
        phase: z.number().min(0).max(180),
      }),
    )
    .max(MAX_EFFECT_ITEMS),
  lateTail: z.strictObject({
    alpha: z.number().min(0.00001).max(0.001),
    amplitude: z.number().min(0).max(0.1),
    delay: z.number().min(0).max(1),
    duration: z.number().min(1).max(10),
  }),
  mix: z.number().min(0).max(1),
  preset: z.enum(REVERB_PRESETS),
});

const waveShaperSchema = z.strictObject({
  distortion: z.number().min(2).max(10),
  fuzz: z.number().min(10).max(100),
  overdrive: z.number().min(1).max(20),
  preset: z.enum(WAVE_SHAPER_PRESETS),
  saturation: z.number().min(0).max(1),
});

const synthConfigSchema = z
  .strictObject({
    effect: z.strictObject({
      amplitudeModulation: z
        .strictObject({
          depth: z.number().min(0).max(0.5),
          frequency: modulationFrequencySchema,
        })
        .nullable(),
      compressor: compressorSchema.nullable(),
      delayModulation: z
        .strictObject({
          depth: z.number().min(0).max(0.02),
          frequency: modulationFrequencySchema.max(10),
        })
        .nullable(),
      filterEqualizer: filterEqualizerSchema.nullable(),
      frequencyModulation: z
        .strictObject({
          depth: z.number().min(0).max(100),
          frequency: modulationFrequencySchema,
        })
        .nullable(),
      panner: pannerSchema.nullable(),
      phaseModulation: z
        .strictObject({
          depth: z.number().min(0).max(Math.PI),
          frequency: modulationFrequencySchema.max(10),
        })
        .nullable(),
      reverb: reverbSchema.nullable(),
      waveShaper: waveShaperSchema.nullable(),
    }),
    envelope: z.strictObject({
      attackTime: z.number().min(0.001).max(0.1),
      decayTime: z.number().min(0.01).max(1),
      releaseTime: z.number().min(0.1).max(10),
      silenceGain: z.number().min(0.000001).max(0.001),
      sustainGain: z.number().min(0.1).max(1),
    }),
    spectrum: z.strictObject({
      customAmplitudes: z.array(z.number().min(0).max(1)).min(2).max(20),
      lambda: z.number().min(0).max(1),
      p: z.number().min(0.5).max(4),
      sigma: z.number().min(0.01).max(1),
      type: z.enum(SPECTRUM_TYPES),
    }),
    synth: z.strictObject({
      harmonicCount: z.number().int().min(2).max(20),
      oscillatorType: z.enum(OSCILLATOR_TYPES),
      volumeRatio: z.number().min(0).max(1),
    }),
  })
  .refine(
    (config) =>
      config.spectrum.customAmplitudes.length === config.synth.harmonicCount,
    { path: ['spectrum', 'customAmplitudes'] },
  );

export type SynthConfig = z.infer<typeof synthConfigSchema>;

export function parseSynthConfig(content: string): SynthConfig {
  return synthConfigSchema.parse(JSON.parse(content));
}
