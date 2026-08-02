import { SYNTH_CONFIG_DEFAULTS } from '../config/Defaults';
import type { WaveShaperPreset } from '../config/Options';

const CURVE_SAMPLE_COUNT = 2048;

export interface WaveShaperConfig {
  distortion: number;
  fuzz: number;
  overdrive: number;
  preset: WaveShaperPreset;
  saturation: number;
}

export type WaveShaperConfigAction =
  | { enabled: boolean; type: 'setEnabled' }
  | { patch: Partial<WaveShaperConfig>; type: 'update' };

export function createWaveShaperConfig(): WaveShaperConfig {
  return { ...SYNTH_CONFIG_DEFAULTS.effect.waveShaper };
}

export function reduceWaveShaperConfig(
  config: WaveShaperConfig | null,
  action: WaveShaperConfigAction,
): WaveShaperConfig | null {
  if (action.type === 'setEnabled') {
    return action.enabled ? (config ?? createWaveShaperConfig()) : null;
  }

  return { ...(config ?? createWaveShaperConfig()), ...action.patch };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getWaveShaperAmount(config: WaveShaperConfig) {
  switch (config.preset) {
    case 'saturation':
      return clamp(config.saturation, 0, 1);
    case 'distortion':
      return clamp(config.distortion, 2, 10);
    case 'overdrive':
      return clamp(config.overdrive, 1, 20);
    case 'fuzz':
      return clamp(config.fuzz, 10, 100);
  }
}

function shapeSample(x: number, preset: WaveShaperPreset, amount: number) {
  switch (preset) {
    case 'saturation':
      return x / (1 + amount * Math.abs(x));
    case 'distortion':
      return Math.tanh(amount * x);
    case 'overdrive':
      return Math.atan(amount * x) / Math.atan(amount);
    case 'fuzz':
      return (2 / Math.PI) * Math.atan(amount * x);
  }
}

export function createWaveShaperCurve(config: WaveShaperConfig) {
  const curve = new Float32Array(CURVE_SAMPLE_COUNT);
  const amount = getWaveShaperAmount(config);

  for (let index = 0; index < CURVE_SAMPLE_COUNT; index += 1) {
    const x = (index / (CURVE_SAMPLE_COUNT - 1)) * 2 - 1;
    curve[index] = shapeSample(x, config.preset, amount);
  }

  return curve;
}

export function getWaveShaperCurvePoints(config: WaveShaperConfig) {
  const curve = createWaveShaperCurve(config);
  const x = Array.from(
    { length: curve.length },
    (_, index) => (index / (curve.length - 1)) * 2 - 1,
  );

  return {
    x,
    y: Array.from(curve),
  };
}
