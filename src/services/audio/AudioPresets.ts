import type {
  TransferFunction,
  TransferFunctionType,
  Spectrum,
  SpectrumType,
} from '../../types';

function delayToArg(delay: number, frequency: number) {
  return -2 * Math.PI * delay * frequency;
}

function radToDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

function normalizeDeg(angle: number) {
  return (((angle % 360) + 540) % 360) - 180;
}

function normalizeAmplitudes(amplitudes: number[]) {
  const maxAmplitude = Math.max(...amplitudes);
  if (maxAmplitude === 0) return amplitudes.map(() => 0);
  return amplitudes.map((amplitude) => amplitude / maxAmplitude);
}

export function getSpectrumPreset(
  type: SpectrumType,
  lambda: number,
  sigma: number,
  p: number,
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

  return { type, amplitudes: normalizeAmplitudes(amplitudes) };
}

export function getTransferFunctionPreset(
  type: TransferFunctionType,
  tau: number,
  alpha: number,
  minFrequency: number,
  maxFrequency: number,
  baseFrequency: number,
  harmonics: number,
): TransferFunction {
  const magnitudes: number[] = [];
  const phases: number[] = [];
  const delay = tau / 1000;

  for (let n = 1; n <= harmonics; n++) {
    const frequency = baseFrequency * n;
    let magnitude = 1;
    let phaseDeg = 0;

    switch (type) {
      case 'delay': {
        magnitude = 1;
        const arg = delayToArg(delay, frequency);
        phaseDeg = normalizeDeg(radToDeg(arg));
        break;
      }
      case 'single_echo': {
        const arg = delayToArg(delay, frequency);
        const cosArg = Math.cos(arg);
        const sinArg = Math.sin(arg);
        magnitude = Math.sqrt(1 + alpha * alpha + 2 * alpha * cosArg);
        const phaseRad = Math.atan2(alpha * sinArg, 1 + alpha * cosArg);
        phaseDeg = radToDeg(phaseRad);
        break;
      }
      case 'multi_echo': {
        const arg = delayToArg(delay, frequency);
        const cosArg = Math.cos(arg);
        const sinArg = Math.sin(arg);
        magnitude = 1 / Math.sqrt(1 + alpha * alpha - 2 * alpha * cosArg);
        const phaseRad = Math.atan2(alpha * sinArg, 1 - alpha * cosArg);
        phaseDeg = radToDeg(phaseRad);
        break;
      }
      case 'all_pass': {
        const arg = delayToArg(delay, frequency);
        const cosArg = Math.cos(arg);
        const sinArg = Math.sin(arg);
        magnitude = 1;
        const phaseRad =
          arg + 2 * Math.atan2(alpha * sinArg, 1 - alpha * cosArg);
        phaseDeg = normalizeDeg(radToDeg(phaseRad));
        break;
      }
      case 'low_pass': {
        magnitude = frequency <= maxFrequency ? 1 : 0;
        phaseDeg = 0;
        break;
      }
      case 'high_pass': {
        magnitude = frequency >= minFrequency ? 1 : 0;
        phaseDeg = 0;
        break;
      }
      case 'band_pass': {
        magnitude =
          frequency >= minFrequency && frequency <= maxFrequency ? 1 : 0;
        phaseDeg = 0;
        break;
      }
    }

    magnitudes.push(magnitude);
    phases.push(phaseDeg);
  }

  return {
    type,
    tau,
    alpha,
    minFrequency,
    maxFrequency,
    magnitudes,
    phases,
  };
}
