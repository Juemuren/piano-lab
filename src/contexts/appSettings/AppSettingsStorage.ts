import type {
  KeyboardControlMappings,
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../../constants/keyboard';
import { DEFAULT_KEYBOARD_CONTROL_MAPPINGS } from '../../constants/keyboard';
import type { PianoInputSettings } from '../../services/abc/AbcSettings';
import { DEFAULT_PIANO_INPUT_SETTINGS } from '../../services/abc/AbcSettings';
import { isRecord } from '../../utils/object';

const APP_SETTINGS_STORAGE_KEY = 'piano-lab:app-settings';

export interface StoredAppSettings {
  isGamepadControlEnabled: boolean;
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
  isGamepadControlEnabled: false,
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

function isKeyboardNoteMapping(value: unknown): value is KeyboardNoteMapping {
  return (
    isRecord(value) &&
    typeof value.isGamepadControlEnabled === 'boolean' &&
    typeof value.key === 'string' &&
    typeof value.offset === 'number'
  );
}

function isKeyboardOctaveKeyMappings(
  value: unknown,
): value is KeyboardOctaveKeyMappings {
  return (
    isRecord(value) &&
    typeof value.downKey === 'string' &&
    typeof value.upKey === 'string'
  );
}

function isKeyboardControlMappings(
  value: unknown,
): value is KeyboardControlMappings {
  return (
    isRecord(value) &&
    Array.isArray(value.noteMappings) &&
    value.noteMappings.every(isKeyboardNoteMapping) &&
    isKeyboardOctaveKeyMappings(value.octaveKeyMappings) &&
    isKeyboardOctaveKeyMappings(value.temporaryOctaveKeyMappings)
  );
}

function isPianoInputSettings(value: unknown): value is PianoInputSettings {
  return (
    isRecord(value) &&
    typeof value.defaultNoteLength === 'string' &&
    typeof value.keySignature === 'string' &&
    typeof value.tempo === 'number' &&
    typeof value.timeSignature === 'string'
  );
}

function isStoredAppSettings(value: unknown): value is StoredAppSettings {
  return (
    isRecord(value) &&
    typeof value.isKeyboardControlEnabled === 'boolean' &&
    typeof value.isKeyboardKeyHintEnabled === 'boolean' &&
    typeof value.isKeyboardOctaveHintEnabled === 'boolean' &&
    typeof value.isMidiControlEnabled === 'boolean' &&
    typeof value.isMouseControlEnabled === 'boolean' &&
    typeof value.isPianoInputEnabled === 'boolean' &&
    typeof value.isTouchControlEnabled === 'boolean' &&
    isKeyboardControlMappings(value.keyboardControlMappings) &&
    isPianoInputSettings(value.pianoInputSettings)
  );
}

export function readStoredAppSettings() {
  try {
    const storedSettings = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (storedSettings === null) {
      return DEFAULT_STORED_APP_SETTINGS;
    }

    const settings: unknown = JSON.parse(storedSettings);
    if (!isStoredAppSettings(settings)) {
      throw new TypeError('Invalid app settings');
    }

    return settings;
  } catch {
    localStorage.clear();
    return DEFAULT_STORED_APP_SETTINGS;
  }
}

export function writeStoredAppSettings(settings: StoredAppSettings) {
  localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
