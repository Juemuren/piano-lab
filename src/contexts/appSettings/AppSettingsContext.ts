import { createContext } from 'react';
import {
  DEFAULT_KEYBOARD_NOTE_MAPPINGS,
  type KeyboardNoteMapping,
} from '../../constants/keyboard';

export interface PianoInputSettings {
  defaultNoteLength: string;
  tempo: number;
  keySignature: string;
  timeSignature: string;
}

export const DEFAULT_PIANO_INPUT_SETTINGS: PianoInputSettings = {
  defaultNoteLength: '1/8',
  tempo: 180,
  keySignature: 'C',
  timeSignature: '4/4',
};

export const DEFAULT_KEYBOARD_CONTROL_SETTINGS = DEFAULT_KEYBOARD_NOTE_MAPPINGS;

export interface AppSettingsContextValue {
  isPianoInputEnabled: boolean;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  pianoInputSettings: PianoInputSettings;
  setPianoInputSettings: (settings: PianoInputSettings) => void;
  isKeyboardControlEnabled: boolean;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  keyboardNoteMappings: KeyboardNoteMapping[];
  setKeyboardNoteMappings: (mappings: KeyboardNoteMapping[]) => void;
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
