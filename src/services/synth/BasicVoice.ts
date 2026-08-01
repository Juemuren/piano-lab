import { SYNTH_CONFIG_DEFAULTS } from './config/Defaults';
import type { SynthOscillatorType } from './config/Options';
import type { EnvelopeConfig, VoiceEnvelopeState } from './Envelope';
import { createVoiceStartPlans, createVoiceStopPlans } from './Envelope';
import type { FrequencyModulationConfig } from './effect/Modulation';
import type { Spectrum } from './Spectrum';
import { createSpectrum } from './Spectrum';

const MIN_GAIN_VALUE = 1e-10;

export interface SynthBasicConfig {
  harmonicCount: number;
  oscillatorType: SynthOscillatorType;
  volumeRatio: number;
}

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
  private harmonicCount: number = SYNTH_CONFIG_DEFAULTS.synth.harmonicCount;
  private spectrum: Spectrum = createSpectrum(
    {
      ...SYNTH_CONFIG_DEFAULTS.spectrum,
    },
    this.harmonicCount,
  );
  private oscillatorType: SynthOscillatorType =
    SYNTH_CONFIG_DEFAULTS.synth.oscillatorType;
  private volumeRatio: number = SYNTH_CONFIG_DEFAULTS.synth.volumeRatio;
  private attackTime: number = SYNTH_CONFIG_DEFAULTS.envelope.attackTime;
  private decayTime: number = SYNTH_CONFIG_DEFAULTS.envelope.decayTime;
  private releaseTime: number = SYNTH_CONFIG_DEFAULTS.envelope.releaseTime;
  private sustainGain: number = SYNTH_CONFIG_DEFAULTS.envelope.sustainGain;
  private silenceGain: number = SYNTH_CONFIG_DEFAULTS.envelope.silenceGain;
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
