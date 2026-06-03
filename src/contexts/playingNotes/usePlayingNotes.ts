import { useContext } from 'react';
import { PlayingNotesContext } from './PlayingNotesContext';

export function usePlayingNotes() {
  const playingNotes = useContext(PlayingNotesContext);

  if (!playingNotes) {
    throw new Error('usePlayingNotes must be used within PlayingNotesProvider');
  }

  return playingNotes;
}
