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

interface AbcPitchSpelling {
  accidental: KeyAccidental;
  pitchClass: NaturalPitchClass;
}

function normalizePitchClass(value: number) {
  return ((value % PITCH_CLASS_COUNT) + PITCH_CLASS_COUNT) % PITCH_CLASS_COUNT;
}

function getSignedPitchClass(
  pitchClass: NaturalPitchClass,
  accidental: KeyAccidental,
) {
  return normalizePitchClass(NATURAL_PITCH_CLASSES[pitchClass] + accidental);
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

function getAbcPitchToken(pitch: number, spelling?: AbcPitchSpelling) {
  const defaultName = spelling === undefined ? getPitchName(pitch) : undefined;
  const octave = getPitchOctave(pitch);
  const pitchClass =
    spelling?.pitchClass ?? (defaultName?.[0] as NaturalPitchClass);
  const accidental =
    spelling?.accidental ?? (defaultName?.includes('#') ? 1 : 0);
  const accidentalToken = accidental === 1 ? '^' : accidental === -1 ? '_' : '';
  const pitchToken =
    octave <= 4
      ? `${pitchClass}${','.repeat(4 - octave)}`
      : `${pitchClass.toLowerCase()}${"'".repeat(octave - 5)}`;

  return `${accidentalToken}${pitchToken}`;
}

export function getAbcPitchWithKeySignature(
  pitch: number,
  keySignature: string,
) {
  const keySignatureAccidentals = getKeySignatureAccidentals(keySignature);
  const pitchClass = normalizePitchClass(pitch);

  for (const naturalPitchClass of Object.keys(
    NATURAL_PITCH_CLASSES,
  ) as NaturalPitchClass[]) {
    const accidental = keySignatureAccidentals.get(naturalPitchClass) ?? 0;
    const signedPitchClass = getSignedPitchClass(naturalPitchClass, accidental);

    if (signedPitchClass === pitchClass) {
      return getAbcPitchToken(pitch, {
        accidental: 0,
        pitchClass: naturalPitchClass,
      });
    }
  }

  const candidates = (Object.keys(NATURAL_PITCH_CLASSES) as NaturalPitchClass[])
    .flatMap((naturalPitchClass) => {
      const keyAccidental = keySignatureAccidentals.get(naturalPitchClass) ?? 0;

      return ([-1, 1] as const).map((accidental) => ({
        accidental,
        naturalPitchClass,
        priority: Math.abs(accidental - keyAccidental),
        signedPitchClass: getSignedPitchClass(naturalPitchClass, accidental),
      }));
    })
    .filter(({ signedPitchClass }) => signedPitchClass === pitchClass)
    .sort((left, right) => left.priority - right.priority);

  const candidate = candidates[0];
  if (!candidate) {
    return getAbcPitchToken(pitch);
  }

  return getAbcPitchToken(pitch, {
    accidental: candidate.accidental,
    pitchClass: candidate.naturalPitchClass,
  });
}
