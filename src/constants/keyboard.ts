export interface KeyboardNoteMapping {
  offset: number;
  key: string;
}

export const KEYBOARD_OCTAVE_DOWN_KEY = 'z';
export const KEYBOARD_OCTAVE_UP_KEY = 'x';

export const DEFAULT_KEYBOARD_NOTE_MAPPINGS: KeyboardNoteMapping[] = [
  { offset: 0, key: 'a' },
  { offset: 1, key: 'w' },
  { offset: 2, key: 's' },
  { offset: 3, key: 'e' },
  { offset: 4, key: 'd' },
  { offset: 5, key: 'f' },
  { offset: 6, key: 't' },
  { offset: 7, key: 'g' },
  { offset: 8, key: 'y' },
  { offset: 9, key: 'h' },
  { offset: 10, key: 'u' },
  { offset: 11, key: 'j' },
  { offset: 12, key: 'k' },
];
