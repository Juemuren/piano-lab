import { createContext } from 'react';

export interface PianoInputSettings {
  defaultNoteLength: string;
  tempo: number;
}

export const DEFAULT_PIANO_INPUT_SETTINGS: PianoInputSettings = {
  defaultNoteLength: '1/8',
  tempo: 180,
};

export interface AppSettingsContextValue {
  isPianoInputEnabled: boolean;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  pianoInputSettings: PianoInputSettings;
  setPianoInputSettings: (settings: PianoInputSettings) => void;
  isKeyboardControlEnabled: boolean;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  isMouseControlEnabled: boolean;
  setIsMouseControlEnabled: (enabled: boolean) => void;
  isTouchControlEnabled: boolean;
  setIsTouchControlEnabled: (enabled: boolean) => void;
  isMidiControlEnabled: boolean;
  setIsMidiControlEnabled: (enabled: boolean) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextValue | null>(
  null,
);
