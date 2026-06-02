export function getPlaybackDurationSeconds(
  duration: number,
  millisecondsPerDuration: number,
) {
  return (duration * millisecondsPerDuration) / 1000;
}

export function getHighlightDurationMs(
  duration: number,
  millisecondsPerDuration: number,
  highlightIntervalMs: number,
) {
  return duration * millisecondsPerDuration - highlightIntervalMs;
}
