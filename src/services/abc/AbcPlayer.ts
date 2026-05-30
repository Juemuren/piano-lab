import { SynthEngine } from '../synth/SynthEngine';
import { type MidiPitches } from 'abcjs';

const HIGHLIGHT_INTERVAL_MS = 50;

export class AbcPlayer {
  private synthEngine: SynthEngine;
  private onNoteStart?: (pitch: number) => void;
  private onNoteEnd?: (pitch: number) => void;

  constructor(
    synthEngine: SynthEngine,
    onNoteStart?: (pitch: number) => void,
    onNoteEnd?: (pitch: number) => void,
  ) {
    this.synthEngine = synthEngine;
    this.onNoteStart = onNoteStart;
    this.onNoteEnd = onNoteEnd;
  }

  play(midiPitches: MidiPitches, millisecondsPerDuration: number) {
    midiPitches.forEach(({ pitch, duration, volume, cents }) => {
      const correctDuration = duration * millisecondsPerDuration;

      this.onNoteStart?.(pitch);
      this.synthEngine.playNote(pitch, correctDuration / 1000, volume, cents);
      setTimeout(() => {
        this.onNoteEnd?.(pitch);
      }, correctDuration - HIGHLIGHT_INTERVAL_MS);
    });
  }
}
