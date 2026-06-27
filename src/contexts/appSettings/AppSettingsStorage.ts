import type {
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../../constants/keyboard';
import type { PianoInputSettings } from './AppSettingsContext';
import {
  DEFAULT_KEYBOARD_CONTROL_SETTINGS,
  DEFAULT_KEYBOARD_OCTAVE_CONTROL_SETTINGS,
  DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_CONTROL_SETTINGS,
  DEFAULT_PIANO_INPUT_SETTINGS,
} from './AppSettingsContext';

const APP_SETTINGS_STORAGE_KEY = 'piano-lab:app-settings';

export interface StoredAppSettings {
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
}

export const DEFAULT_STORED_APP_SETTINGS: StoredAppSettings = {
  isKeyboardControlEnabled: false,
  isKeyboardKeyHintEnabled: true,
  isKeyboardOctaveHintEnabled: true,
  isMidiControlEnabled: false,
  isMouseControlEnabled: true,
  isPianoInputEnabled: false,
  isTouchControlEnabled: true,
  keyboardNoteMappings: DEFAULT_KEYBOARD_CONTROL_SETTINGS,
  keyboardOctaveKeyMappings: DEFAULT_KEYBOARD_OCTAVE_CONTROL_SETTINGS,
  keyboardTemporaryOctaveKeyMappings:
    DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_CONTROL_SETTINGS,
  pianoInputSettings: DEFAULT_PIANO_INPUT_SETTINGS,
};

export function readStoredAppSettings() {
  const storedSettings = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
  if (storedSettings === null) {
    return DEFAULT_STORED_APP_SETTINGS;
  }

  return JSON.parse(storedSettings) as StoredAppSettings;
}

export function writeStoredAppSettings(settings: StoredAppSettings) {
  localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
