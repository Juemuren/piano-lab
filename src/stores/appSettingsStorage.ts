import { z } from 'zod';
import { DEFAULT_KEYBOARD_CONTROL_MAPPINGS } from '../constants/keyboard';
import { DEFAULT_PIANO_INPUT_SETTINGS } from '../services/abc/AbcSettings';

const APP_SETTINGS_STORAGE_KEY = 'piano-lab:app-settings';

const keyboardOctaveKeyMappingsSchema = z.object({
  downKey: z.string(),
  upKey: z.string(),
});

const storedAppSettingsSchema = z.object({
  isGamepadControlEnabled: z.boolean(),
  isKeyboardControlEnabled: z.boolean(),
  isKeyboardKeyHintEnabled: z.boolean(),
  isKeyboardOctaveHintEnabled: z.boolean(),
  isMidiControlEnabled: z.boolean(),
  isMouseControlEnabled: z.boolean(),
  isPianoInputEnabled: z.boolean(),
  isTouchControlEnabled: z.boolean(),
  keyboardControlMappings: z.object({
    noteMappings: z.array(
      z.object({
        key: z.string(),
        offset: z.number(),
      }),
    ),
    octaveKeyMappings: keyboardOctaveKeyMappingsSchema,
    temporaryOctaveKeyMappings: keyboardOctaveKeyMappingsSchema,
  }),
  pianoInputSettings: z.object({
    defaultNoteLength: z.string(),
    keySignature: z.string(),
    tempo: z.number(),
    timeSignature: z.string(),
  }),
});

export type StoredAppSettings = z.infer<typeof storedAppSettingsSchema>;

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

export function readStoredAppSettings() {
  try {
    const storedSettings = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (storedSettings === null) {
      return DEFAULT_STORED_APP_SETTINGS;
    }

    return storedAppSettingsSchema.parse(JSON.parse(storedSettings));
  } catch {
    localStorage.removeItem(APP_SETTINGS_STORAGE_KEY);
    return DEFAULT_STORED_APP_SETTINGS;
  }
}

export function writeStoredAppSettings(settings: StoredAppSettings) {
  localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
