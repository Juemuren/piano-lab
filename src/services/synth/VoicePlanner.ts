import type { Spectrum } from '../../types/synth';

export interface VoiceStartPlan {
  attackEnd: number;
  attackGain: number;
  decayEnd: number;
  decayGain: number;
  frequency: number;
  harmonic: number;
  silenceGain: number;
  startTime: number;
  sustainGain: number;
}

export interface VoiceEnvelopeState {
  attackEnd: number;
  attackGain: number;
  decayEnd: number;
  decayGain: number;
  silenceGain: number;
  startTime: number;
}

export interface VoiceStopPlan {
  stopTime: number;
}

interface CreateVoiceStartPlansOptions {
  attackTime: number;
  cents: number;
  decayTime: number;
  harmonics: number;
  minGainValue: number;
  now: number;
  pitch: number;
  silenceGain: number;
  spectrum: Spectrum;
  sustainGain: number;
  volume: number;
  volumeRatio: number;
}

interface CreateVoiceStopPlansOptions {
  releaseTime: number;
  voices: {
    harmonic: number;
    releaseStart: number;
  }[];
}

export function getBaseFrequency(pitch: number, cents: number = 0) {
  return 440 * 2 ** ((pitch + cents / 100 - 69) / 12);
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
      attackEnd,
      attackGain,
      decayEnd,
      decayGain,
      frequency,
      harmonic: n,
      silenceGain,
      startTime,
      sustainGain,
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
  return startValue * (endValue / startValue) ** progress;
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
