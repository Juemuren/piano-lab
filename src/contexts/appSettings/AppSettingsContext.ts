import { createContext } from 'react';
import type {
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../../constants/keyboard';
import {
  DEFAULT_KEYBOARD_NOTE_MAPPINGS,
  DEFAULT_KEYBOARD_OCTAVE_MAPPINGS,
  DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_MAPPINGS,
} from '../../constants/keyboard';
import type { PianoInputSettings } from '../../services/abc/AbcSettings';

export const DEFAULT_KEYBOARD_CONTROL_SETTINGS = DEFAULT_KEYBOARD_NOTE_MAPPINGS;
export const DEFAULT_KEYBOARD_OCTAVE_CONTROL_SETTINGS =
  DEFAULT_KEYBOARD_OCTAVE_MAPPINGS;
export const DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_CONTROL_SETTINGS =
  DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_MAPPINGS;

export interface AppSettingsContextValue {
  isKeyboardControlEnabled: boolean;
  isKeyboardKeyHintEnabled: boolean;
  isKeyboardOctaveHintEnabled: boolean;
  isMidiControlEnabled: boolean;
  isMouseControlEnabled: boolean;
  isPianoInputEnabled: boolean;
  isTouchControlEnabled: boolean;
  keyboardNoteMappings: KeyboardNoteMapping[];
  keyboardOctaveKeyMappings: KeyboardOctaveKeyMappings;
  keyboardTemporaryOctaveKeyMappings: KeyboardOctaveKeyMappings;
  pianoInputSettings: PianoInputSettings;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  setIsKeyboardKeyHintEnabled: (enabled: boolean) => void;
  setIsKeyboardOctaveHintEnabled: (enabled: boolean) => void;
  setIsMidiControlEnabled: (enabled: boolean) => void;
  setIsMouseControlEnabled: (enabled: boolean) => void;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  setIsTouchControlEnabled: (enabled: boolean) => void;
  setKeyboardNoteMappings: (mappings: KeyboardNoteMapping[]) => void;
  setKeyboardOctaveKeyMappings: (mappings: KeyboardOctaveKeyMappings) => void;
  setKeyboardTemporaryOctaveKeyMappings: (
    mappings: KeyboardOctaveKeyMappings,
  ) => void;
  setPianoInputSettings: (settings: PianoInputSettings) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextValue | null>(
  null,
);
