import { create } from 'zustand';

type AbcContentUpdate = string | ((current: string) => string);

interface ScoreState {
  abcContent: string;
  setAbcContent: (update: AbcContentUpdate) => void;
}

export const useScoreStore = create<ScoreState>()((set) => ({
  abcContent: '',
  setAbcContent: (update) =>
    set(({ abcContent }) => ({
      abcContent: typeof update === 'function' ? update(abcContent) : update,
    })),
}));
