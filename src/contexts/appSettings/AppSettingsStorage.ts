import type { KeyboardControlMappings } from '../../constants/keyboard';
import { DEFAULT_KEYBOARD_CONTROL_MAPPINGS } from '../../constants/keyboard';
import type { PianoInputSettings } from '../../services/abc/AbcSettings';
import { DEFAULT_PIANO_INPUT_SETTINGS } from '../../services/abc/AbcSettings';

const APP_SETTINGS_STORAGE_KEY = 'piano-lab:app-settings';

export interface StoredAppSettings {
  isKeyboardControlEnabled: boolean;
  isKeyboardKeyHintEnabled: boolean;
  isKeyboardOctaveHintEnabled: boolean;
  isMidiControlEnabled: boolean;
  isMouseControlEnabled: boolean;
  isPianoInputEnabled: boolean;
  isTouchControlEnabled: boolean;
  keyboardControlMappings: KeyboardControlMappings;
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
  keyboardControlMappings: DEFAULT_KEYBOARD_CONTROL_MAPPINGS,
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
