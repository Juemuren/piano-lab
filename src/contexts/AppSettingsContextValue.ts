import { createContext } from 'react';

export interface AppSettingsContextValue {
  isPianoInputEnabled: boolean;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  isKeyboardControlEnabled: boolean;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextValue | null>(
  null,
);
