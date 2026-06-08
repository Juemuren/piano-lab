import type { Spectrum } from '../../types';

export interface VoiceStartPlan {
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

export interface VoiceEnvelopeState {
  startTime: number;
  attackEnd: number;
  decayEnd: number;
  attackGain: number;
  decayGain: number;
  silenceGain: number;
}

export interface VoiceStopPlan {
  stopTime: number;
}

interface CreateVoiceStartPlansOptions {
  pitch: number;
  volume: number;
  cents: number;
  now: number;
  harmonics: number;
  spectrum: Spectrum;
  volumeRatio: number;
  attackTime: number;
  decayTime: number;
  sustainGain: number;
  silenceGain: number;
  minGainValue: number;
}

interface CreateVoiceStopPlansOptions {
  voices: {
    harmonic: number;
    releaseStart: number;
  }[];
  releaseTime: number;
}

export function getBaseFrequency(pitch: number, cents: number = 0) {
  return 440 * Math.pow(2, (pitch + cents / 100 - 69) / 12);
}

export function getTargetGain(
  spectrumAmplitude: number,
  volume: number,
  volumeRatio: number,
) {
  return spectrumAmplitude * (volume / 127) * volumeRatio;
}

export function getDelaySeconds(phaseDeg: number, frequency: number) {
  return phaseDeg / (360 * frequency);
}

export function createVoiceStartPlans({
  pitch,
  volume,
  cents,
  now,
  harmonics,
  spectrum,
  volumeRatio,
  attackTime,
  decayTime,
  sustainGain: envelopeSustainGain,
  silenceGain: envelopeSilenceGain,
  minGainValue,
}: CreateVoiceStartPlansOptions): VoiceStartPlan[] {
  const baseFrequency = getBaseFrequency(pitch, cents);
  const plans: VoiceStartPlan[] = [];

  for (let n = 1; n <= harmonics; n++) {
    const frequency = baseFrequency * n;
    const spectrumAmplitude = spectrum.amplitudes[n - 1] || 0;
    const targetGain = getTargetGain(spectrumAmplitude, volume, volumeRatio);
    const silenceGain = Math.max(
      envelopeSilenceGain * volumeRatio,
      minGainValue,
    );
    const startTime = Math.max(0, now);
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

export function createVoiceStopPlans({
  voices,
  releaseTime,
}: CreateVoiceStopPlansOptions): VoiceStopPlan[] {
  return voices.map((voice) => {
    const stopTime =
      voice.releaseStart + releaseTime / Math.sqrt(voice.harmonic);

    return {
      stopTime,
    };
  });
}

function getExponentialRampValue(
  startValue: number,
  endValue: number,
  startTime: number,
  endTime: number,
  time: number,
) {
  if (endTime <= startTime) return endValue;

  const progress = Math.min(
    Math.max((time - startTime) / (endTime - startTime), 0),
    1,
  );
  return startValue * Math.pow(endValue / startValue, progress);
}

export function getVoiceGainAtTime(voice: VoiceEnvelopeState, time: number) {
  if (time <= voice.startTime) {
    return voice.silenceGain;
  }

  if (time < voice.attackEnd) {
    return getExponentialRampValue(
      voice.silenceGain,
      voice.attackGain,
      voice.startTime,
      voice.attackEnd,
      time,
    );
  }

  if (time < voice.decayEnd) {
    return getExponentialRampValue(
      voice.attackGain,
      voice.decayGain,
      voice.attackEnd,
      voice.decayEnd,
      time,
    );
  }

  return voice.decayGain;
}
