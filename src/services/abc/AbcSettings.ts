export interface PianoInputSettings {
  defaultNoteLength: string;
  keySignature: string;
  tempo: number;
  timeSignature: string;
}

export const DEFAULT_PIANO_INPUT_SETTINGS: PianoInputSettings = {
  defaultNoteLength: '1/8',
  keySignature: 'C',
  tempo: 180,
  timeSignature: '4/4',
};

export const DEFAULT_NOTE_LENGTH_OPTIONS = ['1/4', '1/8', '1/16'];

export const TIME_SIGNATURE_OPTIONS = [
  '2/4',
  '3/4',
  '4/4',
  '6/8',
  '9/8',
  '12/8',
];

export const KEY_ACCIDENTALS = [
  { offset: 0, root: 'C' },
  { offset: 0, root: 'Am' },
  { offset: 1, root: 'G' },
  { offset: 1, root: 'Em' },
  { offset: 2, root: 'D' },
  { offset: 2, root: 'Bm' },
  { offset: 3, root: 'A' },
  { offset: 3, root: 'F#m' },
  { offset: 4, root: 'E' },
  { offset: 4, root: 'C#m' },
  { offset: 5, root: 'B' },
  { offset: 5, root: 'G#m' },
  { offset: 6, root: 'F#' },
  { offset: 6, root: 'D#m' },
  { offset: 7, root: 'C#' },
  { offset: 7, root: 'A#m' },
  { offset: -1, root: 'F' },
  { offset: -1, root: 'Dm' },
  { offset: -2, root: 'Bb' },
  { offset: -2, root: 'Gm' },
  { offset: -3, root: 'Eb' },
  { offset: -3, root: 'Cm' },
  { offset: -4, root: 'Ab' },
  { offset: -4, root: 'Fm' },
  { offset: -5, root: 'Db' },
  { offset: -5, root: 'Bbm' },
  { offset: -6, root: 'Gb' },
  { offset: -6, root: 'Ebm' },
  { offset: -7, root: 'Cb' },
  { offset: -7, root: 'Abm' },
] as const;

export const KEY_SIGNATURE_OPTIONS = [
  ...KEY_ACCIDENTALS.map(({ root }) => root),
] as const;
