import { getRequiredAbcHeaderField, isAbcHeaderLine } from './AbcHeader';
import { getAbcPitchWithKeySignature } from './AbcPitch';
import {
  getQuarterNoteSeconds,
  parseDurationSuffix,
  parseMeter,
  parseNoteLength,
  parseTempo,
} from './AbcTiming';

const MAX_DENOMINATOR = 32;
const MEASURES_PER_LINE = 4;
const ABC_NOTE_PATTERN = /(?:\^|_|=)*[A-Ga-gz][,']*(\d*(?:\/+\d*)?)/g;
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

interface AbcInputHeader {
  defaultNoteLength: string;
  keySignature: string;
  meterLength: number | null;
  tempo: number;
}

interface MeasureState {
  currentLength: number;
  measuresInLastLine: number;
}

function readAbcInputHeader(content: string): AbcInputHeader {
  return {
    defaultNoteLength: getRequiredAbcHeaderField(content, 'L'),
    keySignature: getRequiredAbcHeaderField(content, 'K'),
    meterLength: parseMeter(getRequiredAbcHeaderField(content, 'M')),
    tempo: parseTempo(getRequiredAbcHeaderField(content, 'Q')),
  };
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

function getFraction(value: number) {
  for (let denominator = 1; denominator <= MAX_DENOMINATOR; denominator *= 2) {
    const numerator = Math.round(value * denominator);
    if (Math.abs(value - numerator / denominator) < Number.EPSILON) {
      return { denominator, numerator };
    }
  }

  return { denominator: 1, numerator: Math.round(value) };
}

function formatDurationSuffix(noteLength: number, defaultNoteLength: string) {
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

function getBodyLines(content: string) {
  return content.split(/\r?\n/).filter((line) => !isAbcHeaderLine(line));
}

function getLastBodyLine(content: string) {
  const lines = getBodyLines(content);

  for (let index = lines.length - 1; index >= 0; index--) {
    const line = lines[index];
    if (line.trim()) {
      return line;
    }
  }

  return '';
}

function countCompletedMeasures(line: string) {
  return Array.from(line.matchAll(/\|/g)).length;
}

function getCurrentMeasureLength(content: string, defaultNoteLength: string) {
  const defaultLength = parseNoteLength(defaultNoteLength);
  const bodyContent = getBodyLines(content).join('\n');
  const currentMeasure = bodyContent.split('|').at(-1) ?? '';

  return Array.from(currentMeasure.matchAll(ABC_NOTE_PATTERN)).reduce(
    (measureLength, match) => {
      return (
        measureLength + defaultLength * parseDurationSuffix(match[1] ?? '')
      );
    },
    0,
  );
}

function getMeasureState(
  content: string,
  defaultNoteLength: string,
): MeasureState {
  const lastBodyLine = getLastBodyLine(content);

  return {
    currentLength: getCurrentMeasureLength(content, defaultNoteLength),
    measuresInLastLine: countCompletedMeasures(lastBodyLine),
  };
}

function shouldBreakBeforeNextNote(trimmedContent: string) {
  const lastLine = trimmedContent.split(/\r?\n/).at(-1) ?? '';
  if (isAbcHeaderLine(lastLine)) {
    return true;
  }

  const lastBodyLine = getLastBodyLine(trimmedContent);
  return countCompletedMeasures(lastBodyLine) >= MEASURES_PER_LINE;
}

function getContentSeparator(trimmedContent: string) {
  if (!trimmedContent) {
    return '';
  }

  return shouldBreakBeforeNextNote(trimmedContent) ? '\n' : ' ';
}

function shouldStartNewMeasure(
  measureState: MeasureState,
  meterLength: number | null,
  nextNoteLength: number,
) {
  return (
    meterLength !== null &&
    measureState.currentLength > 0 &&
    measureState.currentLength + nextNoteLength > meterLength
  );
}

function getMeasurePrefixSuffix(measuresInLastLine: number) {
  return measuresInLastLine + 1 >= MEASURES_PER_LINE ? '\n' : ' ';
}

function getCompletedMeasureSuffix(
  measureLengthBeforeNote: number,
  meterLength: number | null,
  nextNoteLength: number,
) {
  if (meterLength === null || nextNoteLength <= 0) {
    return '';
  }

  const nextMeasureLength =
    (measureLengthBeforeNote + nextNoteLength) % meterLength;
  return nextMeasureLength < Number.EPSILON ? ' |' : '';
}

export function appendPitchToAbc(
  content: string,
  pitch: number,
  duration: number,
) {
  const header = readAbcInputHeader(content);
  const noteLength = getNearestNoteLength(
    duration,
    getQuarterNoteSeconds(header.tempo),
  );
  const note = [
    getAbcPitchWithKeySignature(pitch, header.keySignature),
    formatDurationSuffix(noteLength, header.defaultNoteLength),
  ].join('');
  const measureState = getMeasureState(content, header.defaultNoteLength);
  const startsNewMeasure = shouldStartNewMeasure(
    measureState,
    header.meterLength,
    noteLength,
  );
  const measurePrefix = startsNewMeasure ? '|' : '';
  const measurePrefixSuffix = startsNewMeasure
    ? getMeasurePrefixSuffix(measureState.measuresInLastLine)
    : '';
  const measureLengthBeforeNote = startsNewMeasure
    ? 0
    : measureState.currentLength;
  const completedMeasureSuffix = getCompletedMeasureSuffix(
    measureLengthBeforeNote,
    header.meterLength,
    noteLength,
  );
  const trimmedContent = content.trimEnd();

  return [
    trimmedContent,
    getContentSeparator(trimmedContent),
    measurePrefix,
    measurePrefixSuffix,
    note,
    completedMeasureSuffix,
    ' ',
  ].join('');
}
