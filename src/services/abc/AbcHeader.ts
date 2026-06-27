import type { PianoInputSettings } from './AbcSettings';
import { parseTempo } from './AbcTiming';

type AbcHeaderFieldKey = 'L' | 'Q' | 'K' | 'M';

export function isAbcHeaderLine(line: string) {
  return /^[A-Z]:/.test(line.trim());
}

function getHeaderInsertLineIndex(lines: string[]) {
  const bodyLineIndex = lines.findIndex((line) => {
    const trimmedLine = line.trim();
    return trimmedLine && !isAbcHeaderLine(trimmedLine);
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

export function getPianoInputSettingsFromAbcHeader(
  content: string,
): PianoInputSettings {
  return {
    defaultNoteLength: getRequiredAbcHeaderField(content, 'L'),
    keySignature: getRequiredAbcHeaderField(content, 'K'),
    tempo: parseTempo(getRequiredAbcHeaderField(content, 'Q')),
    timeSignature: getRequiredAbcHeaderField(content, 'M'),
  };
}

export function hasPianoInputSettingsHeader(content: string) {
  return (
    getAbcHeaderField(content, 'L') !== undefined &&
    getAbcHeaderField(content, 'Q') !== undefined &&
    getAbcHeaderField(content, 'M') !== undefined &&
    getAbcHeaderField(content, 'K') !== undefined
  );
}

export function clearAbcBody(content: string) {
  return content
    .split(/\r?\n/)
    .filter((line) => isAbcHeaderLine(line))
    .join('\n');
}

function getAbcHeaderField(content: string, key: AbcHeaderFieldKey) {
  const lines = content.split(/\r?\n/);
  const headerLine = lines.find((line) => line.trim().startsWith(`${key}:`));

  return headerLine?.trim().slice(2).trim();
}

export function getRequiredAbcHeaderField(
  content: string,
  key: AbcHeaderFieldKey,
) {
  return getAbcHeaderField(content, key) as string;
}
