export function normalizeKeyboardControlKey(
  key: string,
  reservedKeys: string[] = [],
) {
  if (key.length !== 1) {
    return null;
  }

  const normalizedKey = key.toLowerCase();
  if (reservedKeys.includes(normalizedKey)) {
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
