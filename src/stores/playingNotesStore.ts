import { create } from 'zustand';

interface PlayingNotesState {
  endPlayingNote: (pitch: number) => void;
  playingNotes: Set<number>;
  startPlayingNote: (pitch: number) => void;
  stopPlayingNotes: () => void;
}

export const usePlayingNotesStore = create<PlayingNotesState>()((set) => ({
  endPlayingNote: (pitch) =>
    set(({ playingNotes }) => {
      const next = new Set(playingNotes);
      next.delete(pitch);
      return { playingNotes: next };
    }),
  playingNotes: new Set(),
  startPlayingNote: (pitch) =>
    set(({ playingNotes }) => ({
      playingNotes: new Set(playingNotes).add(pitch),
    })),
  stopPlayingNotes: () => set({ playingNotes: new Set() }),
}));
