import { type ReactNode, useMemo, useState } from 'react';
import { AppSettingsContext } from './AppSettingsContextValue';

interface AppSettingsProviderProps {
  children: ReactNode;
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const [isPianoInputEnabled, setIsPianoInputEnabled] = useState(false);

  const value = useMemo(
    () => ({
      isPianoInputEnabled,
      setIsPianoInputEnabled,
    }),
    [isPianoInputEnabled],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}
