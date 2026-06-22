const MODIFIER_KEYS = ['control', 'shift'];

interface NormalizeKeyboardControlKeyOptions {
  allowModifierKeys?: boolean;
  reservedKeys?: string[];
}

export function normalizeKeyboardControlKey(
  key: string,
  options: NormalizeKeyboardControlKeyOptions | string[] = {},
) {
  const reservedKeys = Array.isArray(options) ? options : options.reservedKeys;
  const allowModifierKeys =
    !Array.isArray(options) && options.allowModifierKeys;
  const normalizedKey = key.toLowerCase();

  if (allowModifierKeys && MODIFIER_KEYS.includes(normalizedKey)) {
    return reservedKeys?.includes(normalizedKey) ? null : normalizedKey;
  }

  if (key.length !== 1) {
    return null;
  }

  if (reservedKeys?.includes(normalizedKey)) {
    return null;
  }

  return normalizedKey;
}

export function getKeyboardControlKeyLabel(key: string) {
  if (key === ' ') {
    return 'Space';
  }

  if (key === 'control') {
    return 'Ctrl';
  }

  if (key === 'shift') {
    return 'Shift';
  }

  return key.toUpperCase();
}
