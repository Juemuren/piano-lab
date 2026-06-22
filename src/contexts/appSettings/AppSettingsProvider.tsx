import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type {
  AppSettingsContextValue,
  PianoInputSettings,
} from './AppSettingsContext';
import { AppSettingsContext } from './AppSettingsContext';
import {
  readStoredAppSettings,
  writeStoredAppSettings,
} from './AppSettingsStorage';

interface AppSettingsProviderProps {
  children: ReactNode;
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const [initialSettings] = useState(readStoredAppSettings);
  const [isPianoInputEnabled, setIsPianoInputEnabled] = useState(
    initialSettings.isPianoInputEnabled,
  );
  const [pianoInputSettings, setPianoInputSettings] =
    useState<PianoInputSettings>(initialSettings.pianoInputSettings);
  const [isKeyboardControlEnabled, setIsKeyboardControlEnabled] = useState(
    initialSettings.isKeyboardControlEnabled,
  );
  const [keyboardNoteMappings, setKeyboardNoteMappings] = useState(
    initialSettings.keyboardNoteMappings,
  );
  const [keyboardOctaveKeyMappings, setKeyboardOctaveKeyMappings] = useState(
    initialSettings.keyboardOctaveKeyMappings,
  );
  const [
    keyboardTemporaryOctaveKeyMappings,
    setKeyboardTemporaryOctaveKeyMappings,
  ] = useState(initialSettings.keyboardTemporaryOctaveKeyMappings);
  const [isMouseControlEnabled, setIsMouseControlEnabled] = useState(
    initialSettings.isMouseControlEnabled,
  );
  const [isTouchControlEnabled, setIsTouchControlEnabled] = useState(
    initialSettings.isTouchControlEnabled,
  );
  const [isMidiControlEnabled, setIsMidiControlEnabled] = useState(
    initialSettings.isMidiControlEnabled,
  );

  useEffect(() => {
    writeStoredAppSettings({
      isKeyboardControlEnabled,
      isMidiControlEnabled,
      isMouseControlEnabled,
      isPianoInputEnabled,
      isTouchControlEnabled,
      keyboardNoteMappings,
      keyboardOctaveKeyMappings,
      keyboardTemporaryOctaveKeyMappings,
      pianoInputSettings,
    });
  }, [
    isKeyboardControlEnabled,
    isMidiControlEnabled,
    isMouseControlEnabled,
    isPianoInputEnabled,
    keyboardNoteMappings,
    keyboardOctaveKeyMappings,
    keyboardTemporaryOctaveKeyMappings,
    pianoInputSettings,
    isTouchControlEnabled,
  ]);

  const value = useMemo(
    (): AppSettingsContextValue => ({
      isKeyboardControlEnabled,
      isMidiControlEnabled,
      isMouseControlEnabled,
      isPianoInputEnabled,
      isTouchControlEnabled,
      keyboardNoteMappings,
      keyboardOctaveKeyMappings,
      keyboardTemporaryOctaveKeyMappings,
      pianoInputSettings,
      setIsKeyboardControlEnabled,
      setIsMidiControlEnabled,
      setIsMouseControlEnabled,
      setIsPianoInputEnabled,
      setIsTouchControlEnabled,
      setKeyboardNoteMappings,
      setKeyboardOctaveKeyMappings,
      setKeyboardTemporaryOctaveKeyMappings,
      setPianoInputSettings,
    }),
    [
      isKeyboardControlEnabled,
      keyboardNoteMappings,
      keyboardOctaveKeyMappings,
      keyboardTemporaryOctaveKeyMappings,
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
