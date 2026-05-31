import { type MouseEvent, type TouchEvent, useCallback, useState } from 'react';
import { useSynthEngine } from '../../contexts/useSynthEngine';
import {
  getPitchName,
  getPitchOctave,
  MIN_PIANO_PITCH,
  MAX_PIANO_PITCH,
} from '../../utils/pitch';

const DEFAULT_DURATION_SECONDS = 1;
const DEFAULT_VOLUME = 100;

interface PianoKey {
  note: number;
  char: string;
  number: number;
}

export type WhitePianoKey = PianoKey;

export interface BlackPianoKey extends PianoKey {
  position: number;
}

function getPianoKeys() {
  const keyNums = MAX_PIANO_PITCH - MIN_PIANO_PITCH + 1;
  const whiteKeys: WhitePianoKey[] = [];
  const blackKeys: BlackPianoKey[] = [];

  for (let index = 0; index < keyNums; index++) {
    const note = MIN_PIANO_PITCH + index;
    const name = getPitchName(note);
    const octave = getPitchOctave(note);
    const keyInfo = {
      note,
      char: name[0],
      number: octave,
    };

    if (name.includes('#')) {
      const whiteKeyIndex = whiteKeys.length;
      blackKeys.push({ ...keyInfo, position: whiteKeyIndex });
    } else {
      whiteKeys.push(keyInfo);
    }
  }

  return { whiteKeys, blackKeys };
}

const pianoKeys = getPianoKeys();

function usePianoControl(playingNotes: Set<number>) {
  const synthEngine = useSynthEngine();
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());

  const playNote = useCallback(
    (note: number) => {
      synthEngine.playNote(note, DEFAULT_DURATION_SECONDS, DEFAULT_VOLUME);
    },
    [synthEngine],
  );

  const handleKeyDown = useCallback(
    (e: MouseEvent | TouchEvent, note: number) => {
      if (!('touches' in e)) {
        e.preventDefault();
      }
      setPressedKeys((prev) => new Set(prev).add(note));
      playNote(note);
    },
    [playNote],
  );

  const handleKeyUp = useCallback(
    (e: MouseEvent | TouchEvent, note: number) => {
      e.preventDefault();
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    },
    [],
  );

  const { whiteKeys, blackKeys } = pianoKeys;

  const isKeyPressed = useCallback(
    (note: number) => pressedKeys.has(note) || playingNotes.has(note),
    [pressedKeys, playingNotes],
  );

  return {
    whiteKeys,
    blackKeys,
    isKeyPressed,
    handleKeyDown,
    handleKeyUp,
  };
}

export default usePianoControl;
