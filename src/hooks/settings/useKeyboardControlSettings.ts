import type { KeyboardEvent } from 'react';
import type {
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../../constants/keyboard';
import {
  DEFAULT_KEYBOARD_NOTE_MAPPINGS,
  DEFAULT_KEYBOARD_OCTAVE_MAPPINGS,
  DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_MAPPINGS,
} from '../../constants/keyboard';
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
  keyboardNoteMappings: KeyboardNoteMapping[];
  keyboardOctaveKeyMappings: KeyboardOctaveKeyMappings;
  keyboardTemporaryOctaveKeyMappings: KeyboardOctaveKeyMappings;
  setKeyboardNoteMappings: (mappings: KeyboardNoteMapping[]) => void;
  setKeyboardOctaveKeyMappings: (mappings: KeyboardOctaveKeyMappings) => void;
  setKeyboardTemporaryOctaveKeyMappings: (
    mappings: KeyboardOctaveKeyMappings,
  ) => void;
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
  keyboardNoteMappings,
  keyboardOctaveKeyMappings,
  keyboardTemporaryOctaveKeyMappings,
  setKeyboardNoteMappings,
  setKeyboardOctaveKeyMappings,
  setKeyboardTemporaryOctaveKeyMappings,
}: UseKeyboardControlSettingsOptions) {
  function assignKeyboardMappingKey(
    targetSlot: KeyboardMappingSlot,
    key: string,
  ) {
    const nextMappings = getKeyboardMappingsWithAssignedKey(
      {
        noteMappings: keyboardNoteMappings,
        octaveKeyMappings: keyboardOctaveKeyMappings,
        temporaryOctaveKeyMappings: keyboardTemporaryOctaveKeyMappings,
      },
      targetSlot,
      key,
    );

    setKeyboardNoteMappings(nextMappings.noteMappings);
    setKeyboardOctaveKeyMappings(nextMappings.octaveKeyMappings);
    setKeyboardTemporaryOctaveKeyMappings(
      nextMappings.temporaryOctaveKeyMappings,
    );
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
    setKeyboardNoteMappings(DEFAULT_KEYBOARD_NOTE_MAPPINGS);
    setKeyboardOctaveKeyMappings(DEFAULT_KEYBOARD_OCTAVE_MAPPINGS);
    setKeyboardTemporaryOctaveKeyMappings(
      DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_MAPPINGS,
    );
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
