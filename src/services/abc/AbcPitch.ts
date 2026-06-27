import { getPitchName, getPitchOctave } from '../../utils/pitch';

const PITCH_CLASS_COUNT = 12;
const NATURAL_PITCH_CLASSES = {
  A: 9,
  B: 11,
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
} as const;
const KEY_ACCIDENTALS = [
  { offset: 0, root: 'C' },
  { offset: 1, root: 'G' },
  { offset: 2, root: 'D' },
  { offset: 3, root: 'A' },
  { offset: 4, root: 'E' },
  { offset: 5, root: 'B' },
  { offset: -1, root: 'F' },
  { offset: -2, root: 'Bb' },
  { offset: -3, root: 'Eb' },
  { offset: -4, root: 'Ab' },
  { offset: -5, root: 'Db' },
  { offset: 6, root: 'F#' },
  { offset: 7, root: 'C#' },
  { offset: -6, root: 'Gb' },
  { offset: -7, root: 'Cb' },
] as const;
const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B'] as const;
const FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F'] as const;

type NaturalPitchClass = keyof typeof NATURAL_PITCH_CLASSES;
type KeyAccidental = -1 | 0 | 1;

function normalizePitchClass(value: number) {
  return ((value % PITCH_CLASS_COUNT) + PITCH_CLASS_COUNT) % PITCH_CLASS_COUNT;
}

function parseKeyRoot(keyValue: string) {
  const match = keyValue.trim().match(/^([A-Ga-g])([#b]?)/);
  if (!match) {
    return null;
  }

  return `${match[1].toUpperCase()}${match[2]}`;
}

function getKeySignatureOffset(keySignature: string) {
  const keyRoot = parseKeyRoot(keySignature);
  return KEY_ACCIDENTALS.find(({ root }) => root === keyRoot)?.offset ?? 0;
}

function getKeySignatureAccidentals(keySignature: string) {
  const accidentals = new Map<NaturalPitchClass, KeyAccidental>();
  const keySignatureOffset = getKeySignatureOffset(keySignature);
  const accidentalOrder =
    keySignatureOffset >= 0
      ? SHARP_ORDER.slice(0, keySignatureOffset)
      : FLAT_ORDER.slice(0, -keySignatureOffset);
  const accidental = keySignatureOffset >= 0 ? 1 : -1;

  for (const pitchClass of accidentalOrder) {
    accidentals.set(pitchClass, accidental);
  }

  return accidentals;
}

function getAbcPitchToken(
  pitchClass: NaturalPitchClass,
  octave: number,
  accidental: KeyAccidental,
) {
  const accidentalToken = accidental === 1 ? '^' : accidental === -1 ? '_' : '';
  const pitchToken =
    octave <= 4
      ? `${pitchClass}${','.repeat(4 - octave)}`
      : `${pitchClass.toLowerCase()}${"'".repeat(octave - 5)}`;

  return `${accidentalToken}${pitchToken}`;
}

function getAbcPitch(pitch: number) {
  const name = getPitchName(pitch);
  const octave = getPitchOctave(pitch);
  const accidental = name.includes('#') ? '^' : '';
  const pitchClass = name[0];

  if (octave <= 4) {
    return `${accidental}${pitchClass}${','.repeat(4 - octave)}`;
  }
  return `${accidental}${pitchClass.toLowerCase()}${"'".repeat(octave - 5)}`;
}

export function getAbcPitchWithKeySignature(
  pitch: number,
  keySignature: string,
) {
  const keySignatureAccidentals = getKeySignatureAccidentals(keySignature);
  const pitchClass = normalizePitchClass(pitch);
  const octave = getPitchOctave(pitch);

  for (const naturalPitchClass of Object.keys(
    NATURAL_PITCH_CLASSES,
  ) as NaturalPitchClass[]) {
    const accidental = keySignatureAccidentals.get(naturalPitchClass) ?? 0;
    const signedPitchClass = normalizePitchClass(
      NATURAL_PITCH_CLASSES[naturalPitchClass] + accidental,
    );

    if (signedPitchClass === pitchClass) {
      return getAbcPitchToken(naturalPitchClass, octave, 0);
    }
  }

  const candidates = (Object.keys(NATURAL_PITCH_CLASSES) as NaturalPitchClass[])
    .flatMap((naturalPitchClass) => {
      const keyAccidental = keySignatureAccidentals.get(naturalPitchClass) ?? 0;

      return ([-1, 1] as const).map((accidental) => ({
        accidental,
        naturalPitchClass,
        priority: Math.abs(accidental - keyAccidental),
        signedPitchClass: normalizePitchClass(
          NATURAL_PITCH_CLASSES[naturalPitchClass] + accidental,
        ),
      }));
    })
    .filter(({ signedPitchClass }) => signedPitchClass === pitchClass)
    .sort((left, right) => left.priority - right.priority);

  const candidate = candidates[0];
  if (!candidate) {
    return getAbcPitch(pitch);
  }

  return getAbcPitchToken(
    candidate.naturalPitchClass,
    octave,
    candidate.accidental,
  );
}
