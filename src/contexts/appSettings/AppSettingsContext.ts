import { createContext } from 'react';
import type { KeyboardNoteMapping } from '../../constants/keyboard';
import { DEFAULT_KEYBOARD_NOTE_MAPPINGS } from '../../constants/keyboard';

export interface PianoInputSettings {
  defaultNoteLength: string;
  keySignature: string;
  tempo: number;
  timeSignature: string;
}

export const DEFAULT_PIANO_INPUT_SETTINGS: PianoInputSettings = {
  defaultNoteLength: '1/8',
  keySignature: 'C',
  tempo: 180,
  timeSignature: '4/4',
};

export const DEFAULT_KEYBOARD_CONTROL_SETTINGS = DEFAULT_KEYBOARD_NOTE_MAPPINGS;

export interface AppSettingsContextValue {
  isKeyboardControlEnabled: boolean;
  isMidiControlEnabled: boolean;
  isMouseControlEnabled: boolean;
  isPianoInputEnabled: boolean;
  isTouchControlEnabled: boolean;
  keyboardNoteMappings: KeyboardNoteMapping[];
  pianoInputSettings: PianoInputSettings;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  setIsMidiControlEnabled: (enabled: boolean) => void;
  setIsMouseControlEnabled: (enabled: boolean) => void;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  setIsTouchControlEnabled: (enabled: boolean) => void;
  setKeyboardNoteMappings: (mappings: KeyboardNoteMapping[]) => void;
  setPianoInputSettings: (settings: PianoInputSettings) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextValue | null>(
  null,
);
