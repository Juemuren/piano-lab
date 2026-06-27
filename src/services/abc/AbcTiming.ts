export function getQuarterNoteSeconds(tempo: number) {
  return 60 / tempo;
}

export function parseTempo(tempo: string) {
  return Number(tempo.trim().match(/(?:^|=)(\d+(?:\.\d+)?)$/)?.[1]);
}

export function parseNoteLength(noteLength: string) {
  const [numerator, denominator = '1'] = noteLength.split('/');
  return Number(numerator) / Number(denominator);
}

export function parseMeter(meter: string) {
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
  return Number(numerator) / Number(denominator);
}

export function parseDurationSuffix(durationSuffix: string) {
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
