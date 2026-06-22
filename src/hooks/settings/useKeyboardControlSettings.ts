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
  return key === 'Backspace' || key === 'Delete';
}

function useKeyboardControlSettings({
  keyboardNoteMappings,
  keyboardOctaveKeyMappings,
  keyboardTemporaryOctaveKeyMappings,
  setKeyboardNoteMappings,
  setKeyboardOctaveKeyMappings,
  setKeyboardTemporaryOctaveKeyMappings,
}: UseKeyboardControlSettingsOptions) {
  function clearNoteMappingKey(key: string) {
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

  function setOctaveMappingKeyValue(
    mappings: KeyboardOctaveKeyMappings,
    setMappings: (nextMappings: KeyboardOctaveKeyMappings) => void,
    direction: KeyboardOctaveDirection,
    key: string,
  ) {
    setMappings({
      ...mappings,
      [direction]: key,
      ...(key && direction === 'downKey' && mappings.upKey === key
        ? { upKey: '' }
        : {}),
      ...(key && direction === 'upKey' && mappings.downKey === key
        ? { downKey: '' }
        : {}),
    });
  }

  function setOctaveMappingKey(
    direction: KeyboardOctaveDirection,
    key: string,
  ) {
    setOctaveMappingKeyValue(
      keyboardOctaveKeyMappings,
      setKeyboardOctaveKeyMappings,
      direction,
      key,
    );

    if (key) {
      clearNoteMappingKey(key);
      if (keyboardTemporaryOctaveKeyMappings.downKey === key) {
        setKeyboardTemporaryOctaveKeyMappings({
          ...keyboardTemporaryOctaveKeyMappings,
          downKey: '',
        });
      }
      if (keyboardTemporaryOctaveKeyMappings.upKey === key) {
        setKeyboardTemporaryOctaveKeyMappings({
          ...keyboardTemporaryOctaveKeyMappings,
          upKey: '',
        });
      }
    }
  }

  function setTemporaryOctaveMappingKey(
    direction: KeyboardOctaveDirection,
    key: string,
  ) {
    setOctaveMappingKeyValue(
      keyboardTemporaryOctaveKeyMappings,
      setKeyboardTemporaryOctaveKeyMappings,
      direction,
      key,
    );

    if (key) {
      clearNoteMappingKey(key);
      if (keyboardOctaveKeyMappings.downKey === key) {
        setKeyboardOctaveKeyMappings({
          ...keyboardOctaveKeyMappings,
          downKey: '',
        });
      }
      if (keyboardOctaveKeyMappings.upKey === key) {
        setKeyboardOctaveKeyMappings({
          ...keyboardOctaveKeyMappings,
          upKey: '',
        });
      }
    }
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
      keyboardTemporaryOctaveKeyMappings.downKey,
      keyboardTemporaryOctaveKeyMappings.upKey,
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

  function handleTemporaryOctaveKeyDown(
    direction: KeyboardOctaveDirection,
    e: KeyboardEvent<HTMLInputElement>,
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (isClearKey(e.key)) {
      setTemporaryOctaveMappingKey(direction, '');
      return;
    }

    const key = normalizeKeyboardControlKey(e.key, { allowModifierKeys: true });
    if (key === null) {
      return;
    }

    setTemporaryOctaveMappingKey(direction, key);
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
