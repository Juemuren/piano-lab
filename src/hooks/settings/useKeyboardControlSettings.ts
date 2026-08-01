import type { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import type { KeyboardControlMappings } from '../../constants/keyboard';
import { DEFAULT_KEYBOARD_CONTROL_MAPPINGS } from '../../constants/keyboard';
import type { KeyboardMappingSlot } from '../../utils/keyboard';
import {
  getKeyboardMappingKey,
  getKeyboardMappingsWithAssignedKey,
} from '../../utils/keyboard';

interface UseKeyboardControlSettingsOptions {
  setKeyboardControlMappings: Dispatch<SetStateAction<KeyboardControlMappings>>;
}

function useKeyboardControlSettings({
  setKeyboardControlMappings,
}: UseKeyboardControlSettingsOptions) {
  function setMappingKey(targetSlot: KeyboardMappingSlot, key: string) {
    setKeyboardControlMappings((mappings) =>
      getKeyboardMappingsWithAssignedKey(mappings, targetSlot, key),
    );
  }

  function handleMappingKeyDown(
    targetSlot: KeyboardMappingSlot,
    e: KeyboardEvent<HTMLInputElement>,
  ) {
    e.preventDefault();
    e.stopPropagation();

    const key = getKeyboardMappingKey(e.key);
    if (key !== null) {
      setMappingKey(targetSlot, key);
    }
  }

  function resetKeyboardMappings() {
    setKeyboardControlMappings(DEFAULT_KEYBOARD_CONTROL_MAPPINGS);
  }

  function clearKeyboardMappings() {
    setKeyboardControlMappings((mappings) => ({
      noteMappings: mappings.noteMappings.map(({ offset }) => ({
        key: '',
        offset,
      })),
      octaveKeyMappings: {
        downKey: '',
        upKey: '',
      },
      temporaryOctaveKeyMappings: {
        downKey: '',
        upKey: '',
      },
    }));
  }

  return {
    clearKeyboardMappings,
    handleMappingKeyDown,
    resetKeyboardMappings,
    setMappingKey,
  };
}

export default useKeyboardControlSettings;
