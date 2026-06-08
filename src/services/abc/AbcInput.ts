import { getAbcPitch } from './AbcCalculations';
import type { PianoInputSettings } from '../../contexts/appSettings/AppSettingsContext';
import { getPitchOctave } from '../../utils/pitch';

const MAX_DENOMINATOR = 32;
const PITCH_CLASS_COUNT = 12;
const NATURAL_PITCH_CLASSES = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
} as const;
const KEY_ACCIDENTALS = [
  { root: 'C', offset: 0 },
  { root: 'G', offset: 1 },
  { root: 'D', offset: 2 },
  { root: 'A', offset: 3 },
  { root: 'E', offset: 4 },
  { root: 'B', offset: 5 },
  { root: 'F', offset: -1 },
  { root: 'Bb', offset: -2 },
  { root: 'Eb', offset: -3 },
  { root: 'Ab', offset: -4 },
  { root: 'Db', offset: -5 },
  { root: 'F#', offset: 6 },
  { root: 'C#', offset: 7 },
  { root: 'Gb', offset: -6 },
  { root: 'Cb', offset: -7 },
] as const;
const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B'] as const;
const FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F'] as const;
const NOTE_LENGTHS = [
  1 / 32,
  1 / 16,
  3 / 32,
  1 / 8,
  3 / 16,
  1 / 4,
  3 / 8,
  1 / 2,
  3 / 4,
  1,
] as const;

type NaturalPitchClass = keyof typeof NATURAL_PITCH_CLASSES;
type KeyAccidental = -1 | 0 | 1;

function isHeaderLine(line: string) {
  return /^[A-Z]:/.test(line.trim());
}

function getHeaderInsertLineIndex(lines: string[]) {
  const bodyLineIndex = lines.findIndex((line) => {
    const trimmedLine = line.trim();
    return trimmedLine && !isHeaderLine(trimmedLine);
  });

  return bodyLineIndex >= 0 ? bodyLineIndex : lines.length;
}

export function updateAbcHeaderField(
  content: string,
  key: 'L' | 'Q' | 'K',
  value: string,
) {
  const lines = content ? content.split(/\r?\n/) : [];
  const headerLineIndex = lines.findIndex((line) => line.startsWith(`${key}:`));

  if (headerLineIndex >= 0) {
    lines[headerLineIndex] = `${key}:${value}`;
    return lines.join('\n');
  }

  lines.splice(getHeaderInsertLineIndex(lines), 0, `${key}:${value}`);
  return lines.join('\n');
}

export function updateAbcHeader(
  content: string,
  settings: Partial<PianoInputSettings>,
) {
  return [
    ['L', settings.defaultNoteLength],
    ['Q', settings.tempo === undefined ? undefined : `1/4=${settings.tempo}`],
    ['K', settings.keySignature],
  ].reduce((nextContent, [key, value]) => {
    return value === undefined
      ? nextContent
      : updateAbcHeaderField(nextContent, key as 'L' | 'Q' | 'K', value);
  }, content);
}

function getNearestNoteLength(duration: number, quarterNoteSeconds: number) {
  const pressedLength = duration / quarterNoteSeconds / 4;
  if (pressedLength <= 0) {
    return NOTE_LENGTHS[0];
  }

  return NOTE_LENGTHS.reduce((nearest, noteLength) => {
    const nearestDistance = Math.abs(Math.log(pressedLength / nearest));
    const currentDistance = Math.abs(Math.log(pressedLength / noteLength));

    return currentDistance < nearestDistance ? noteLength : nearest;
  });
}

export function getQuarterNoteSeconds(tempo: number) {
  return 60 / tempo;
}

function parseNoteLength(noteLength: string) {
  const [numerator, denominator = '1'] = noteLength.split('/');
  return Number(numerator) / Number(denominator);
}

function getFraction(value: number) {
  for (let denominator = 1; denominator <= MAX_DENOMINATOR; denominator *= 2) {
    const numerator = Math.round(value * denominator);
    if (Math.abs(value - numerator / denominator) < Number.EPSILON) {
      return { numerator, denominator };
    }
  }

  return { numerator: Math.round(value), denominator: 1 };
}

function getDurationSuffix(noteLength: number, defaultNoteLength: string) {
  const ratio = noteLength / parseNoteLength(defaultNoteLength);
  const { numerator, denominator } = getFraction(ratio);

  if (numerator === denominator) {
    return '';
  }

  if (denominator === 1) {
    return numerator.toString();
  }

  return numerator === 1 ? `/${denominator}` : `${numerator}/${denominator}`;
}

function normalizePitchClass(value: number) {
  return ((value % PITCH_CLASS_COUNT) + PITCH_CLASS_COUNT) % PITCH_CLASS_COUNT;
}

function getPitchClass(pitch: number) {
  return normalizePitchClass(pitch);
}

function parseKeyRoot(keyValue: string) {
  const match = keyValue.trim().match(/^([A-Ga-g])([#b]?)/);
  if (!match) {
    return null;
  }

  return `${match[1].toUpperCase()}${match[2]}`;
}

function getKeySignatureOffset(content: string, fallbackKeySignature: string) {
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith('K:')) {
      continue;
    }

    const keyRoot = parseKeyRoot(trimmedLine.slice(2));
    return KEY_ACCIDENTALS.find(({ root }) => root === keyRoot)?.offset ?? 0;
  }

  const keyRoot = parseKeyRoot(fallbackKeySignature);
  return KEY_ACCIDENTALS.find(({ root }) => root === keyRoot)?.offset ?? 0;
}

function getKeySignatureAccidentals(
  content: string,
  fallbackKeySignature: string,
) {
  const accidentals = new Map<NaturalPitchClass, KeyAccidental>();
  const keySignatureOffset = getKeySignatureOffset(
    content,
    fallbackKeySignature,
  );
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

function getAbcPitchWithKeySignature(
  pitch: number,
  content: string,
  fallbackKeySignature: string,
) {
  const keySignatureAccidentals = getKeySignatureAccidentals(
    content,
    fallbackKeySignature,
  );
  const pitchClass = getPitchClass(pitch);
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
        naturalPitchClass,
        accidental,
        signedPitchClass: normalizePitchClass(
          NATURAL_PITCH_CLASSES[naturalPitchClass] + accidental,
        ),
        priority: Math.abs(accidental - keyAccidental),
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

export function appendPitchToAbc(
  content: string,
  pitch: number,
  duration: number,
  settings: PianoInputSettings,
) {
  const noteLength = getNearestNoteLength(
    duration,
    getQuarterNoteSeconds(settings.tempo),
  );
  const note = `${getAbcPitchWithKeySignature(
    pitch,
    content,
    settings.keySignature,
  )}${getDurationSuffix(noteLength, settings.defaultNoteLength)}`;
  const trimmedEnd = content.trimEnd();
  const lines = trimmedEnd.split(/\r?\n/);
  const lastLine = lines[lines.length - 1] ?? '';
  const separator = isHeaderLine(lastLine) ? '\n' : ' ';

  return `${trimmedEnd}${trimmedEnd ? separator : ''}${note} `;
}
