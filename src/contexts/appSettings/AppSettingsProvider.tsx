import { type ReactNode, useMemo, useState } from 'react';
import { AppSettingsContext } from './AppSettingsContext';

interface AppSettingsProviderProps {
  children: ReactNode;
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const [isPianoInputEnabled, setIsPianoInputEnabled] = useState(false);
  const [isKeyboardControlEnabled, setIsKeyboardControlEnabled] =
    useState(true);
  const [isMouseControlEnabled, setIsMouseControlEnabled] = useState(true);
  const [isTouchControlEnabled, setIsTouchControlEnabled] = useState(true);
  const [isMidiControlEnabled, setIsMidiControlEnabled] = useState(false);

  const value = useMemo(
    () => ({
      isPianoInputEnabled,
      setIsPianoInputEnabled,
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
      isTouchControlEnabled,
    ],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}
