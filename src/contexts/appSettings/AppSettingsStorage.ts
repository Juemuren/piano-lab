import type {
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../../constants/keyboard';
import { normalizeKeyboardControlKey } from '../../utils/keyboard';
import {
  booleanOrDefault,
  isRecord,
  numberOrDefault,
  stringOrDefault,
} from '../../utils/runtime';
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
        ? normalizeKeyboardControlKey(storedMapping.key, {
            allowModifierKeys: true,
          })
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

function getStoredKeyboardOctaveKeyMappings(
  value: unknown,
  keyboardNoteMappings: KeyboardNoteMapping[],
  reservedKeys: string[] = [],
  fallback: KeyboardOctaveKeyMappings = DEFAULT_KEYBOARD_OCTAVE_CONTROL_SETTINGS,
  allowModifierKeys = true,
): KeyboardOctaveKeyMappings {
  if (!isRecord(value)) {
    return fallback;
  }

  const noteKeys = new Set(
    [
      ...keyboardNoteMappings.map((mapping) => mapping.key),
      ...reservedKeys,
    ].filter(Boolean),
  );
  const defaultDownKey = fallback.downKey;
  const defaultUpKey = fallback.upKey;
  const normalizeOptions = { allowModifierKeys };
  const downKey =
    typeof value.downKey === 'string'
      ? normalizeKeyboardControlKey(value.downKey, normalizeOptions)
      : null;
  const upKey =
    typeof value.upKey === 'string'
      ? normalizeKeyboardControlKey(value.upKey, normalizeOptions)
      : null;
  const nextDownKey =
    downKey === null || noteKeys.has(downKey) ? defaultDownKey : downKey;
  const nextUpKey =
    upKey === null || noteKeys.has(upKey) || upKey === nextDownKey
      ? defaultUpKey
      : upKey;

  return {
    downKey: nextDownKey === nextUpKey ? '' : nextDownKey,
    upKey: nextUpKey,
  };
}

function normalizeStoredAppSettings(value: unknown): StoredAppSettings {
  if (!isRecord(value)) {
    return DEFAULT_STORED_APP_SETTINGS;
  }

  const keyboardNoteMappings = getStoredKeyboardNoteMappings(
    value.keyboardNoteMappings,
  );
  const keyboardOctaveKeyMappings = getStoredKeyboardOctaveKeyMappings(
    value.keyboardOctaveKeyMappings,
    keyboardNoteMappings,
  );

  return {
    isKeyboardControlEnabled: booleanOrDefault(
      value.isKeyboardControlEnabled,
      DEFAULT_STORED_APP_SETTINGS.isKeyboardControlEnabled,
    ),
    isKeyboardKeyHintEnabled: booleanOrDefault(
      value.isKeyboardKeyHintEnabled,
      DEFAULT_STORED_APP_SETTINGS.isKeyboardKeyHintEnabled,
    ),
    isKeyboardOctaveHintEnabled: booleanOrDefault(
      value.isKeyboardOctaveHintEnabled,
      DEFAULT_STORED_APP_SETTINGS.isKeyboardOctaveHintEnabled,
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
    keyboardNoteMappings,
    keyboardOctaveKeyMappings,
    keyboardTemporaryOctaveKeyMappings: getStoredKeyboardOctaveKeyMappings(
      value.keyboardTemporaryOctaveKeyMappings,
      keyboardNoteMappings,
      Object.values(keyboardOctaveKeyMappings),
      DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_CONTROL_SETTINGS,
      true,
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
    return;
  }
}
