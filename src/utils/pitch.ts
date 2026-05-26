export const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

export const MIN_PIANO_PITCH = 24; // C1
export const MAX_PIANO_PITCH = 108; // C8

export function getPitchName(pitch: number) {
  return NOTE_NAMES[pitch % 12];
}

export function getPitchOctave(pitch: number) {
  return Math.floor(pitch / 12) - 1;
}

export function getPitchLabel(pitch: number) {
  return `${getPitchName(pitch)}${getPitchOctave(pitch)}`;
}

export function getPitchOptions(
  minPitch: number = MIN_PIANO_PITCH,
  maxPitch: number = MAX_PIANO_PITCH,
) {
  return Array.from({ length: maxPitch - minPitch + 1 }, (_, index) => {
    const pitch = minPitch + index;
    return {
      pitch,
      label: getPitchLabel(pitch),
    };
  });
}
