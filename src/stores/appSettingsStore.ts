import { create } from 'zustand';
import type { KeyboardControlMappings } from '../constants/keyboard';
import type { PianoInputSettings } from '../services/abc/AbcSettings';
import type { StoredAppSettings } from './appSettingsStorage';
import {
  readStoredAppSettings,
  writeStoredAppSettings,
} from './appSettingsStorage';

type KeyboardControlMappingsUpdate =
  | KeyboardControlMappings
  | ((current: KeyboardControlMappings) => KeyboardControlMappings);

interface AppSettingsState extends StoredAppSettings {
  setIsGamepadControlEnabled: (enabled: boolean) => void;
  setIsGamepadKeyHintEnabled: (enabled: boolean) => void;
  setIsGamepadNoteIndicatorEnabled: (enabled: boolean) => void;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  setIsKeyboardKeyHintEnabled: (enabled: boolean) => void;
  setIsKeyboardOctaveHintEnabled: (enabled: boolean) => void;
  setIsMidiControlEnabled: (enabled: boolean) => void;
  setIsMouseControlEnabled: (enabled: boolean) => void;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  setIsTouchControlEnabled: (enabled: boolean) => void;
  setKeyboardControlMappings: (update: KeyboardControlMappingsUpdate) => void;
  setPianoInputSettings: (settings: PianoInputSettings) => void;
}

const initialSettings = readStoredAppSettings();

export const useAppSettingsStore = create<AppSettingsState>()((set) => ({
  ...initialSettings,
  setIsGamepadControlEnabled: (isGamepadControlEnabled) =>
    set({ isGamepadControlEnabled }),
  setIsGamepadKeyHintEnabled: (isGamepadKeyHintEnabled) =>
    set({ isGamepadKeyHintEnabled }),
  setIsGamepadNoteIndicatorEnabled: (isGamepadNoteIndicatorEnabled) =>
    set({ isGamepadNoteIndicatorEnabled }),
  setIsKeyboardControlEnabled: (isKeyboardControlEnabled) =>
    set({ isKeyboardControlEnabled }),
  setIsKeyboardKeyHintEnabled: (isKeyboardKeyHintEnabled) =>
    set({ isKeyboardKeyHintEnabled }),
  setIsKeyboardOctaveHintEnabled: (isKeyboardOctaveHintEnabled) =>
    set({ isKeyboardOctaveHintEnabled }),
  setIsMidiControlEnabled: (isMidiControlEnabled) =>
    set({ isMidiControlEnabled }),
  setIsMouseControlEnabled: (isMouseControlEnabled) =>
    set({ isMouseControlEnabled }),
  setIsPianoInputEnabled: (isPianoInputEnabled) => set({ isPianoInputEnabled }),
  setIsTouchControlEnabled: (isTouchControlEnabled) =>
    set({ isTouchControlEnabled }),
  setKeyboardControlMappings: (update) =>
    set(({ keyboardControlMappings }) => ({
      keyboardControlMappings:
        typeof update === 'function' ? update(keyboardControlMappings) : update,
    })),
  setPianoInputSettings: (pianoInputSettings) => set({ pianoInputSettings }),
}));

useAppSettingsStore.subscribe((state) => {
  writeStoredAppSettings({
    isGamepadControlEnabled: state.isGamepadControlEnabled,
    isGamepadKeyHintEnabled: state.isGamepadKeyHintEnabled,
    isGamepadNoteIndicatorEnabled: state.isGamepadNoteIndicatorEnabled,
    isKeyboardControlEnabled: state.isKeyboardControlEnabled,
    isKeyboardKeyHintEnabled: state.isKeyboardKeyHintEnabled,
    isKeyboardOctaveHintEnabled: state.isKeyboardOctaveHintEnabled,
    isMidiControlEnabled: state.isMidiControlEnabled,
    isMouseControlEnabled: state.isMouseControlEnabled,
    isPianoInputEnabled: state.isPianoInputEnabled,
    isTouchControlEnabled: state.isTouchControlEnabled,
    keyboardControlMappings: state.keyboardControlMappings,
    pianoInputSettings: state.pianoInputSettings,
  });
});
