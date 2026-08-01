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
import type { NumberRange } from './Ranges';
import { SYNTH_CONFIG_RANGES } from './Ranges';

function numberInRange({ min, max }: NumberRange) {
  return z.number().min(min).max(max);
}

const ranges = SYNTH_CONFIG_RANGES;

const filterSchema = z.strictObject({
  frequency: numberInRange(ranges.effect.filter.frequency),
  q: numberInRange(ranges.effect.filter.q),
  type: z.enum(FILTER_TYPES),
});

const equalizerSchema = z.strictObject({
  frequency: numberInRange(ranges.effect.equalizer.frequency),
  gain: numberInRange(ranges.effect.equalizer.gain),
  q: numberInRange(ranges.effect.equalizer.q),
  type: z.enum(EQUALIZER_TYPES),
});

const filterEqualizerSchema = z.strictObject({
  equalizers: z.array(equalizerSchema),
  filters: z.array(filterSchema),
  preset: z.enum(FILTER_EQUALIZER_PRESETS),
});

const compressorSchema = z.strictObject({
  attack: numberInRange(ranges.effect.compressor.attack),
  knee: numberInRange(ranges.effect.compressor.knee),
  ratio: numberInRange(ranges.effect.compressor.ratio),
  release: numberInRange(ranges.effect.compressor.release),
  threshold: numberInRange(ranges.effect.compressor.threshold),
});

const pannerSchema = z.strictObject({
  coneInnerAngle: numberInRange(ranges.effect.panner.coneInnerAngle),
  coneOuterAngle: numberInRange(ranges.effect.panner.coneOuterAngle),
  coneOuterGain: numberInRange(ranges.effect.panner.coneOuterGain),
  distanceModel: z.enum(PANNER_DISTANCE_MODELS),
  maxDistance: numberInRange(ranges.effect.panner.maxDistance),
  orientationX: numberInRange(ranges.effect.panner.orientationX),
  orientationY: numberInRange(ranges.effect.panner.orientationY),
  orientationZ: numberInRange(ranges.effect.panner.orientationZ),
  panningModel: z.enum(PANNER_PANNING_MODELS),
  positionX: numberInRange(ranges.effect.panner.positionX),
  positionY: numberInRange(ranges.effect.panner.positionY),
  positionZ: numberInRange(ranges.effect.panner.positionZ),
  refDistance: numberInRange(ranges.effect.panner.refDistance),
  rolloffFactor: numberInRange(ranges.effect.panner.rolloffFactor),
});

const reverbSchema = z.strictObject({
  earlyReflections: z.array(
    z.strictObject({
      delay: numberInRange(ranges.effect.reverb.earlyReflection.delay),
      gain: numberInRange(ranges.effect.reverb.earlyReflection.gain),
      phase: numberInRange(ranges.effect.reverb.earlyReflection.phase),
    }),
  ),
  lateTail: z.strictObject({
    alpha: numberInRange(ranges.effect.reverb.lateTail.alpha),
    amplitude: numberInRange(ranges.effect.reverb.lateTail.amplitude),
    delay: numberInRange(ranges.effect.reverb.lateTail.delay),
    duration: numberInRange(ranges.effect.reverb.lateTail.duration),
  }),
  mix: numberInRange(ranges.effect.reverb.mix),
  preset: z.enum(REVERB_PRESETS),
});

const waveShaperSchema = z.strictObject({
  distortion: numberInRange(ranges.effect.waveShaper.distortion),
  fuzz: numberInRange(ranges.effect.waveShaper.fuzz),
  overdrive: numberInRange(ranges.effect.waveShaper.overdrive),
  preset: z.enum(WAVE_SHAPER_PRESETS),
  saturation: numberInRange(ranges.effect.waveShaper.saturation),
});

const synthConfigSchema = z
  .strictObject({
    effect: z.strictObject({
      amplitudeModulation: z
        .strictObject({
          depth: numberInRange(ranges.effect.amplitudeModulation.depth),
          frequency: numberInRange(ranges.effect.amplitudeModulation.frequency),
        })
        .nullable(),
      compressor: compressorSchema.nullable(),
      delayModulation: z
        .strictObject({
          depth: numberInRange(ranges.effect.delayModulation.depth),
          frequency: numberInRange(ranges.effect.delayModulation.frequency),
        })
        .nullable(),
      filterEqualizer: filterEqualizerSchema.nullable(),
      frequencyModulation: z
        .strictObject({
          depth: numberInRange(ranges.effect.frequencyModulation.depth),
          frequency: numberInRange(ranges.effect.frequencyModulation.frequency),
        })
        .nullable(),
      panner: pannerSchema.nullable(),
      phaseModulation: z
        .strictObject({
          depth: numberInRange(ranges.effect.phaseModulation.depth),
          frequency: numberInRange(ranges.effect.phaseModulation.frequency),
        })
        .nullable(),
      reverb: reverbSchema.nullable(),
      waveShaper: waveShaperSchema.nullable(),
    }),
    envelope: z.strictObject({
      attackTime: numberInRange(ranges.envelope.attackTime),
      decayTime: numberInRange(ranges.envelope.decayTime),
      releaseTime: numberInRange(ranges.envelope.releaseTime),
      silenceGain: numberInRange(ranges.envelope.silenceGain),
      sustainGain: numberInRange(ranges.envelope.sustainGain),
    }),
    spectrum: z.strictObject({
      customAmplitudes: z
        .array(numberInRange(ranges.spectrum.amplitude))
        .min(ranges.synth.harmonicCount.min)
        .max(ranges.synth.harmonicCount.max),
      lambda: numberInRange(ranges.spectrum.lambda),
      p: numberInRange(ranges.spectrum.p),
      sigma: numberInRange(ranges.spectrum.sigma),
      type: z.enum(SPECTRUM_TYPES),
    }),
    synth: z.strictObject({
      harmonicCount: numberInRange(ranges.synth.harmonicCount).int(),
      oscillatorType: z.enum(OSCILLATOR_TYPES),
      volumeRatio: numberInRange(ranges.synth.volumeRatio),
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
