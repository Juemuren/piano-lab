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
export const KEY_SIGNATURE_OPTIONS = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'F#',
  'C#',
  'F',
  'Bb',
  'Eb',
  'Ab',
  'Db',
  'Gb',
  'Cb',
];
