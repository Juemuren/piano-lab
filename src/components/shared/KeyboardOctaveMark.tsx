import type {
  KeyboardOctaveDirection,
  KeyboardOctaveMappingType,
} from '../../utils/keyboard';

const KEYBOARD_OCTAVE_MARKS = {
  octave: {
    downKey: '⇓',
    upKey: '⇑',
  },
  temporaryOctave: {
    downKey: '↓',
    upKey: '↑',
  },
};

interface KeyboardOctaveMarkProps {
  direction: KeyboardOctaveDirection;
  type: KeyboardOctaveMappingType;
}

function KeyboardOctaveMark({ direction, type }: KeyboardOctaveMarkProps) {
  return KEYBOARD_OCTAVE_MARKS[type][direction];
}

export default KeyboardOctaveMark;
