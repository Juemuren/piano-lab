import type { Accidental } from 'abcjs';
import { parseOnly } from 'abcjs';
import { getPitchName } from '../../utils/pitch';

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
const keyAccidentalMaps = new Map<
  string,
  Map<NaturalPitchClass, KeyAccidental>
>();

type NaturalPitchClass = keyof typeof NATURAL_PITCH_CLASSES;
type KeyAccidental = -1 | 0 | 1;

interface AbcPitchSpelling {
  accidental: KeyAccidental;
  pitchClass: NaturalPitchClass;
  soundingAccidental: KeyAccidental;
}

function normalizePitchClass(value: number) {
  return ((value % PITCH_CLASS_COUNT) + PITCH_CLASS_COUNT) % PITCH_CLASS_COUNT;
}

function getSignedPitchClass({
  pitchClass,
  soundingAccidental,
}: AbcPitchSpelling) {
  return normalizePitchClass(
    NATURAL_PITCH_CLASSES[pitchClass] + soundingAccidental,
  );
}

function getAccidentalValue(accidental: Accidental['acc']): KeyAccidental {
  return accidental === 'sharp' ? 1 : accidental === 'flat' ? -1 : 0;
}

function getKeyAccidentalMap(keySignature: string) {
  const cachedMap = keyAccidentalMaps.get(keySignature);
  if (cachedMap) {
    return cachedMap;
  }

  const keySignatureMap = new Map<NaturalPitchClass, KeyAccidental>(
    parseOnly(`K:${keySignature}\nC`)[0]
      .getKeySignature()
      .accidentals?.map(({ acc, note }) => [
        note.toUpperCase() as NaturalPitchClass,
        getAccidentalValue(acc),
      ]) ?? [],
  );
  keyAccidentalMaps.set(keySignature, keySignatureMap);

  return keySignatureMap;
}

function getDefaultPitchSpelling(pitch: number): AbcPitchSpelling {
  const pitchName = getPitchName(pitch);

  return {
    accidental: pitchName.includes('#') ? 1 : 0,
    pitchClass: pitchName[0] as NaturalPitchClass,
    soundingAccidental: pitchName.includes('#') ? 1 : 0,
  };
}

function formatAbcPitch(pitch: number, spelling: AbcPitchSpelling) {
  const octave =
    (pitch -
      spelling.soundingAccidental -
      NATURAL_PITCH_CLASSES[spelling.pitchClass]) /
      PITCH_CLASS_COUNT -
    1;
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
    const keyAccidental = keyAccidentals.get(naturalPitchClass) ?? 0;
    const spelling: AbcPitchSpelling = {
      accidental: 0,
      pitchClass: naturalPitchClass,
      soundingAccidental: keyAccidental,
    };

    if (getSignedPitchClass(spelling) === pitchClass) {
      return spelling;
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
          soundingAccidental: accidental,
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
