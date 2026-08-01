import { useContext } from 'react';
import { GamepadControlContext } from './GamepadControlContext';

export function useGamepadControlContext() {
  const gamepadControl = useContext(GamepadControlContext);

  if (!gamepadControl) {
    throw new Error(
      'useGamepadControlContext must be used within GamepadControlProvider',
    );
  }

  return gamepadControl;
}
