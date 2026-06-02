import { getAbcPitch } from '../../utils/pitch';
import type { PianoInputSettings } from '../../contexts/appSettings/AppSettingsContext';

const NOTE_LENGTHS = [1 / 32, 1 / 16, 1 / 8, 1 / 4, 1 / 2, 1] as const;

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
  key: 'L' | 'Q',
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
  ].reduce((nextContent, [key, value]) => {
    return value === undefined
      ? nextContent
      : updateAbcHeaderField(nextContent, key as 'L' | 'Q', value);
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
  const [numerator, denominator] = noteLength.split('/');
  return Number(numerator) / Number(denominator);
}

function getDurationSuffix(noteLength: number, defaultNoteLength: string) {
  const ratio = noteLength / parseNoteLength(defaultNoteLength);

  if (ratio === 1) {
    return '';
  }

  if (ratio >= 1) {
    return Math.round(ratio).toString();
  }

  const denominator = Math.round(1 / ratio);
  return `/${denominator}`;
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
  const note = `${getAbcPitch(pitch)}${getDurationSuffix(
    noteLength,
    settings.defaultNoteLength,
  )}`;
  const trimmedEnd = content.trimEnd();
  const lines = trimmedEnd.split(/\r?\n/);
  const lastLine = lines[lines.length - 1] ?? '';
  const separator = isHeaderLine(lastLine) ? '\n' : ' ';

  return `${trimmedEnd}${trimmedEnd ? separator : ''}${note} `;
}
