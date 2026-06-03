import { createContext } from 'react';

export interface PlayingNotesContextValue {
  playingNotes: Set<number>;
  startPlayingNote: (pitch: number) => void;
  endPlayingNote: (pitch: number) => void;
  stopPlayingNotes: () => void;
}

export const PlayingNotesContext =
  createContext<PlayingNotesContextValue | null>(null);
