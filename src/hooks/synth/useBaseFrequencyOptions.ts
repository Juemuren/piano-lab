import { useMemo } from 'react';
import { getBaseFrequency } from '../../services/synth/Envelope';
import { getPitchOptions } from '../../utils/pitch';

const PITCH_OPTIONS = getPitchOptions();

function useBaseFrequencyOptions(baseFrequency: number) {
  return useMemo(() => {
    const selectedPitch = PITCH_OPTIONS.find(
      ({ pitch }) =>
        Math.abs(getBaseFrequency(pitch) - baseFrequency) < Number.EPSILON,
    )?.pitch;

    const firstHigherPitchIndex = PITCH_OPTIONS.findIndex(
      ({ pitch }) => getBaseFrequency(pitch) > baseFrequency,
    );

    let pitchRangeLabel: string;
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
            { label: pitchRangeLabel, pitch: 'custom' as const },
            ...PITCH_OPTIONS.slice(customPitchOptionIndex),
          ]
        : PITCH_OPTIONS;

    return {
      baseFrequencyPitchOptions,
      selectedPitch,
    };
  }, [baseFrequency]);
}

export default useBaseFrequencyOptions;
