import { SynthEngine } from '../synth/SynthEngine';
import { type MidiPitches } from 'abcjs';

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

  play(midiPitches: MidiPitches, secondsPerDuration: number) {
    midiPitches.forEach(({ pitch, duration, volume, cents }) => {
      const correctDuration = duration * secondsPerDuration;

      this.onNoteStart?.(pitch);
      this.synthEngine.playNote(pitch, correctDuration, volume, cents);
      setTimeout(() => {
        this.onNoteEnd?.(pitch);
      }, correctDuration * 1000);
    });
  }
}
