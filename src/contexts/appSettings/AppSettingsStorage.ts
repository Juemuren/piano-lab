import type { KeyboardNoteMapping } from '../../constants/keyboard';
import { normalizeKeyboardControlKey } from '../../utils/keyboard';
import { isRecord, numberOrDefault } from '../../utils/runtime';
import type { PianoInputSettings } from './AppSettingsContext';
import {
  DEFAULT_KEYBOARD_CONTROL_SETTINGS,
  DEFAULT_PIANO_INPUT_SETTINGS,
} from './AppSettingsContext';

const APP_SETTINGS_STORAGE_KEY = 'piano-lab:app-settings';

export interface StoredAppSettings {
  isKeyboardControlEnabled: boolean;
  isMidiControlEnabled: boolean;
  isMouseControlEnabled: boolean;
  isPianoInputEnabled: boolean;
  isTouchControlEnabled: boolean;
  keyboardNoteMappings: KeyboardNoteMapping[];
  pianoInputSettings: PianoInputSettings;
}

export const DEFAULT_STORED_APP_SETTINGS: StoredAppSettings = {
  isKeyboardControlEnabled: false,
  isMidiControlEnabled: false,
  isMouseControlEnabled: true,
  isPianoInputEnabled: false,
  isTouchControlEnabled: true,
  keyboardNoteMappings: DEFAULT_KEYBOARD_CONTROL_SETTINGS,
  pianoInputSettings: DEFAULT_PIANO_INPUT_SETTINGS,
};

function booleanOrDefault(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function stringOrDefault(value: unknown, fallback: string) {
  return typeof value === 'string' && value ? value : fallback;
}

function getStoredPianoInputSettings(value: unknown): PianoInputSettings {
  if (!isRecord(value)) {
    return DEFAULT_PIANO_INPUT_SETTINGS;
  }

  return {
    defaultNoteLength: stringOrDefault(
      value.defaultNoteLength,
      DEFAULT_PIANO_INPUT_SETTINGS.defaultNoteLength,
    ),
    keySignature: stringOrDefault(
      value.keySignature,
      DEFAULT_PIANO_INPUT_SETTINGS.keySignature,
    ),
    tempo: numberOrDefault(value.tempo, DEFAULT_PIANO_INPUT_SETTINGS.tempo),
    timeSignature: stringOrDefault(
      value.timeSignature,
      DEFAULT_PIANO_INPUT_SETTINGS.timeSignature,
    ),
  };
}

function getStoredKeyboardNoteMappings(value: unknown): KeyboardNoteMapping[] {
  if (!Array.isArray(value)) {
    return DEFAULT_KEYBOARD_CONTROL_SETTINGS;
  }

  const usedKeys = new Set<string>();

  function getDefaultMapping(defaultMapping: KeyboardNoteMapping) {
    if (usedKeys.has(defaultMapping.key)) {
      return { ...defaultMapping, key: '' };
    }

    usedKeys.add(defaultMapping.key);
    return defaultMapping;
  }

  return DEFAULT_KEYBOARD_CONTROL_SETTINGS.map((defaultMapping) => {
    const storedMapping = value.find((item) => {
      return isRecord(item) && item.offset === defaultMapping.offset;
    });
    if (!isRecord(storedMapping)) {
      return getDefaultMapping(defaultMapping);
    }

    if (storedMapping.key === '') {
      return { ...defaultMapping, key: '' };
    }

    const key =
      typeof storedMapping.key === 'string'
        ? normalizeKeyboardControlKey(storedMapping.key)
        : null;
    if (key === null || usedKeys.has(key)) {
      return getDefaultMapping(defaultMapping);
    }

    usedKeys.add(key);

    return {
      ...defaultMapping,
      key,
    };
  });
}

function normalizeStoredAppSettings(value: unknown): StoredAppSettings {
  if (!isRecord(value)) {
    return DEFAULT_STORED_APP_SETTINGS;
  }

  return {
    isKeyboardControlEnabled: booleanOrDefault(
      value.isKeyboardControlEnabled,
      DEFAULT_STORED_APP_SETTINGS.isKeyboardControlEnabled,
    ),
    isMidiControlEnabled: booleanOrDefault(
      value.isMidiControlEnabled,
      DEFAULT_STORED_APP_SETTINGS.isMidiControlEnabled,
    ),
    isMouseControlEnabled: booleanOrDefault(
      value.isMouseControlEnabled,
      DEFAULT_STORED_APP_SETTINGS.isMouseControlEnabled,
    ),
    isPianoInputEnabled: booleanOrDefault(
      value.isPianoInputEnabled,
      DEFAULT_STORED_APP_SETTINGS.isPianoInputEnabled,
    ),
    isTouchControlEnabled: booleanOrDefault(
      value.isTouchControlEnabled,
      DEFAULT_STORED_APP_SETTINGS.isTouchControlEnabled,
    ),
    keyboardNoteMappings: getStoredKeyboardNoteMappings(
      value.keyboardNoteMappings,
    ),
    pianoInputSettings: getStoredPianoInputSettings(value.pianoInputSettings),
  };
}

export function readStoredAppSettings() {
  try {
    const storedSettings = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (storedSettings === null) {
      return DEFAULT_STORED_APP_SETTINGS;
    }

    return normalizeStoredAppSettings(JSON.parse(storedSettings));
  } catch {
    return DEFAULT_STORED_APP_SETTINGS;
  }
}

export function writeStoredAppSettings(settings: StoredAppSettings) {
  try {
    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage failures so settings still work during the current session.
  }
}
