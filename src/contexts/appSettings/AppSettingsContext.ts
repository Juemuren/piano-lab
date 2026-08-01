import { createContext } from 'react';
import type { KeyboardControlMappings } from '../../constants/keyboard';
import type { PianoInputSettings } from '../../services/abc/AbcSettings';

export interface AppSettingsContextValue {
  isKeyboardControlEnabled: boolean;
  isKeyboardKeyHintEnabled: boolean;
  isKeyboardOctaveHintEnabled: boolean;
  isMidiControlEnabled: boolean;
  isMouseControlEnabled: boolean;
  isPianoInputEnabled: boolean;
  isTouchControlEnabled: boolean;
  keyboardControlMappings: KeyboardControlMappings;
  pianoInputSettings: PianoInputSettings;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  setIsKeyboardKeyHintEnabled: (enabled: boolean) => void;
  setIsKeyboardOctaveHintEnabled: (enabled: boolean) => void;
  setIsMidiControlEnabled: (enabled: boolean) => void;
  setIsMouseControlEnabled: (enabled: boolean) => void;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  setIsTouchControlEnabled: (enabled: boolean) => void;
  setKeyboardControlMappings: (mappings: KeyboardControlMappings) => void;
  setPianoInputSettings: (settings: PianoInputSettings) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextValue | null>(
  null,
);
