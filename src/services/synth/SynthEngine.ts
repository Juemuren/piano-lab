import type {
  Effect,
  EffectDefinition,
  Spectrum,
  StartNoteResult,
} from '../../types';
import { createEffect, createSpectrum } from './SynthDefinitions';
import {
  createVoiceStartPlans,
  createVoiceStopPlans,
} from './SynthCalculations';
import {
  DEFAULT_SPECTRUM_TYPE,
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
  DEFAULT_EFFECT_TYPE,
  DEFAULT_EFFECT_ATTENUATION,
  DEFAULT_EFFECT_BASE_FREQUENCY_HZ,
  DEFAULT_EFFECT_DELAY_MS,
  DEFAULT_EFFECT_MAX_FREQUENCY_HZ,
  DEFAULT_EFFECT_MIN_FREQUENCY_HZ,
  DEFAULT_SYNTH_OSCILLATOR_TYPE,
  DEFAULT_SYNTH_HARMONIC_COUNT,
  DEFAULT_SYNTH_VOLUME_RATIO,
  DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
  DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
  DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
  DEFAULT_ENVELOPE_SUSTAIN_GAIN,
  DEFAULT_ENVELOPE_SILENCE_GAIN,
} from '../../constants';

const MIN_GAIN_VALUE = 1e-10;

interface ActiveSynthVoice {
  oscillatorNode: OscillatorNode;
  gainNode: GainNode;
  harmonic: number;
  startTime: number;
  decayEnd: number;
  sustainGain: number;
  silenceGain: number;
}

interface ReleasingSynthVoice {
  oscillatorNode: OscillatorNode;
  gainNode: GainNode;
  harmonic: number;
  releaseStart: number;
  silenceGain: number;
}

interface SynthRecordingTarget {
  stream: MediaStream;
  disconnect: () => void;
}

export class SynthEngine {
  private audioContext: AudioContext | null = null;
  private outputGainNode: GainNode | null = null;
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
  private effectDefinition: EffectDefinition = {
    type: DEFAULT_EFFECT_TYPE,
    tau: DEFAULT_EFFECT_DELAY_MS,
    alpha: DEFAULT_EFFECT_ATTENUATION,
    minFrequency: DEFAULT_EFFECT_MIN_FREQUENCY_HZ,
    maxFrequency: DEFAULT_EFFECT_MAX_FREQUENCY_HZ,
    baseFrequency: DEFAULT_EFFECT_BASE_FREQUENCY_HZ,
  };
  private effect: Effect = createEffect(
    this.effectDefinition,
    this.harmonicCount,
  );

  private oscillatorType: OscillatorType = DEFAULT_SYNTH_OSCILLATOR_TYPE;
  private volumeRatio: number = DEFAULT_SYNTH_VOLUME_RATIO;
  private attackTime: number = DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS;
  private decayTime: number = DEFAULT_ENVELOPE_DECAY_TIME_SECONDS;
  private releaseTime: number = DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS;
  private sustainGain: number = DEFAULT_ENVELOPE_SUSTAIN_GAIN;
  private silenceGain: number = DEFAULT_ENVELOPE_SILENCE_GAIN;
  private activeNotes: Map<number, ActiveSynthVoice[]> = new Map();
  private noteGenerationIds: Map<number, number> = new Map();

  init() {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new AudioContext({ latencyHint: 'playback' });
      this.outputGainNode = this.audioContext.createGain();
      this.outputGainNode.connect(this.audioContext.destination);
    }
  }

  setSpectrum(spectrum: Spectrum) {
    this.spectrum = spectrum;
  }

  getSpectrum(): Spectrum {
    return this.spectrum;
  }

  setEffect(effect: Effect, definition?: EffectDefinition) {
    this.effect = effect;
    if (definition) {
      this.effectDefinition = definition;
    }
  }

  getEffect(): Effect {
    return this.effect;
  }

  getHarmonicCount(): number {
    return this.harmonicCount;
  }

  setHarmonicCount(value: number) {
    this.harmonicCount = value;
  }

  getOscillatorType(): OscillatorType {
    return this.oscillatorType;
  }

  setOscillatorType(type: OscillatorType) {
    this.oscillatorType = type;
  }

  getVolumeRatio(): number {
    return this.volumeRatio;
  }

  setVolumeRatio(value: number) {
    this.volumeRatio = value;
  }

  getAttackTime(): number {
    return this.attackTime;
  }

  setAttackTime(value: number) {
    this.attackTime = value;
  }

  getDecayTime(): number {
    return this.decayTime;
  }

  setDecayTime(value: number) {
    this.decayTime = value;
  }

  getReleaseTime(): number {
    return this.releaseTime;
  }

  setReleaseTime(value: number) {
    this.releaseTime = value;
  }

  getSustainGain(): number {
    return this.sustainGain;
  }

  setSustainGain(value: number) {
    this.sustainGain = value;
  }

  getSilenceGain(): number {
    return this.silenceGain;
  }

  setSilenceGain(value: number) {
    this.silenceGain = value;
  }

  private async ensureAudioContextRunning(): Promise<void> {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.init();
    }
    if (!this.audioContext) {
      return;
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    if (this.audioContext.state === 'closed') {
      this.init();
    }
  }

  async createRecordingTarget(): Promise<SynthRecordingTarget | null> {
    await this.ensureAudioContextRunning();
    if (!this.audioContext || !this.outputGainNode) {
      return null;
    }

    const destinationNode = this.audioContext.createMediaStreamDestination();

    this.outputGainNode.connect(destinationNode);

    return {
      stream: destinationNode.stream,
      disconnect: () => {
        this.outputGainNode?.disconnect(destinationNode);
      },
    };
  }

  private nextNoteGenerationId(pitch: number) {
    const generationId = (this.noteGenerationIds.get(pitch) || 0) + 1;
    this.noteGenerationIds.set(pitch, generationId);

    return generationId;
  }

  private isCurrentNoteGeneration(pitch: number, generationId: number) {
    return this.noteGenerationIds.get(pitch) === generationId;
  }

  private startNoteVoices(
    pitch: number,
    volume: number,
    cents: number,
  ): ActiveSynthVoice[] {
    if (!this.audioContext) {
      return [];
    }

    const plans = createVoiceStartPlans({
      pitch,
      volume,
      cents,
      now: this.audioContext.currentTime,
      harmonics: this.harmonicCount,
      spectrum: this.spectrum,
      effectDefinition: this.effectDefinition,
      volumeRatio: this.volumeRatio,
      attackTime: this.attackTime,
      decayTime: this.decayTime,
      sustainGain: this.sustainGain,
      silenceGain: this.silenceGain,
      minGainValue: MIN_GAIN_VALUE,
    });
    const voices: ActiveSynthVoice[] = [];

    for (const plan of plans) {
      const oscillatorNode = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillatorNode.type = this.oscillatorType;
      oscillatorNode.frequency.setValueAtTime(plan.frequency, plan.startTime);

      gainNode.gain.setValueAtTime(plan.silenceGain, plan.startTime);
      gainNode.gain.exponentialRampToValueAtTime(
        plan.attackGain,
        plan.attackEnd,
      );
      gainNode.gain.exponentialRampToValueAtTime(plan.decayGain, plan.decayEnd);

      oscillatorNode.connect(gainNode);
      if (!this.outputGainNode) {
        continue;
      }

      gainNode.connect(this.outputGainNode);

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

  private stopNoteVoices(voices: ReleasingSynthVoice[]) {
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

  async playNote(
    pitch: number,
    duration: number,
    volume: number = 100,
    cents: number = 0,
  ): Promise<StartNoteResult> {
    await this.ensureAudioContextRunning();
    if (!this.audioContext) return { started: false };

    const voices = this.startNoteVoices(pitch, volume, cents);

    this.stopNoteVoices(
      voices.map((voice) => {
        const sustainEnd = voice.decayEnd + duration;

        voice.gainNode.gain.exponentialRampToValueAtTime(
          voice.sustainGain,
          sustainEnd,
        );
        return {
          ...voice,
          releaseStart: sustainEnd,
        };
      }),
    );

    return voices.length > 0
      ? { started: true, startedAt: performance.now() }
      : { started: false };
  }

  async startNote(
    pitch: number,
    volume: number = 100,
    cents: number = 0,
  ): Promise<StartNoteResult> {
    this.stopNote(pitch);
    const generationId = this.nextNoteGenerationId(pitch);

    await this.ensureAudioContextRunning();
    if (!this.audioContext) return { started: false };
    if (!this.isCurrentNoteGeneration(pitch, generationId)) {
      return { started: false };
    }

    const voices = this.startNoteVoices(pitch, volume, cents);

    if (!this.isCurrentNoteGeneration(pitch, generationId)) {
      for (const voice of voices) {
        voice.oscillatorNode.stop(
          Math.max(this.audioContext.currentTime, voice.startTime),
        );
      }
      return { started: false };
    }

    this.activeNotes.set(pitch, voices);
    return voices.length > 0
      ? { started: true, startedAt: performance.now() }
      : { started: false };
  }

  stopNote(pitch: number) {
    this.nextNoteGenerationId(pitch);
    if (!this.audioContext) return;

    const voices = this.activeNotes.get(pitch);
    if (!voices) return;

    this.activeNotes.delete(pitch);

    const now = this.audioContext.currentTime;
    this.stopNoteVoices(
      voices.map((voice) => {
        const releaseStart = Math.max(now, voice.startTime);
        const currentGain = Math.max(
          voice.gainNode.gain.value,
          voice.silenceGain,
        );
        voice.gainNode.gain.cancelScheduledValues(now);
        voice.gainNode.gain.setValueAtTime(currentGain, releaseStart);

        return {
          ...voice,
          releaseStart,
        };
      }),
    );
  }
}
