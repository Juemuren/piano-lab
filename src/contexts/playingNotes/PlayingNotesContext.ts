import { createContext } from 'react';

export interface PlayingNotesContextValue {
  endPlayingNote: (pitch: number) => void;
  playingNotes: Set<number>;
  startPlayingNote: (pitch: number) => void;
  stopPlayingNotes: () => void;
}

export const PlayingNotesContext =
  createContext<PlayingNotesContextValue | null>(null);
