import { type ReactNode, useMemo, useState } from 'react';
import {
  AppSettingsContext,
  DEFAULT_PIANO_INPUT_SETTINGS,
} from './AppSettingsContext';
import type { PianoInputSettings } from './AppSettingsContext';

interface AppSettingsProviderProps {
  children: ReactNode;
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const [isPianoInputEnabled, setIsPianoInputEnabled] = useState(false);
  const [pianoInputSettings, setPianoInputSettings] =
    useState<PianoInputSettings>(DEFAULT_PIANO_INPUT_SETTINGS);
  const [isKeyboardControlEnabled, setIsKeyboardControlEnabled] =
    useState(false);
  const [isMouseControlEnabled, setIsMouseControlEnabled] = useState(true);
  const [isTouchControlEnabled, setIsTouchControlEnabled] = useState(true);
  const [isMidiControlEnabled, setIsMidiControlEnabled] = useState(false);

  const value = useMemo(
    () => ({
      isPianoInputEnabled,
      setIsPianoInputEnabled,
      pianoInputSettings,
      setPianoInputSettings,
      isKeyboardControlEnabled,
      setIsKeyboardControlEnabled,
      isMouseControlEnabled,
      setIsMouseControlEnabled,
      isTouchControlEnabled,
      setIsTouchControlEnabled,
      isMidiControlEnabled,
      setIsMidiControlEnabled,
    }),
    [
      isKeyboardControlEnabled,
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
