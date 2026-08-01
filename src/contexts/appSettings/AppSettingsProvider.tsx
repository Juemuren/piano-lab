import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { PianoInputSettings } from '../../services/abc/AbcSettings';
import type { AppSettingsContextValue } from './AppSettingsContext';
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
  const [isKeyboardKeyHintEnabled, setIsKeyboardKeyHintEnabled] = useState(
    initialSettings.isKeyboardKeyHintEnabled,
  );
  const [isKeyboardOctaveHintEnabled, setIsKeyboardOctaveHintEnabled] =
    useState(initialSettings.isKeyboardOctaveHintEnabled);
  const [keyboardControlMappings, setKeyboardControlMappings] = useState(
    initialSettings.keyboardControlMappings,
  );
  const [isMouseControlEnabled, setIsMouseControlEnabled] = useState(
    initialSettings.isMouseControlEnabled,
  );
  const [isTouchControlEnabled, setIsTouchControlEnabled] = useState(
    initialSettings.isTouchControlEnabled,
  );
  const [isMidiControlEnabled, setIsMidiControlEnabled] = useState(
    initialSettings.isMidiControlEnabled,
  );
  const [isGamepadControlEnabled, setIsGamepadControlEnabled] = useState(
    initialSettings.isGamepadControlEnabled,
  );

  useEffect(() => {
    writeStoredAppSettings({
      isGamepadControlEnabled,
      isKeyboardControlEnabled,
      isKeyboardKeyHintEnabled,
      isKeyboardOctaveHintEnabled,
      isMidiControlEnabled,
      isMouseControlEnabled,
      isPianoInputEnabled,
      isTouchControlEnabled,
      keyboardControlMappings,
      pianoInputSettings,
    });
  }, [
    isGamepadControlEnabled,
    isKeyboardControlEnabled,
    isKeyboardKeyHintEnabled,
    isKeyboardOctaveHintEnabled,
    isMidiControlEnabled,
    isMouseControlEnabled,
    isPianoInputEnabled,
    keyboardControlMappings,
    pianoInputSettings,
    isTouchControlEnabled,
  ]);

  const value = useMemo(
    (): AppSettingsContextValue => ({
      isGamepadControlEnabled,
      isKeyboardControlEnabled,
      isKeyboardKeyHintEnabled,
      isKeyboardOctaveHintEnabled,
      isMidiControlEnabled,
      isMouseControlEnabled,
      isPianoInputEnabled,
      isTouchControlEnabled,
      keyboardControlMappings,
      pianoInputSettings,
      setIsGamepadControlEnabled,
      setIsKeyboardControlEnabled,
      setIsKeyboardKeyHintEnabled,
      setIsKeyboardOctaveHintEnabled,
      setIsMidiControlEnabled,
      setIsMouseControlEnabled,
      setIsPianoInputEnabled,
      setIsTouchControlEnabled,
      setKeyboardControlMappings,
      setPianoInputSettings,
    }),
    [
      isGamepadControlEnabled,
      isKeyboardControlEnabled,
      isKeyboardKeyHintEnabled,
      isKeyboardOctaveHintEnabled,
      keyboardControlMappings,
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
