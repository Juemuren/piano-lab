import type { KeyboardEvent } from 'react';
import type { KeyboardControlMappings } from '../../constants/keyboard';
import { DEFAULT_KEYBOARD_CONTROL_MAPPINGS } from '../../constants/keyboard';
import type {
  KeyboardMappingSlot,
  KeyboardOctaveDirection,
} from '../../utils/keyboard';
import {
  getKeyboardMappingsWithAssignedKey,
  isKeyboardMappingClearKey,
  normalizeKeyboardControlKey,
} from '../../utils/keyboard';

interface UseKeyboardControlSettingsOptions {
  keyboardControlMappings: KeyboardControlMappings;
  setKeyboardControlMappings: (mappings: KeyboardControlMappings) => void;
}

function handleMappingKeyDown(
  e: KeyboardEvent<HTMLInputElement>,
  setKey: (key: string) => void,
) {
  e.preventDefault();
  e.stopPropagation();

  if (isKeyboardMappingClearKey(e.key)) {
    setKey('');
    return;
  }

  const key = normalizeKeyboardControlKey(e.key);
  if (key !== null) {
    setKey(key);
  }
}

function useKeyboardControlSettings({
  keyboardControlMappings,
  setKeyboardControlMappings,
}: UseKeyboardControlSettingsOptions) {
  function assignKeyboardMappingKey(
    targetSlot: KeyboardMappingSlot,
    key: string,
  ) {
    const nextMappings = getKeyboardMappingsWithAssignedKey(
      keyboardControlMappings,
      targetSlot,
      key,
    );

    setKeyboardControlMappings(nextMappings);
  }

  function setNoteMappingKey(offset: number, key: string) {
    assignKeyboardMappingKey({ offset, type: 'note' }, key);
  }

  function setOctaveMappingKey(
    direction: KeyboardOctaveDirection,
    key: string,
  ) {
    assignKeyboardMappingKey({ direction, type: 'octave' }, key);
  }

  function setTemporaryOctaveMappingKey(
    direction: KeyboardOctaveDirection,
    key: string,
  ) {
    assignKeyboardMappingKey({ direction, type: 'temporaryOctave' }, key);
  }

  function handleNoteKeyDown(
    offset: number,
    e: KeyboardEvent<HTMLInputElement>,
  ) {
    handleMappingKeyDown(e, (key) => setNoteMappingKey(offset, key));
  }

  function handleOctaveKeyDown(
    direction: KeyboardOctaveDirection,
    e: KeyboardEvent<HTMLInputElement>,
  ) {
    handleMappingKeyDown(e, (key) => setOctaveMappingKey(direction, key));
  }

  function handleTemporaryOctaveKeyDown(
    direction: KeyboardOctaveDirection,
    e: KeyboardEvent<HTMLInputElement>,
  ) {
    handleMappingKeyDown(e, (key) =>
      setTemporaryOctaveMappingKey(direction, key),
    );
  }

  function resetKeyboardMappings() {
    setKeyboardControlMappings(DEFAULT_KEYBOARD_CONTROL_MAPPINGS);
  }

  return {
    handleNoteKeyDown,
    handleOctaveKeyDown,
    handleTemporaryOctaveKeyDown,
    resetKeyboardMappings,
    setNoteMappingKey,
    setOctaveMappingKey,
    setTemporaryOctaveMappingKey,
  };
}

export default useKeyboardControlSettings;
