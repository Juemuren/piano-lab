import type {
  KeyboardControlMappings,
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../constants/keyboard';
import {
  KEYBOARD_MAPPING_CLEAR_KEYS,
  MAX_KEYBOARD_OCTAVE,
  MIN_KEYBOARD_OCTAVE,
} from '../constants/keyboard';
import { getBasePitchByOctave } from './pitch';

export type KeyboardOctaveDirection = keyof KeyboardOctaveKeyMappings;
export type KeyboardOctaveMappingType = 'octave' | 'temporaryOctave';

export type KeyboardMappingSlot =
  | { offset: number; type: 'note' }
  | {
      direction: KeyboardOctaveDirection;
      type: KeyboardOctaveMappingType;
    };

export function normalizeKeyboardControlKey(key: string) {
  const normalizedKey = key.toLowerCase();
  return /^[a-z0-9]$/.test(normalizedKey) ? normalizedKey : null;
}

function isKeyboardMappingClearKey(key: string) {
  return KEYBOARD_MAPPING_CLEAR_KEYS.includes(key);
}

export function getKeyboardMappingKey(key: string) {
  return isKeyboardMappingClearKey(key) ? '' : normalizeKeyboardControlKey(key);
}

function isSameKeyboardMappingSlot(
  slot: KeyboardMappingSlot,
  targetSlot: KeyboardMappingSlot,
) {
  if (slot.type !== targetSlot.type) {
    return false;
  }

  switch (slot.type) {
    case 'note':
      return targetSlot.type === 'note' && slot.offset === targetSlot.offset;
    case 'octave':
    case 'temporaryOctave':
      return (
        targetSlot.type !== 'note' && slot.direction === targetSlot.direction
      );
  }
}

function assignOctaveMappingKey(
  mappings: KeyboardOctaveKeyMappings,
  type: KeyboardOctaveMappingType,
  targetSlot: KeyboardMappingSlot,
  key: string,
) {
  function assignKey(direction: KeyboardOctaveDirection) {
    const slot: KeyboardMappingSlot = { direction, type };
    const currentKey = mappings[direction];

    if (isSameKeyboardMappingSlot(slot, targetSlot)) {
      return key;
    }

    return key && currentKey === key ? '' : currentKey;
  }

  return {
    downKey: assignKey('downKey'),
    upKey: assignKey('upKey'),
  };
}

function assignNoteMappingKey(
  mappings: KeyboardNoteMapping[],
  targetSlot: KeyboardMappingSlot,
  key: string,
) {
  return mappings.map((mapping) => {
    const slot: KeyboardMappingSlot = {
      offset: mapping.offset,
      type: 'note',
    };

    if (isSameKeyboardMappingSlot(slot, targetSlot)) {
      return { ...mapping, key };
    }

    return key && mapping.key === key ? { ...mapping, key: '' } : mapping;
  });
}

export function getKeyboardMappingsWithAssignedKey(
  mappings: KeyboardControlMappings,
  targetSlot: KeyboardMappingSlot,
  key: string,
): KeyboardControlMappings {
  return {
    noteMappings: assignNoteMappingKey(mappings.noteMappings, targetSlot, key),
    octaveKeyMappings: assignOctaveMappingKey(
      mappings.octaveKeyMappings,
      'octave',
      targetSlot,
      key,
    ),
    temporaryOctaveKeyMappings: assignOctaveMappingKey(
      mappings.temporaryOctaveKeyMappings,
      'temporaryOctave',
      targetSlot,
      key,
    ),
  };
}

export function createKeyboardNoteMap(mappings: KeyboardNoteMapping[]) {
  return new Map(
    mappings.filter(({ key }) => key).map(({ key, offset }) => [key, offset]),
  );
}

export function clampKeyboardOctave(octave: number) {
  return Math.min(MAX_KEYBOARD_OCTAVE, Math.max(MIN_KEYBOARD_OCTAVE, octave));
}

export function getKeyboardOctaveWithTemporaryShift(
  octave: number,
  activeKeys: ReadonlySet<string>,
  mappings: KeyboardOctaveKeyMappings,
) {
  const octaveShift =
    (activeKeys.has(mappings.upKey) ? 1 : 0) -
    (activeKeys.has(mappings.downKey) ? 1 : 0);

  return clampKeyboardOctave(octave + octaveShift);
}

export function getKeyboardNote(
  key: string,
  octave: number,
  noteMap: ReadonlyMap<string, number>,
) {
  const offset = noteMap.get(key);
  return offset === undefined ? null : getBasePitchByOctave(octave) + offset;
}
