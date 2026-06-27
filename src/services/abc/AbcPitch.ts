import { getPitchName, getPitchOctave } from '../../utils/pitch';
import { KEY_ACCIDENTALS } from './AbcSettings';

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

function getSignedPitchClass({ accidental, pitchClass }: AbcPitchSpelling) {
  return normalizePitchClass(NATURAL_PITCH_CLASSES[pitchClass] + accidental);
}

function parseKeyRoot(keySignature: string) {
  const match = keySignature.trim().match(/^([A-Ga-g])([#b]?)/);
  if (!match) {
    return null;
  }

  return `${match[1].toUpperCase()}${match[2]}`;
}

function getKeySignatureOffset(keySignature: string) {
  const keyRoot = parseKeyRoot(keySignature);
  return KEY_ACCIDENTALS.find(({ root }) => root === keyRoot)?.offset ?? 0;
}

function getKeyAccidentalMap(keySignature: string) {
  const offset = getKeySignatureOffset(keySignature);
  const pitchClasses =
    offset >= 0 ? SHARP_ORDER.slice(0, offset) : FLAT_ORDER.slice(0, -offset);
  const accidental = offset >= 0 ? 1 : -1;

  return new Map<NaturalPitchClass, KeyAccidental>(
    pitchClasses.map((pitchClass) => [pitchClass, accidental]),
  );
}

function getDefaultPitchSpelling(pitch: number): AbcPitchSpelling {
  const pitchName = getPitchName(pitch);

  return {
    accidental: pitchName.includes('#') ? 1 : 0,
    pitchClass: pitchName[0] as NaturalPitchClass,
  };
}

function formatAbcPitch(pitch: number, spelling: AbcPitchSpelling) {
  const octave = getPitchOctave(pitch);
  const accidentalToken =
    spelling.accidental === 1 ? '^' : spelling.accidental === -1 ? '_' : '';
  const pitchToken =
    octave <= 4
      ? `${spelling.pitchClass}${','.repeat(4 - octave)}`
      : `${spelling.pitchClass.toLowerCase()}${"'".repeat(octave - 5)}`;

  return `${accidentalToken}${pitchToken}`;
}

function getNaturalKeySpelling(
  pitchClass: number,
  keyAccidentals: Map<NaturalPitchClass, KeyAccidental>,
): AbcPitchSpelling | null {
  for (const naturalPitchClass of Object.keys(
    NATURAL_PITCH_CLASSES,
  ) as NaturalPitchClass[]) {
    const spelling: AbcPitchSpelling = {
      accidental: keyAccidentals.get(naturalPitchClass) ?? 0,
      pitchClass: naturalPitchClass,
    };

    if (getSignedPitchClass(spelling) === pitchClass) {
      return {
        accidental: 0,
        pitchClass: naturalPitchClass,
      };
    }
  }

  return null;
}

function getExplicitAccidentalSpelling(
  pitchClass: number,
  keyAccidentals: Map<NaturalPitchClass, KeyAccidental>,
): AbcPitchSpelling | null {
  const candidates = (Object.keys(NATURAL_PITCH_CLASSES) as NaturalPitchClass[])
    .flatMap((naturalPitchClass) => {
      const keyAccidental = keyAccidentals.get(naturalPitchClass) ?? 0;

      return ([-1, 1] as const).map((accidental) => ({
        priority: Math.abs(accidental - keyAccidental),
        spelling: {
          accidental,
          pitchClass: naturalPitchClass,
        },
      }));
    })
    .filter(({ spelling }) => getSignedPitchClass(spelling) === pitchClass)
    .sort((left, right) => left.priority - right.priority);

  return candidates[0]?.spelling ?? null;
}

function getPitchSpellingInKey(
  pitch: number,
  keySignature: string,
): AbcPitchSpelling {
  const pitchClass = normalizePitchClass(pitch);
  const keyAccidentals = getKeyAccidentalMap(keySignature);

  return (
    getNaturalKeySpelling(pitchClass, keyAccidentals) ??
    getExplicitAccidentalSpelling(pitchClass, keyAccidentals) ??
    getDefaultPitchSpelling(pitch)
  );
}

export function getAbcPitchWithKeySignature(
  pitch: number,
  keySignature: string,
) {
  return formatAbcPitch(pitch, getPitchSpellingInKey(pitch, keySignature));
}
