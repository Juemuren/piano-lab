import { createContext } from 'react';

export interface AppSettingsContextValue {
  isPianoInputEnabled: boolean;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  isKeyboardControlEnabled: boolean;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  isMouseControlEnabled: boolean;
  setIsMouseControlEnabled: (enabled: boolean) => void;
  isTouchControlEnabled: boolean;
  setIsTouchControlEnabled: (enabled: boolean) => void;
  isMidiControlEnabled: boolean;
  setIsMidiControlEnabled: (enabled: boolean) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextValue | null>(
  null,
);
