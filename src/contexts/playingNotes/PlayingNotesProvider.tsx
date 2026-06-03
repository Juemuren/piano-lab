import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { PlayingNotesContext } from './PlayingNotesContext';

interface PlayingNotesProviderProps {
  children: ReactNode;
}

export function PlayingNotesProvider({ children }: PlayingNotesProviderProps) {
  const [playingNotes, setPlayingNotes] = useState<Set<number>>(new Set());

  const startPlayingNote = useCallback((pitch: number) => {
    setPlayingNotes((prev) => {
      const next = new Set(prev);
      next.add(pitch);
      return next;
    });
  }, []);

  const endPlayingNote = useCallback((pitch: number) => {
    setPlayingNotes((prev) => {
      const next = new Set(prev);
      next.delete(pitch);
      return next;
    });
  }, []);

  const stopPlayingNotes = useCallback(() => {
    setPlayingNotes(new Set());
  }, []);

  const value = useMemo(
    () => ({
      playingNotes,
      startPlayingNote,
      endPlayingNote,
      stopPlayingNotes,
    }),
    [endPlayingNote, playingNotes, startPlayingNote, stopPlayingNotes],
  );

  return (
    <PlayingNotesContext.Provider value={value}>
      {children}
    </PlayingNotesContext.Provider>
  );
}
