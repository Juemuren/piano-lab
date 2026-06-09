import type {
  DelayModulationConfig,
  PhaseModulationConfig,
  TremoloConfig,
  VibratoConfig,
} from '../../../types';

const MODULATION_CURVE_POINT_COUNT = 256;
const MODULATION_CURVE_DURATION_SECONDS = 1;

function createTimePoints() {
  return Array.from({ length: MODULATION_CURVE_POINT_COUNT }, (_, index) => {
    return (
      (index / (MODULATION_CURVE_POINT_COUNT - 1)) *
      MODULATION_CURVE_DURATION_SECONDS
    );
  });
}

export function getTremoloCurvePoints(tremolo: TremoloConfig) {
  const time = createTimePoints();
  const depth = Math.min(Math.max(tremolo.depth, 0), 0.5);

  return {
    time,
    gainRatio: time.map(
      (t) => 1 - depth + depth * Math.sin(2 * Math.PI * tremolo.frequency * t),
    ),
  };
}

export function getVibratoCurvePoints(vibrato: VibratoConfig) {
  const time = createTimePoints();
  const frequencyRatioDepth = 2 ** (Math.max(vibrato.depth, 0) / 1200) - 1;

  return {
    time,
    frequencyRatio: time.map(
      (t) =>
        1 + frequencyRatioDepth * Math.sin(2 * Math.PI * vibrato.frequency * t),
    ),
  };
}

export function getPhaseModulationCurvePoints(
  phaseModulation: PhaseModulationConfig,
) {
  const time = createTimePoints();
  const depth = Math.min(Math.max(phaseModulation.depth, 0), Math.PI);

  return {
    time,
    phase: time.map(
      (t) => depth * Math.sin(2 * Math.PI * phaseModulation.frequency * t),
    ),
  };
}

export function getDelayModulationCurvePoints(
  delayModulation: DelayModulationConfig,
) {
  const time = createTimePoints();
  const depth = Math.max(delayModulation.depth, 0);

  return {
    time,
    delaySeconds: time.map(
      (t) =>
        depth / 2 +
        (depth / 2) * Math.sin(2 * Math.PI * delayModulation.frequency * t),
    ),
  };
}
