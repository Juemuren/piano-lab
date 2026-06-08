import { type ReactNode, useMemo, useState } from 'react';
import {
  AppSettingsContext,
  DEFAULT_KEYBOARD_CONTROL_SETTINGS,
  DEFAULT_PIANO_INPUT_SETTINGS,
} from './AppSettingsContext';
import type {
  AppSettingsContextValue,
  PianoInputSettings,
} from './AppSettingsContext';

interface AppSettingsProviderProps {
  children: ReactNode;
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const [isPianoInputEnabled, setIsPianoInputEnabled] = useState(false);
  const [pianoInputSettings, setPianoInputSettings] =
    useState<PianoInputSettings>(DEFAULT_PIANO_INPUT_SETTINGS);
  const [isKeyboardControlEnabled, setIsKeyboardControlEnabled] =
    useState(false);
  const [keyboardNoteMappings, setKeyboardNoteMappings] = useState(
    DEFAULT_KEYBOARD_CONTROL_SETTINGS,
  );
  const [isMouseControlEnabled, setIsMouseControlEnabled] = useState(true);
  const [isTouchControlEnabled, setIsTouchControlEnabled] = useState(true);
  const [isMidiControlEnabled, setIsMidiControlEnabled] = useState(false);

  const value = useMemo(
    (): AppSettingsContextValue => ({
      isPianoInputEnabled,
      setIsPianoInputEnabled,
      pianoInputSettings,
      setPianoInputSettings,
      isKeyboardControlEnabled,
      setIsKeyboardControlEnabled,
      keyboardNoteMappings,
      setKeyboardNoteMappings,
      isMouseControlEnabled,
      setIsMouseControlEnabled,
      isTouchControlEnabled,
      setIsTouchControlEnabled,
      isMidiControlEnabled,
      setIsMidiControlEnabled,
    }),
    [
      isKeyboardControlEnabled,
      keyboardNoteMappings,
      isMidiControlEnabled,
      isMouseControlEnabled,
      isPianoInputEnabled,
      pianoInputSettings,
      isTouchControlEnabled,
    ],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}
