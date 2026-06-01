import { type ReactNode, useMemo, useState } from 'react';
import { AppSettingsContext } from './AppSettingsContextValue';

interface AppSettingsProviderProps {
  children: ReactNode;
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const [isPianoInputEnabled, setIsPianoInputEnabled] = useState(false);
  const [isKeyboardControlEnabled, setIsKeyboardControlEnabled] =
    useState(true);

  const value = useMemo(
    () => ({
      isPianoInputEnabled,
      setIsPianoInputEnabled,
      isKeyboardControlEnabled,
      setIsKeyboardControlEnabled,
    }),
    [isKeyboardControlEnabled, isPianoInputEnabled],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}
