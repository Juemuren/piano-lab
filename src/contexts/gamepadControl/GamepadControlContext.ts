import { createContext } from 'react';

export type GamepadStatus = 'idle' | 'unsupported' | 'ready' | 'error';

export interface GamepadDevice {
  axisCount: number;
  buttonCount: number;
  id: string;
  index: number;
  mapping: GamepadMappingType;
}

export interface GamepadControlState {
  activeGamepadIndex?: number;
  devices: GamepadDevice[];
  status: GamepadStatus;
}

export interface GamepadControlContextValue {
  gamepadControl: GamepadControlState;
  selectedGamepadIndex?: number;
  setGamepadControl: (state: GamepadControlState) => void;
  setSelectedGamepadIndex: (index?: number) => void;
}

export const GamepadControlContext =
  createContext<GamepadControlContextValue | null>(null);
