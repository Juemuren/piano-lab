import { getAbcPitch } from './AbcCalculations';
import type { PianoInputSettings } from '../../contexts/appSettings/AppSettingsContext';
import { getPitchOctave } from '../../utils/pitch';

const MAX_DENOMINATOR = 32;
const MEASURES_PER_LINE = 4;
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
type AbcHeaderFieldKey = 'L' | 'Q' | 'K' | 'M';

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
  key: AbcHeaderFieldKey,
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
    ['M', settings.timeSignature],
    ['K', settings.keySignature],
  ].reduce((nextContent, [key, value]) => {
    return value === undefined
      ? nextContent
      : updateAbcHeaderField(nextContent, key as AbcHeaderFieldKey, value);
  }, content);
}

function getAbcHeaderField(content: string, key: AbcHeaderFieldKey) {
  const lines = content.split(/\r?\n/);
  const headerLine = lines.find((line) => line.trim().startsWith(`${key}:`));

  return headerLine?.trim().slice(2).trim();
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

function parseTempo(tempo: string) {
  const value = tempo.trim().match(/(?:^|=)(\d+(?:\.\d+)?)$/)?.[1];
  return value === undefined ? Number.NaN : Number(value);
}

function parseNoteLength(noteLength: string) {
  const [numerator, denominator = '1'] = noteLength.split('/');
  return Number(numerator) / Number(denominator);
}

function parseMeter(meter: string) {
  const normalizedMeter = meter.trim();
  if (normalizedMeter === 'C') {
    return 1;
  }
  if (normalizedMeter === 'C|') {
    return 1 / 2;
  }
  if (normalizedMeter.toLowerCase() === 'none') {
    return null;
  }

  const [numerator, denominator] = normalizedMeter.split('/');
  const meterLength = Number(numerator) / Number(denominator);

  return Number.isFinite(meterLength) && meterLength > 0 ? meterLength : 1;
}

function parseDurationSuffix(durationSuffix: string) {
  if (!durationSuffix) {
    return 1;
  }

  const match = durationSuffix.match(/^(\d*)(\/+)?(\d*)$/);
  if (!match) {
    return 1;
  }

  const numerator = match[1] ? Number(match[1]) : 1;
  const slashCount = match[2]?.length ?? 0;
  const denominator = match[3]
    ? Number(match[3])
    : slashCount > 0
      ? 2 ** slashCount
      : 1;

  return numerator / denominator;
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

function getBodyContent(content: string) {
  return content
    .split(/\r?\n/)
    .filter((line) => !isHeaderLine(line))
    .join('\n');
}

function getLastBodyLine(content: string) {
  const lines = content.split(/\r?\n/);

  for (let index = lines.length - 1; index >= 0; index--) {
    const line = lines[index];
    if (line.trim() && !isHeaderLine(line)) {
      return line;
    }
  }

  return '';
}

function getCompletedMeasureCount(line: string) {
  return Array.from(line.matchAll(/\|/g)).length;
}

function getCurrentMeasureLength(content: string, defaultNoteLength: string) {
  const defaultLength = parseNoteLength(defaultNoteLength);
  const bodyContent = getBodyContent(content);
  const lastMeasureContent = bodyContent.split('|').at(-1) ?? '';
  const noteMatches = lastMeasureContent.matchAll(
    /(?:\^|_|=)*[A-Ga-gz][,']*(\d*(?:\/+\d*)?)/g,
  );

  return Array.from(noteMatches).reduce((measureLength, match) => {
    return measureLength + defaultLength * parseDurationSuffix(match[1] ?? '');
  }, 0);
}

function shouldStartNewLine(content: string) {
  const lastBodyLine = getLastBodyLine(content);
  return getCompletedMeasureCount(lastBodyLine) >= MEASURES_PER_LINE;
}

function getMeasureSeparator(
  content: string,
  defaultNoteLength: string,
  nextNoteLength: number,
  fallbackTimeSignature: string,
) {
  const meterLength = parseMeter(
    getAbcHeaderField(content, 'M') ?? fallbackTimeSignature,
  );
  if (meterLength === null) {
    return '';
  }

  const measureLength = getCurrentMeasureLength(content, defaultNoteLength);
  if (measureLength > 0 && measureLength + nextNoteLength > meterLength) {
    return '|';
  }

  return '';
}

function getMeasureSeparatorSuffix(content: string, measureSeparator: string) {
  if (!measureSeparator) {
    return '';
  }

  const lastBodyLine = getLastBodyLine(content);
  const completedMeasureCount = getCompletedMeasureCount(lastBodyLine) + 1;

  return completedMeasureCount >= MEASURES_PER_LINE ? '\n' : ' ';
}

function getCompletedMeasureSuffix(
  content: string,
  defaultNoteLength: string,
  nextNoteLength: number,
  fallbackTimeSignature: string,
) {
  const meterLength = parseMeter(
    getAbcHeaderField(content, 'M') ?? fallbackTimeSignature,
  );
  if (meterLength === null) {
    return '';
  }

  const measureLength = getCurrentMeasureLength(content, defaultNoteLength);
  const nextMeasureLength = (measureLength + nextNoteLength) % meterLength;

  return nextNoteLength > 0 && nextMeasureLength < Number.EPSILON ? ' |' : '';
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
  const keyRoot = parseKeyRoot(
    getAbcHeaderField(content, 'K') ?? fallbackKeySignature,
  );
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
  const defaultNoteLength =
    getAbcHeaderField(content, 'L') ?? settings.defaultNoteLength;
  const tempo = parseTempo(
    getAbcHeaderField(content, 'Q') ?? `1/4=${settings.tempo}`,
  );
  const noteLength = getNearestNoteLength(
    duration,
    getQuarterNoteSeconds(Number.isFinite(tempo) ? tempo : settings.tempo),
  );
  const note = `${getAbcPitchWithKeySignature(
    pitch,
    content,
    settings.keySignature,
  )}${getDurationSuffix(noteLength, defaultNoteLength)}`;
  const measureSeparator = getMeasureSeparator(
    content,
    defaultNoteLength,
    noteLength,
    settings.timeSignature,
  );
  const completedMeasureSuffix = getCompletedMeasureSuffix(
    measureSeparator ? `${content.trimEnd()} ${measureSeparator}` : content,
    defaultNoteLength,
    noteLength,
    settings.timeSignature,
  );
  const trimmedEnd = content.trimEnd();
  const lines = trimmedEnd.split(/\r?\n/);
  const lastLine = lines[lines.length - 1] ?? '';
  const separator =
    isHeaderLine(lastLine) || shouldStartNewLine(trimmedEnd) ? '\n' : ' ';
  const measureSeparatorSuffix = getMeasureSeparatorSuffix(
    content,
    measureSeparator,
  );

  return `${trimmedEnd}${trimmedEnd ? separator : ''}${measureSeparator}${measureSeparatorSuffix}${note}${completedMeasureSuffix} `;
}
