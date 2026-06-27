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
    .filter((line) => !isAbcHeaderLine(line))
    .join('\n');
}

function getLastBodyLine(content: string) {
  const lines = content.split(/\r?\n/);

  for (let index = lines.length - 1; index >= 0; index--) {
    const line = lines[index];
    if (line.trim() && !isAbcHeaderLine(line)) {
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
) {
  const meterLength = parseMeter(getRequiredAbcHeaderField(content, 'M'));
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
) {
  const meterLength = parseMeter(getRequiredAbcHeaderField(content, 'M'));
  if (meterLength === null) {
    return '';
  }

  const measureLength = getCurrentMeasureLength(content, defaultNoteLength);
  const nextMeasureLength = (measureLength + nextNoteLength) % meterLength;

  return nextNoteLength > 0 && nextMeasureLength < Number.EPSILON ? ' |' : '';
}

export function appendPitchToAbc(
  content: string,
  pitch: number,
  duration: number,
) {
  const defaultNoteLength = getRequiredAbcHeaderField(content, 'L');
  const keySignature = getRequiredAbcHeaderField(content, 'K');
  const tempo = parseTempo(getRequiredAbcHeaderField(content, 'Q'));
  const noteLength = getNearestNoteLength(
    duration,
    getQuarterNoteSeconds(tempo),
  );
  const note = `${getAbcPitchWithKeySignature(pitch, keySignature)}${getDurationSuffix(noteLength, defaultNoteLength)}`;
  const measureSeparator = getMeasureSeparator(
    content,
    defaultNoteLength,
    noteLength,
  );
  const completedMeasureSuffix = getCompletedMeasureSuffix(
    measureSeparator ? `${content.trimEnd()} ${measureSeparator}` : content,
    defaultNoteLength,
    noteLength,
  );
  const trimmedEnd = content.trimEnd();
  const lines = trimmedEnd.split(/\r?\n/);
  const lastLine = lines[lines.length - 1] ?? '';
  const separator =
    isAbcHeaderLine(lastLine) || shouldStartNewLine(trimmedEnd) ? '\n' : ' ';
  const measureSeparatorSuffix = getMeasureSeparatorSuffix(
    content,
    measureSeparator,
  );

  return `${trimmedEnd}${trimmedEnd ? separator : ''}${measureSeparator}${measureSeparatorSuffix}${note}${completedMeasureSuffix} `;
}
