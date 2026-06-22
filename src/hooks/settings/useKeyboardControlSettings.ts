import type { KeyboardEvent } from 'react';
import type {
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../../constants/keyboard';
import {
  DEFAULT_KEYBOARD_NOTE_MAPPINGS,
  DEFAULT_KEYBOARD_OCTAVE_KEY_MAPPINGS,
} from '../../constants/keyboard';
import { normalizeKeyboardControlKey } from '../../utils/keyboard';

type KeyboardOctaveDirection = keyof KeyboardOctaveKeyMappings;

interface UseKeyboardControlSettingsOptions {
  keyboardNoteMappings: KeyboardNoteMapping[];
  keyboardOctaveKeyMappings: KeyboardOctaveKeyMappings;
  setKeyboardNoteMappings: (mappings: KeyboardNoteMapping[]) => void;
  setKeyboardOctaveKeyMappings: (mappings: KeyboardOctaveKeyMappings) => void;
}

function isClearKey(key: string) {
  return key === 'Backspace' || key === 'Delete';
}

function useKeyboardControlSettings({
  keyboardNoteMappings,
  keyboardOctaveKeyMappings,
  setKeyboardNoteMappings,
  setKeyboardOctaveKeyMappings,
}: UseKeyboardControlSettingsOptions) {
  function setNoteMappingKey(offset: number, key: string) {
    setKeyboardNoteMappings(
      keyboardNoteMappings.map((mapping) => {
        if (mapping.offset === offset) {
          return { ...mapping, key };
        }

        if (key && mapping.key === key) {
          return { ...mapping, key: '' };
        }

        return mapping;
      }),
    );
  }

  function setOctaveMappingKey(
    direction: KeyboardOctaveDirection,
    key: string,
  ) {
    setKeyboardOctaveKeyMappings({
      ...keyboardOctaveKeyMappings,
      [direction]: key,
      ...(key &&
      direction === 'downKey' &&
      keyboardOctaveKeyMappings.upKey === key
        ? { upKey: '' }
        : {}),
      ...(key &&
      direction === 'upKey' &&
      keyboardOctaveKeyMappings.downKey === key
        ? { downKey: '' }
        : {}),
    });

    if (!key) {
      return;
    }

    setKeyboardNoteMappings(
      keyboardNoteMappings.map((mapping) => {
        if (mapping.key === key) {
          return { ...mapping, key: '' };
        }

        return mapping;
      }),
    );
  }

  function handleNoteKeyDown(
    offset: number,
    e: KeyboardEvent<HTMLInputElement>,
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (isClearKey(e.key)) {
      setNoteMappingKey(offset, '');
      return;
    }

    const key = normalizeKeyboardControlKey(e.key, [
      keyboardOctaveKeyMappings.downKey,
      keyboardOctaveKeyMappings.upKey,
    ]);
    if (key === null) {
      return;
    }

    setNoteMappingKey(offset, key);
  }

  function handleOctaveKeyDown(
    direction: KeyboardOctaveDirection,
    e: KeyboardEvent<HTMLInputElement>,
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (isClearKey(e.key)) {
      setOctaveMappingKey(direction, '');
      return;
    }

    const key = normalizeKeyboardControlKey(e.key);
    if (key === null) {
      return;
    }

    setOctaveMappingKey(direction, key);
  }

  function resetKeyboardMappings() {
    setKeyboardNoteMappings(DEFAULT_KEYBOARD_NOTE_MAPPINGS);
    setKeyboardOctaveKeyMappings(DEFAULT_KEYBOARD_OCTAVE_KEY_MAPPINGS);
  }

  return {
    handleNoteKeyDown,
    handleOctaveKeyDown,
    resetKeyboardMappings,
    setNoteMappingKey,
    setOctaveMappingKey,
  };
}

export default useKeyboardControlSettings;
