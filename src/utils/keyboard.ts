export function normalizeKeyboardControlKey(key: string) {
  const normalizedKey = key.toLowerCase();
  return /^[a-z0-9]$/.test(normalizedKey) ? normalizedKey : null;
}
