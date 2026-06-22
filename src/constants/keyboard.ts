export interface KeyboardNoteMapping {
  key: string;
  offset: number;
}

export const KEYBOARD_OCTAVE_DOWN_KEY = 'z';
export const KEYBOARD_OCTAVE_UP_KEY = 'x';

export const DEFAULT_KEYBOARD_NOTE_MAPPINGS: KeyboardNoteMapping[] = [
  { key: 'a', offset: 0 },
  { key: 'w', offset: 1 },
  { key: 's', offset: 2 },
  { key: 'e', offset: 3 },
  { key: 'd', offset: 4 },
  { key: 'f', offset: 5 },
  { key: 't', offset: 6 },
  { key: 'g', offset: 7 },
  { key: 'y', offset: 8 },
  { key: 'h', offset: 9 },
  { key: 'u', offset: 10 },
  { key: 'j', offset: 11 },
  { key: 'k', offset: 12 },
];
