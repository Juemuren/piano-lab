import { useMemo } from 'react';
import { useSynthEngine } from '../contexts/useSynthEngine';
import { getPitchOptions } from '../utils/pitch';

const PITCH_OPTIONS = getPitchOptions();

function useBaseFrequencyOptions(baseFrequency: number) {
  const synthEngine = useSynthEngine();

  return useMemo(() => {
    const selectedPitch = PITCH_OPTIONS.find(
      ({ pitch }) =>
        Math.abs(synthEngine.getBaseFrequency(pitch) - baseFrequency) <
        Number.EPSILON,
    )?.pitch;

    const firstHigherPitchIndex = PITCH_OPTIONS.findIndex(
      ({ pitch }) => synthEngine.getBaseFrequency(pitch) > baseFrequency,
    );

    let pitchRangeLabel;
    switch (firstHigherPitchIndex) {
      case -1:
        pitchRangeLabel = `> ${PITCH_OPTIONS.at(firstHigherPitchIndex)?.label}`;
        break;
      case 0:
        pitchRangeLabel = `< ${PITCH_OPTIONS.at(firstHigherPitchIndex)?.label}`;
        break;
      default:
        pitchRangeLabel = `${PITCH_OPTIONS.at(firstHigherPitchIndex - 1)?.label} ~ ${PITCH_OPTIONS.at(firstHigherPitchIndex)?.label}`;
        break;
    }

    const customPitchOptionIndex =
      firstHigherPitchIndex === -1
        ? PITCH_OPTIONS.length
        : firstHigherPitchIndex;
    const baseFrequencyPitchOptions =
      selectedPitch === undefined
        ? [
            ...PITCH_OPTIONS.slice(0, customPitchOptionIndex),
            { pitch: 'custom' as const, label: pitchRangeLabel },
            ...PITCH_OPTIONS.slice(customPitchOptionIndex),
          ]
        : PITCH_OPTIONS;

    return {
      selectedPitch,
      baseFrequencyPitchOptions,
    };
  }, [synthEngine, baseFrequency]);
}

export default useBaseFrequencyOptions;
