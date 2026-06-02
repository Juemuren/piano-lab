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
    Promise.all(
      midiPitches.map(async ({ pitch, duration, volume, cents }) => {
        const correctDuration = duration * millisecondsPerDuration;
        const playResult = await this.synthEngine.playNote(
          pitch,
          correctDuration / 1000,
          volume,
          cents,
        );
        if (!playResult.started) {
          return;
        }

        this.onNoteStart?.(pitch);
        setTimeout(() => {
          this.onNoteEnd?.(pitch);
        }, correctDuration - HIGHLIGHT_INTERVAL_MS);
      }),
    ).catch(() => undefined);
  }
}
