import type { EnvelopeConfig, Spectrum, SynthBasicConfig } from '../../types';
import {
  DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
  DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
  DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
  DEFAULT_ENVELOPE_SILENCE_GAIN,
  DEFAULT_ENVELOPE_SUSTAIN_GAIN,
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
  DEFAULT_SPECTRUM_TYPE,
  DEFAULT_SYNTH_HARMONIC_COUNT,
  DEFAULT_SYNTH_OSCILLATOR_TYPE,
  DEFAULT_SYNTH_VOLUME_RATIO,
} from '../../constants/synth';
import {
  createVoiceStopPlans,
  createVoiceStartPlans,
} from './SynthCalculations';
import { createSpectrum } from './SynthDefinitions';

const MIN_GAIN_VALUE = 1e-10;

export interface ActiveVoice {
  oscillatorNode: OscillatorNode;
  gainNode: GainNode;
  harmonic: number;
  startTime: number;
  decayEnd: number;
  sustainGain: number;
  silenceGain: number;
}

export interface ReleasingVoice {
  oscillatorNode: OscillatorNode;
  gainNode: GainNode;
  harmonic: number;
  releaseStart: number;
  silenceGain: number;
}

interface StartNoteOptions {
  audioContext: AudioContext;
  outputNode: AudioNode;
  pitch: number;
  volume: number;
  cents: number;
}

export class BaseVoice {
  private harmonicCount: number = DEFAULT_SYNTH_HARMONIC_COUNT;
  private spectrum: Spectrum = createSpectrum(
    {
      type: DEFAULT_SPECTRUM_TYPE,
      lambda: DEFAULT_SPECTRUM_STRIKE_POINT,
      sigma: DEFAULT_SPECTRUM_DECAY_RATE,
      p: DEFAULT_SPECTRUM_POWER_EXPONENT,
    },
    this.harmonicCount,
  );
  private oscillatorType: OscillatorType = DEFAULT_SYNTH_OSCILLATOR_TYPE;
  private volumeRatio: number = DEFAULT_SYNTH_VOLUME_RATIO;
  private attackTime: number = DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS;
  private decayTime: number = DEFAULT_ENVELOPE_DECAY_TIME_SECONDS;
  private releaseTime: number = DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS;
  private sustainGain: number = DEFAULT_ENVELOPE_SUSTAIN_GAIN;
  private silenceGain: number = DEFAULT_ENVELOPE_SILENCE_GAIN;

  configureSynth({
    oscillatorType,
    volumeRatio,
    harmonicCount,
  }: SynthBasicConfig) {
    this.oscillatorType = oscillatorType;
    this.volumeRatio = volumeRatio;
    this.harmonicCount = harmonicCount;
  }

  configureEnvelope({
    attackTime,
    decayTime,
    releaseTime,
    sustainGain,
    silenceGain,
  }: EnvelopeConfig) {
    this.attackTime = attackTime;
    this.decayTime = decayTime;
    this.releaseTime = releaseTime;
    this.sustainGain = sustainGain;
    this.silenceGain = silenceGain;
  }

  configureSpectrum(spectrum: Spectrum) {
    this.spectrum = spectrum;
  }

  startVoices({
    audioContext,
    outputNode,
    pitch,
    volume,
    cents,
  }: StartNoteOptions): ActiveVoice[] {
    const plans = createVoiceStartPlans({
      pitch,
      volume,
      cents,
      now: audioContext.currentTime,
      harmonics: this.harmonicCount,
      spectrum: this.spectrum,
      volumeRatio: this.volumeRatio,
      attackTime: this.attackTime,
      decayTime: this.decayTime,
      sustainGain: this.sustainGain,
      silenceGain: this.silenceGain,
      minGainValue: MIN_GAIN_VALUE,
    });
    const voices: ActiveVoice[] = [];

    for (const plan of plans) {
      const oscillatorNode = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillatorNode.type = this.oscillatorType;
      oscillatorNode.frequency.setValueAtTime(plan.frequency, plan.startTime);

      gainNode.gain.setValueAtTime(plan.silenceGain, plan.startTime);
      gainNode.gain.exponentialRampToValueAtTime(
        plan.attackGain,
        plan.attackEnd,
      );
      gainNode.gain.exponentialRampToValueAtTime(plan.decayGain, plan.decayEnd);

      oscillatorNode.connect(gainNode);
      gainNode.connect(outputNode);

      oscillatorNode.onended = () => {
        oscillatorNode.disconnect();
        gainNode.disconnect();
      };

      oscillatorNode.start(plan.startTime);
      voices.push({
        oscillatorNode,
        gainNode,
        harmonic: plan.harmonic,
        startTime: plan.startTime,
        decayEnd: plan.decayEnd,
        sustainGain: plan.sustainGain,
        silenceGain: plan.silenceGain,
      });
    }

    return voices;
  }

  stopVoices(voices: ReleasingVoice[]) {
    const plans = createVoiceStopPlans({
      voices,
      releaseTime: this.releaseTime,
    });

    voices.forEach((voice, index) => {
      const plan = plans[index];

      voice.gainNode.gain.exponentialRampToValueAtTime(
        voice.silenceGain,
        plan.stopTime,
      );
      voice.oscillatorNode.stop(plan.stopTime);
    });
  }
}
