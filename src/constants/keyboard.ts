export interface KeyboardNoteMapping {
  key: string;
  offset: number;
}

export interface KeyboardOctaveKeyMappings {
  downKey: string;
  upKey: string;
}

export interface KeyboardControlMappings {
  noteMappings: KeyboardNoteMapping[];
  octaveKeyMappings: KeyboardOctaveKeyMappings;
  temporaryOctaveKeyMappings: KeyboardOctaveKeyMappings;
}

export const DEFAULT_KEYBOARD_OCTAVE = 4;
export const MIN_KEYBOARD_OCTAVE = 1;
export const MAX_KEYBOARD_OCTAVE = 7;
export const KEYBOARD_MAPPING_CLEAR_KEYS = ['Backspace', 'Delete', 'Escape'];

export const DEFAULT_KEYBOARD_OCTAVE_MAPPINGS: KeyboardOctaveKeyMappings = {
  downKey: 'a',
  upKey: 'l',
};

export const DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_MAPPINGS: KeyboardOctaveKeyMappings =
  {
    downKey: 's',
    upKey: 'k',
  };

export const DEFAULT_KEYBOARD_NOTE_MAPPINGS: KeyboardNoteMapping[] = [
  { key: 'q', offset: -3 },
  { key: '2', offset: -2 },
  { key: 'w', offset: -1 },
  { key: 'e', offset: 0 },
  { key: '4', offset: 1 },
  { key: 'r', offset: 2 },
  { key: '5', offset: 3 },
  { key: 't', offset: 4 },
  { key: 'y', offset: 5 },
  { key: '7', offset: 6 },
  { key: 'u', offset: 7 },
  { key: '8', offset: 8 },
  { key: 'i', offset: 9 },
  { key: '9', offset: 10 },
  { key: 'o', offset: 11 },
  { key: 'p', offset: 12 },
];

export const DEFAULT_KEYBOARD_CONTROL_MAPPINGS: KeyboardControlMappings = {
  noteMappings: DEFAULT_KEYBOARD_NOTE_MAPPINGS,
  octaveKeyMappings: DEFAULT_KEYBOARD_OCTAVE_MAPPINGS,
  temporaryOctaveKeyMappings: DEFAULT_KEYBOARD_TEMPORARY_OCTAVE_MAPPINGS,
};
