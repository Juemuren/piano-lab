import type { KeyboardEvent } from 'react';
import type {
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../../constants/keyboard';
import {
  DEFAULT_KEYBOARD_NOTE_MAPPINGS,
  DEFAULT_KEYBOARD_OCTAVE_KEY_MAPPINGS,
  DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_KEY_MAPPINGS,
} from '../../constants/keyboard';
import { normalizeKeyboardControlKey } from '../../utils/keyboard';

type KeyboardOctaveDirection = keyof KeyboardOctaveKeyMappings;

type KeyboardMappingSlot =
  | { offset: number; type: 'note' }
  | { direction: KeyboardOctaveDirection; type: 'octave' }
  | { direction: KeyboardOctaveDirection; type: 'temporaryOctave' };

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

function isClearKey(key: string) {
  return key === 'Backspace' || key === 'Delete' || key === 'Escape';
}

function handleMappingKeyDown(
  e: KeyboardEvent<HTMLInputElement>,
  setKey: (key: string) => void,
) {
  e.preventDefault();
  e.stopPropagation();

  if (isClearKey(e.key)) {
    setKey('');
    return;
  }

  const key = normalizeKeyboardControlKey(e.key);
  if (key !== null) {
    setKey(key);
  }
}

function isSameSlot(
  slot: KeyboardMappingSlot,
  targetSlot: KeyboardMappingSlot,
) {
  if (slot.type !== targetSlot.type) {
    return false;
  }

  if (slot.type === 'note' && targetSlot.type === 'note') {
    return slot.offset === targetSlot.offset;
  }

  if (slot.type !== 'note' && targetSlot.type !== 'note') {
    return slot.direction === targetSlot.direction;
  }

  return false;
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
    const nextNoteMappings = keyboardNoteMappings.map((mapping) => {
      const slot: KeyboardMappingSlot = {
        offset: mapping.offset,
        type: 'note',
      };

      if (isSameSlot(slot, targetSlot)) {
        return { ...mapping, key };
      }

      if (key && mapping.key === key) {
        return { ...mapping, key: '' };
      }

      return mapping;
    });

    function getNextOctaveKeyMappings(
      type: 'octave' | 'temporaryOctave',
      mappings: KeyboardOctaveKeyMappings,
    ) {
      const nextMappings = { ...mappings };

      for (const direction of Object.keys(
        mappings,
      ) as KeyboardOctaveDirection[]) {
        const slot: KeyboardMappingSlot = { direction, type };
        const currentKey = mappings[direction];

        if (isSameSlot(slot, targetSlot)) {
          nextMappings[direction] = key;
        } else if (key && currentKey === key) {
          nextMappings[direction] = '';
        }
      }

      return nextMappings;
    }

    setKeyboardNoteMappings(nextNoteMappings);
    setKeyboardOctaveKeyMappings(
      getNextOctaveKeyMappings('octave', keyboardOctaveKeyMappings),
    );
    setKeyboardTemporaryOctaveKeyMappings(
      getNextOctaveKeyMappings(
        'temporaryOctave',
        keyboardTemporaryOctaveKeyMappings,
      ),
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
    setKeyboardOctaveKeyMappings(DEFAULT_KEYBOARD_OCTAVE_KEY_MAPPINGS);
    setKeyboardTemporaryOctaveKeyMappings(
      DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_KEY_MAPPINGS,
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
