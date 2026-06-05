import type {
  EffectConfig,
  EnvelopeConfig,
  Spectrum,
  SynthBasicConfig,
  StartNoteResult,
} from '../../types';
import { BaseVoice, type ActiveVoice, type ReleasingVoice } from './BaseVoice';
import { EffectChain } from './EffectChain';

interface SynthRecordingTarget {
  stream: MediaStream;
  disconnect: () => void;
}

export class SynthEngine {
  private audioContext: AudioContext | null = null;
  private outputGainNode: GainNode | null = null;
  private baseVoice = new BaseVoice();
  private effectChain = new EffectChain();
  private activeNotes: Map<number, ActiveVoice[]> = new Map();
  private noteGenerationIds: Map<number, number> = new Map();

  init() {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new AudioContext({ latencyHint: 'playback' });
      this.outputGainNode = this.audioContext.createGain();
      this.outputGainNode.connect(this.audioContext.destination);
    }
  }

  configureSynth(config: SynthBasicConfig) {
    this.baseVoice.configureSynth(config);
  }

  configureEnvelope(config: EnvelopeConfig) {
    this.baseVoice.configureEnvelope(config);
  }

  configureSpectrum(spectrum: Spectrum) {
    this.baseVoice.configureSpectrum(spectrum);
  }

  configureEffect(config: EffectConfig) {
    this.effectChain.configure(config);
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
  ): ActiveVoice[] {
    if (!this.audioContext) {
      return [];
    }

    if (!this.outputGainNode) {
      return [];
    }
    const effectInputNode = this.effectChain.connect(
      this.audioContext,
      this.outputGainNode,
    );

    return this.baseVoice.startVoices({
      audioContext: this.audioContext,
      outputNode: effectInputNode,
      pitch,
      volume,
      cents,
    });
  }

  private stopNoteVoices(voices: ReleasingVoice[]) {
    this.baseVoice.stopVoices(voices);
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
