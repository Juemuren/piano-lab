import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';
import type { KeyboardControlMappings } from '../../constants/keyboard';
import type { PianoInputSettings } from '../../services/abc/AbcSettings';

export interface AppSettingsContextValue {
  isGamepadControlEnabled: boolean;
  isKeyboardControlEnabled: boolean;
  isKeyboardKeyHintEnabled: boolean;
  isKeyboardOctaveHintEnabled: boolean;
  isMidiControlEnabled: boolean;
  isMouseControlEnabled: boolean;
  isPianoInputEnabled: boolean;
  isTouchControlEnabled: boolean;
  keyboardControlMappings: KeyboardControlMappings;
  pianoInputSettings: PianoInputSettings;
  setIsGamepadControlEnabled: (enabled: boolean) => void;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  setIsKeyboardKeyHintEnabled: (enabled: boolean) => void;
  setIsKeyboardOctaveHintEnabled: (enabled: boolean) => void;
  setIsMidiControlEnabled: (enabled: boolean) => void;
  setIsMouseControlEnabled: (enabled: boolean) => void;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  setIsTouchControlEnabled: (enabled: boolean) => void;
  setKeyboardControlMappings: Dispatch<SetStateAction<KeyboardControlMappings>>;
  setPianoInputSettings: (settings: PianoInputSettings) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextValue | null>(
  null,
);
