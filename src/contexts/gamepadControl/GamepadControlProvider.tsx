import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { createInitialGamepadControlState } from '../../hooks/piano/useGamepadControl';
import type { GamepadControlState } from './GamepadControlContext';
import { GamepadControlContext } from './GamepadControlContext';

interface GamepadControlProviderProps {
  children: ReactNode;
}

export function GamepadControlProvider({
  children,
}: GamepadControlProviderProps) {
  const [gamepadControl, setGamepadControl] = useState<GamepadControlState>(
    createInitialGamepadControlState,
  );
  const [selectedGamepadIndex, setSelectedGamepadIndex] = useState<number>();

  const value = useMemo(
    () => ({
      gamepadControl,
      selectedGamepadIndex,
      setGamepadControl,
      setSelectedGamepadIndex,
    }),
    [gamepadControl, selectedGamepadIndex],
  );

  return (
    <GamepadControlContext.Provider value={value}>
      {children}
    </GamepadControlContext.Provider>
  );
}
