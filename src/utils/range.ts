import type { CSSProperties } from 'react';

type RangeProgressStyle = CSSProperties & {
  '--range-progress': string;
};

export const getRangeProgressStyle = (
  value: number,
  min: number | string,
  max: number | string,
): RangeProgressStyle => {
  const numericMin = Number(min);
  const numericMax = Number(max);
  const progress =
    numericMax === numericMin
      ? 0
      : ((value - numericMin) / (numericMax - numericMin)) * 100;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return {
    '--range-progress': `${clampedProgress}%`,
  };
};
