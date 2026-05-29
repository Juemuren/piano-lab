import {
  type MouseEvent,
  type TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AudioEngine } from '../services/audio/AudioEngine';
import { getPitchName, getPitchOctave } from '../utils/pitch';

const AVERAGE_KEY_WIDTH_PX = 20;
const CENTER_NOTE = 66; // F#4
const MAX_KEY_NUMS = 85; // C1 -> C8
const MIN_KEY_NUMS = 13; // C4 -> C5
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

function getPianoKeys(windowWidth: number) {
  const numKeys = Math.min(
    MAX_KEY_NUMS,
    Math.max(MIN_KEY_NUMS, Math.floor(windowWidth / AVERAGE_KEY_WIDTH_PX)),
  );
  const startNote = CENTER_NOTE - Math.floor((numKeys - 1) / 2);
  const whiteKeys: WhitePianoKey[] = [];
  const blackKeys: BlackPianoKey[] = [];

  for (let index = 0; index < numKeys; index++) {
    const note = startNote + index;
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

function usePianoControl(audioEngine: AudioEngine, playingNotes: Set<number>) {
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    audioEngine.init();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [audioEngine]);

  const playNote = useCallback(
    (note: number) => {
      audioEngine.playNote(note, DEFAULT_DURATION_SECONDS, DEFAULT_VOLUME);
    },
    [audioEngine],
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

  const { whiteKeys, blackKeys } = useMemo(
    () => getPianoKeys(windowWidth),
    [windowWidth],
  );

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
