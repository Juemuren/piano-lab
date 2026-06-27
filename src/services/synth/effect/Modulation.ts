import type {
  AmplitudeModulationConfig,
  DelayModulationConfig,
  FrequencyModulationConfig,
  PhaseModulationConfig,
} from '../../../types/synth';

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

export function getAmplitudeModulationCurvePoints(
  amplitudeModulation: AmplitudeModulationConfig,
) {
  const time = createTimePoints();
  const depth = Math.min(Math.max(amplitudeModulation.depth, 0), 0.5);

  return {
    gainRatio: time.map(
      (t) =>
        1 -
        depth +
        depth * Math.sin(2 * Math.PI * amplitudeModulation.frequency * t),
    ),
    time,
  };
}

export function getFrequencyModulationCurvePoints(
  frequencyModulation: FrequencyModulationConfig,
) {
  const time = createTimePoints();
  const frequencyRatioDepth =
    2 ** (Math.max(frequencyModulation.depth, 0) / 1200) - 1;

  return {
    frequencyRatio: time.map(
      (t) =>
        1 +
        frequencyRatioDepth *
          Math.sin(2 * Math.PI * frequencyModulation.frequency * t),
    ),
    time,
  };
}

export function getPhaseModulationCurvePoints(
  phaseModulation: PhaseModulationConfig,
) {
  const time = createTimePoints();
  const depth = Math.min(Math.max(phaseModulation.depth, 0), Math.PI);

  return {
    phase: time.map(
      (t) => depth * Math.sin(2 * Math.PI * phaseModulation.frequency * t),
    ),
    time,
  };
}

export function getDelayModulationCurvePoints(
  delayModulation: DelayModulationConfig,
) {
  const time = createTimePoints();
  const depth = Math.max(delayModulation.depth, 0);

  return {
    delaySeconds: time.map(
      (t) =>
        depth / 2 +
        (depth / 2) * Math.sin(2 * Math.PI * delayModulation.frequency * t),
    ),
    time,
  };
}
