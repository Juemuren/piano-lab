import type {
  Spectrum,
  TransferFunction,
  TransferFunctionDefinition,
} from '../../types';
import { createTransferFunction } from './SynthDefinitions';

export interface SynthVoicePlan {
  harmonic: number;
  frequency: number;
  startTime: number;
  attackEnd: number;
  decayEnd: number;
  attackGain: number;
  decayGain: number;
  sustainGain: number;
  silenceGain: number;
}

export interface CreateSynthVoicePlansOptions {
  pitch: number;
  volume: number;
  cents: number;
  now: number;
  spectrum: Spectrum;
  transferFunctionDefinition: TransferFunctionDefinition;
  volumeRatio: number;
  attackTime: number;
  decayTime: number;
  sustainGain: number;
  silenceGain: number;
  minGainValue: number;
}

export function getBaseFrequency(pitch: number, cents: number = 0) {
  return 440 * Math.pow(2, (pitch + cents / 100 - 69) / 12);
}

export function getTargetGain(
  spectrumAmplitude: number,
  transferMagnitude: number,
  volume: number,
  volumeRatio: number,
) {
  return spectrumAmplitude * transferMagnitude * (volume / 127) * volumeRatio;
}

export function getDelaySeconds(phaseDeg: number, frequency: number) {
  return phaseDeg / (360 * frequency);
}

export function createSynthVoicePlans({
  pitch,
  volume,
  cents,
  now,
  spectrum,
  transferFunctionDefinition,
  volumeRatio,
  attackTime,
  decayTime,
  sustainGain: envelopeSustainGain,
  silenceGain: envelopeSilenceGain,
  minGainValue,
}: CreateSynthVoicePlansOptions): SynthVoicePlan[] {
  const baseFrequency = getBaseFrequency(pitch, cents);
  const harmonics = spectrum.amplitudes.length;
  const { magnitudes, phases }: TransferFunction = createTransferFunction(
    { ...transferFunctionDefinition, baseFrequency },
    harmonics,
  );
  const plans: SynthVoicePlan[] = [];

  for (let n = 1; n <= harmonics; n++) {
    const frequency = baseFrequency * n;
    const spectrumAmplitude = spectrum.amplitudes[n - 1] || 0;
    const transferMagnitude = magnitudes[n - 1] || 0;
    const targetGain = getTargetGain(
      spectrumAmplitude,
      transferMagnitude,
      volume,
      volumeRatio,
    );
    const silenceGain = Math.max(
      envelopeSilenceGain * volumeRatio,
      minGainValue,
    );
    const phaseDeg = phases[n - 1] || 0;
    const startTime = Math.max(0, now + getDelaySeconds(phaseDeg, frequency));
    const attackEnd = startTime + attackTime;
    const decayEnd = attackEnd + decayTime / Math.sqrt(n);
    const attackGain = Math.max(targetGain, silenceGain);
    const decayGain = Math.max(attackGain * envelopeSustainGain, silenceGain);
    const sustainGain = Math.max(decayGain / Math.sqrt(1 + n), silenceGain);

    plans.push({
      harmonic: n,
      frequency,
      startTime,
      attackEnd,
      decayEnd,
      attackGain,
      decayGain,
      sustainGain,
      silenceGain,
    });
  }

  return plans;
}
