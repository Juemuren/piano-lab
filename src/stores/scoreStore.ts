import { create } from 'zustand';
import {
  getPianoInputSettingsFromAbcHeader,
  hasPianoInputSettingsHeader,
  updateAbcHeader,
} from '../services/abc/AbcHeader';
import { useAppSettingsStore } from './appSettingsStore';

type AbcContentUpdate = string | ((current: string) => string);

interface ScoreState {
  abcContent: string;
  setAbcContent: (update: AbcContentUpdate) => void;
}

export const useScoreStore = create<ScoreState>()((set) => ({
  abcContent: '',
  setAbcContent: (update) =>
    set(({ abcContent }) => {
      const nextContent =
        typeof update === 'function' ? update(abcContent) : update;
      const { isPianoInputEnabled, pianoInputSettings, setPianoInputSettings } =
        useAppSettingsStore.getState();

      if (!isPianoInputEnabled) {
        return { abcContent: nextContent };
      }

      if (hasPianoInputSettingsHeader(nextContent)) {
        setPianoInputSettings(getPianoInputSettingsFromAbcHeader(nextContent));
        return { abcContent: nextContent };
      }

      return {
        abcContent: updateAbcHeader(nextContent, pianoInputSettings),
      };
    }),
}));
