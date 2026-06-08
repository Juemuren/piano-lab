import {
  KEYBOARD_OCTAVE_DOWN_KEY,
  KEYBOARD_OCTAVE_UP_KEY,
} from '../constants/keyboard';

export function normalizeKeyboardControlKey(key: string) {
  if (key.length !== 1) {
    return null;
  }

  const normalizedKey = key.toLowerCase();
  if (
    normalizedKey === KEYBOARD_OCTAVE_DOWN_KEY ||
    normalizedKey === KEYBOARD_OCTAVE_UP_KEY
  ) {
    return null;
  }

  return normalizedKey;
}

export function getKeyboardControlKeyLabel(key: string) {
  if (key === ' ') {
    return 'Space';
  }

  return key.toUpperCase();
}
