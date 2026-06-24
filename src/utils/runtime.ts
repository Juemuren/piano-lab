export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function numberOrDefault(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function booleanOrDefault(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

export function stringOrDefault(value: unknown, fallback: string) {
  return typeof value === 'string' && value ? value : fallback;
}

export function unionOrDefault<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fallback: T,
) {
  return typeof value === 'string' && allowedValues.includes(value as T)
    ? (value as T)
    : fallback;
}

export function numberArrayOrDefault(value: unknown, fallback: number[]) {
  if (!Array.isArray(value)) return fallback;
  const numbers = value.filter(
    (item): item is number => typeof item === 'number' && Number.isFinite(item),
  );

  return numbers.length > 0 ? numbers : fallback;
}
