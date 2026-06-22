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
import type {
  EnvelopeConfig,
  FrequencyModulationConfig,
  Spectrum,
  SynthBasicConfig,
} from '../../types';
import { createSpectrum } from './Spectrum';
import type { VoiceEnvelopeState } from './VoicePlanner';
import { createVoiceStartPlans, createVoiceStopPlans } from './VoicePlanner';

const MIN_GAIN_VALUE = 1e-10;

export interface ActiveVoice extends VoiceEnvelopeState {
  frequencyModulationDepthGainNode?: GainNode;
  frequencyModulationOscillatorNode?: OscillatorNode;
  gainNode: GainNode;
  harmonic: number;
  oscillatorNode: OscillatorNode;
  sustainGain: number;
}

export interface ReleasingVoice {
  frequencyModulationDepthGainNode?: GainNode;
  frequencyModulationOscillatorNode?: OscillatorNode;
  gainNode: GainNode;
  harmonic: number;
  oscillatorNode: OscillatorNode;
  releaseStart: number;
  silenceGain: number;
}

interface StartNoteOptions {
  audioContext: AudioContext;
  cents: number;
  outputNode: AudioNode;
  pitch: number;
  volume: number;
}

export class BasicVoice {
  private harmonicCount: number = DEFAULT_SYNTH_HARMONIC_COUNT;
  private spectrum: Spectrum = createSpectrum(
    {
      lambda: DEFAULT_SPECTRUM_STRIKE_POINT,
      p: DEFAULT_SPECTRUM_POWER_EXPONENT,
      sigma: DEFAULT_SPECTRUM_DECAY_RATE,
      type: DEFAULT_SPECTRUM_TYPE,
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
  private frequencyModulation: FrequencyModulationConfig | null = null;

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

  configureFrequencyModulation(
    frequencyModulation: FrequencyModulationConfig | null,
  ) {
    this.frequencyModulation = frequencyModulation;
  }

  private createFrequencyModulationNodes(
    audioContext: AudioContext,
    frequency: number,
    startTime: number,
  ) {
    if (!this.frequencyModulation) return null;

    const frequencyModulationOscillatorNode = audioContext.createOscillator();
    const frequencyModulationDepthGainNode = audioContext.createGain();
    const depth = Math.max(this.frequencyModulation.depth, 0);
    const depthHz = frequency * (2 ** (depth / 1200) - 1);

    frequencyModulationOscillatorNode.type = 'sine';
    frequencyModulationOscillatorNode.frequency.setValueAtTime(
      Math.max(this.frequencyModulation.frequency, 0.01),
      startTime,
    );
    frequencyModulationDepthGainNode.gain.setValueAtTime(depthHz, startTime);
    frequencyModulationOscillatorNode.connect(frequencyModulationDepthGainNode);
    frequencyModulationOscillatorNode.start(startTime);

    return {
      frequencyModulationDepthGainNode,
      frequencyModulationOscillatorNode,
    };
  }

  startVoices({
    audioContext,
    outputNode,
    pitch,
    volume,
    cents,
  }: StartNoteOptions): ActiveVoice[] {
    const plans = createVoiceStartPlans({
      attackTime: this.attackTime,
      cents,
      decayTime: this.decayTime,
      harmonics: this.harmonicCount,
      minGainValue: MIN_GAIN_VALUE,
      now: audioContext.currentTime,
      pitch,
      silenceGain: this.silenceGain,
      spectrum: this.spectrum,
      sustainGain: this.sustainGain,
      volume,
      volumeRatio: this.volumeRatio,
    });
    const voices: ActiveVoice[] = [];

    for (const plan of plans) {
      const oscillatorNode = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const frequencyModulationNodes = this.createFrequencyModulationNodes(
        audioContext,
        plan.frequency,
        plan.startTime,
      );

      oscillatorNode.type = this.oscillatorType;
      oscillatorNode.frequency.setValueAtTime(plan.frequency, plan.startTime);
      frequencyModulationNodes?.frequencyModulationDepthGainNode.connect(
        oscillatorNode.frequency,
      );

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
        frequencyModulationNodes?.frequencyModulationOscillatorNode.disconnect();
        frequencyModulationNodes?.frequencyModulationDepthGainNode.disconnect();
      };

      oscillatorNode.start(plan.startTime);
      voices.push({
        attackEnd: plan.attackEnd,
        attackGain: plan.attackGain,
        decayEnd: plan.decayEnd,
        decayGain: plan.decayGain,
        frequencyModulationDepthGainNode:
          frequencyModulationNodes?.frequencyModulationDepthGainNode,
        frequencyModulationOscillatorNode:
          frequencyModulationNodes?.frequencyModulationOscillatorNode,
        gainNode,
        harmonic: plan.harmonic,
        oscillatorNode,
        silenceGain: plan.silenceGain,
        startTime: plan.startTime,
        sustainGain: plan.sustainGain,
      });
    }

    return voices;
  }

  stopVoices(voices: ReleasingVoice[]) {
    const plans = createVoiceStopPlans({
      releaseTime: this.releaseTime,
      voices,
    });

    voices.forEach((voice, index) => {
      const plan = plans[index];

      voice.gainNode.gain.exponentialRampToValueAtTime(
        voice.silenceGain,
        plan.stopTime,
      );
      voice.oscillatorNode.stop(plan.stopTime);
      voice.frequencyModulationOscillatorNode?.stop(plan.stopTime);
    });
  }
}
