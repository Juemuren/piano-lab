import type { Spectrum, SpectrumDefinition } from '../../types';

function normalizeAmplitudes(amplitudes: number[]) {
  const maxAmplitude = Math.max(...amplitudes);
  if (maxAmplitude === 0) return amplitudes.map(() => 0);
  return amplitudes.map((amplitude) => amplitude / maxAmplitude);
}

export function createSpectrum(
  { type, lambda, sigma, p }: SpectrumDefinition,
  harmonics: number,
): Spectrum {
  const amplitudes: number[] = [];

  for (let n = 1; n <= harmonics; n++) {
    let amplitude = 0;
    switch (type) {
      case 'ethereal':
        amplitude = (1 / (n * n)) * Math.abs(Math.sin((n * Math.PI) / 2));
        break;
      case 'metallic':
        amplitude = 1 / n;
        break;
      case 'pure':
        amplitude = 1 / (n * n);
        break;
      case 'bright':
        amplitude = (1 / n) * Math.abs(Math.sin((n * Math.PI) / 2));
        break;
      case 'normal':
        amplitude = (1 / (n * n)) * Math.abs(Math.sin(n * Math.PI * lambda));
        break;
      case 'soft':
        amplitude = Math.exp(-sigma * n);
        break;
      case 'realistic':
        amplitude = (1 / Math.pow(n, p)) * Math.exp(-sigma * n);
        break;
    }
    amplitudes.push(amplitude);
  }

  return { amplitudes: normalizeAmplitudes(amplitudes) };
}
