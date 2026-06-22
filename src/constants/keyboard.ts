export interface KeyboardNoteMapping {
  key: string;
  offset: number;
}

export const KEYBOARD_OCTAVE_DOWN_KEY = 'z';
export const KEYBOARD_OCTAVE_UP_KEY = 'x';

export const DEFAULT_KEYBOARD_NOTE_MAPPINGS: KeyboardNoteMapping[] = [
  { key: 'a', offset: -3 },
  { key: 'w', offset: -2 },
  { key: 's', offset: -1 },
  { key: 'd', offset: 0 },
  { key: 'r', offset: 1 },
  { key: 'f', offset: 2 },
  { key: 't', offset: 3 },
  { key: 'g', offset: 4 },
  { key: 'h', offset: 5 },
  { key: 'u', offset: 6 },
  { key: 'j', offset: 7 },
  { key: 'i', offset: 8 },
  { key: 'k', offset: 9 },
  { key: 'o', offset: 10 },
  { key: 'l', offset: 11 },
  { key: ';', offset: 12 },
];
