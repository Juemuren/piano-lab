import type {
  TransferFunction,
  TransferFunctionDefinition,
  Spectrum,
} from '../../types';
import { createSpectrum, createTransferFunction } from './SynthDefinitions';
import {
  DEFAULT_SPECTRUM_TYPE,
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
  DEFAULT_TRANSFER_FUNCTION_TYPE,
  DEFAULT_TRANSFER_FUNCTION_ATTENUATION,
  DEFAULT_TRANSFER_FUNCTION_BASE_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_DELAY_MS,
  DEFAULT_TRANSFER_FUNCTION_MAX_FREQUENCY_HZ,
  DEFAULT_TRANSFER_FUNCTION_MIN_FREQUENCY_HZ,
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

export type StartNoteResult =
  | { started: true; startedAt: number }
  | { started: false };

export class SynthEngine {
  private audioContext: AudioContext | null = null;
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
  private transferFunctionDefinition: TransferFunctionDefinition = {
    type: DEFAULT_TRANSFER_FUNCTION_TYPE,
    tau: DEFAULT_TRANSFER_FUNCTION_DELAY_MS,
    alpha: DEFAULT_TRANSFER_FUNCTION_ATTENUATION,
    minFrequency: DEFAULT_TRANSFER_FUNCTION_MIN_FREQUENCY_HZ,
    maxFrequency: DEFAULT_TRANSFER_FUNCTION_MAX_FREQUENCY_HZ,
    baseFrequency: DEFAULT_TRANSFER_FUNCTION_BASE_FREQUENCY_HZ,
  };
  private transferFunction: TransferFunction = createTransferFunction(
    this.transferFunctionDefinition,
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
    }
  }

  setSpectrum(spectrum: Spectrum) {
    this.spectrum = spectrum;
  }

  getSpectrum(): Spectrum {
    return this.spectrum;
  }

  setTransferFunction(
    transferFunction: TransferFunction,
    definition?: TransferFunctionDefinition,
  ) {
    this.transferFunction = transferFunction;
    if (definition) {
      this.transferFunctionDefinition = definition;
    }
  }

  getTransferFunction(): TransferFunction {
    return this.transferFunction;
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

  private nextNoteGenerationId(pitch: number) {
    const generationId = (this.noteGenerationIds.get(pitch) || 0) + 1;
    this.noteGenerationIds.set(pitch, generationId);

    return generationId;
  }

  private isCurrentNoteGeneration(pitch: number, generationId: number) {
    return this.noteGenerationIds.get(pitch) === generationId;
  }

  getBaseFrequency(pitch: number, cents: number = 0) {
    return 440 * Math.pow(2, (pitch + cents / 100 - 69) / 12);
  }

  getTargetGain(
    spectrumAmplitude: number,
    transferMagnitude: number,
    volume: number,
  ) {
    return (
      spectrumAmplitude * transferMagnitude * (volume / 127) * this.volumeRatio
    );
  }

  getDelaySeconds(phaseDeg: number, frequency: number) {
    return phaseDeg / (360 * frequency);
  }

  private createNoteVoices(
    pitch: number,
    volume: number,
    cents: number,
  ): ActiveSynthVoice[] {
    if (!this.audioContext) {
      return [];
    }

    const baseFrequency = this.getBaseFrequency(pitch, cents);
    const harmonics = this.spectrum.amplitudes.length;
    const { magnitudes, phases } = createTransferFunction(
      { ...this.transferFunctionDefinition, baseFrequency },
      harmonics,
    );
    const voices: ActiveSynthVoice[] = [];
    const now = this.audioContext.currentTime;

    for (let n = 1; n <= harmonics; n++) {
      const frequency = baseFrequency * n;

      const spectrumAmplitude = this.spectrum.amplitudes[n - 1] || 0;
      const transferMagnitude = magnitudes[n - 1] || 0;
      const targetGain = this.getTargetGain(
        spectrumAmplitude,
        transferMagnitude,
        volume,
      );
      const silenceGain = Math.max(
        this.silenceGain * this.volumeRatio,
        MIN_GAIN_VALUE,
      );

      const phaseDeg = phases[n - 1] || 0;
      const delaySeconds = this.getDelaySeconds(phaseDeg, frequency);
      const startTime = Math.max(0, now + delaySeconds);
      const attackEnd = startTime + this.attackTime;
      const decayEnd = attackEnd + this.decayTime / Math.sqrt(n);

      const attackGain = Math.max(targetGain, silenceGain);
      const decayGain = Math.max(attackGain * this.sustainGain, silenceGain);
      const sustainGain = Math.max(decayGain / Math.sqrt(1 + n), silenceGain);

      const oscillatorNode = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillatorNode.type = this.oscillatorType;
      oscillatorNode.frequency.setValueAtTime(frequency, startTime);

      gainNode.gain.setValueAtTime(silenceGain, startTime);
      gainNode.gain.exponentialRampToValueAtTime(attackGain, attackEnd);
      gainNode.gain.exponentialRampToValueAtTime(decayGain, decayEnd);

      oscillatorNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillatorNode.onended = () => {
        oscillatorNode.disconnect();
        gainNode.disconnect();
      };

      oscillatorNode.start(startTime);
      voices.push({
        oscillatorNode,
        gainNode,
        harmonic: n,
        startTime,
        decayEnd,
        sustainGain,
        silenceGain,
      });
    }

    return voices;
  }

  async playNote(
    pitch: number,
    duration: number,
    volume: number = 100,
    cents: number = 0,
  ): Promise<StartNoteResult> {
    await this.ensureAudioContextRunning();
    if (!this.audioContext) return { started: false };

    const voices = this.createNoteVoices(pitch, volume, cents);

    for (const voice of voices) {
      const sustainEnd = voice.decayEnd + duration;
      const stopTime =
        sustainEnd + this.releaseTime / Math.sqrt(voice.harmonic);

      voice.gainNode.gain.exponentialRampToValueAtTime(
        voice.sustainGain,
        sustainEnd,
      );
      voice.gainNode.gain.exponentialRampToValueAtTime(
        voice.silenceGain,
        stopTime,
      );
      voice.oscillatorNode.stop(stopTime);
    }

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

    const voices = this.createNoteVoices(pitch, volume, cents);

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

    for (const voice of voices) {
      const releaseStart = Math.max(now, voice.startTime);
      const stopTime =
        releaseStart + this.releaseTime / Math.sqrt(voice.harmonic);
      const currentGain = Math.max(
        voice.gainNode.gain.value,
        voice.silenceGain,
      );

      voice.gainNode.gain.cancelScheduledValues(releaseStart);
      voice.gainNode.gain.setValueAtTime(currentGain, releaseStart);
      voice.gainNode.gain.exponentialRampToValueAtTime(
        voice.silenceGain,
        stopTime,
      );
      voice.oscillatorNode.stop(stopTime);
    }
  }
}
