import { SynthEngine } from '../synth/SynthEngine';
import { type MidiPitches } from 'abcjs';
import {
  getHighlightDurationMs,
  getPlaybackDurationSeconds,
} from './AbcPlaybackCalculations';

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
        const playResult = await this.synthEngine.playNote(
          pitch,
          getPlaybackDurationSeconds(duration, millisecondsPerDuration),
          volume,
          cents,
        );
        if (!playResult.started) {
          return;
        }

        this.onNoteStart?.(pitch);
        setTimeout(
          () => {
            this.onNoteEnd?.(pitch);
          },
          getHighlightDurationMs(
            duration,
            millisecondsPerDuration,
            HIGHLIGHT_INTERVAL_MS,
          ),
        );
      }),
    ).catch(() => undefined);
  }
}
