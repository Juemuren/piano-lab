import { getPitchName, getPitchOctave } from '../../utils/pitch';

export function getAbcPitch(pitch: number) {
  const name = getPitchName(pitch);
  const octave = getPitchOctave(pitch);
  const accidental = name.includes('#') ? '^' : '';
  const pitchClass = name[0];

  if (octave <= 4) {
    return `${accidental}${pitchClass}${','.repeat(4 - octave)}`;
  }
  return `${accidental}${pitchClass.toLowerCase()}${"'".repeat(octave - 5)}`;
}

export function getPlaybackDurationSeconds(
  duration: number,
  millisecondsPerDuration: number,
) {
  return (duration * millisecondsPerDuration) / 1000;
}

export function getHighlightDurationMs(
  duration: number,
  millisecondsPerDuration: number,
  highlightIntervalMs: number,
) {
  return duration * millisecondsPerDuration - highlightIntervalMs;
}
