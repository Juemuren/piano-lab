import {
  type MouseEvent,
  type TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAppSettings } from '../../contexts/useAppSettings';
import { useSynthEngine } from '../../contexts/useSynthEngine';
import {
  getPitchName,
  getPitchOctave,
  getBasePitchByOctave,
  MIN_PIANO_PITCH,
  MAX_PIANO_PITCH,
} from '../../utils/pitch';

const DEFAULT_DURATION_SECONDS = 1;
const DEFAULT_VOLUME = 100;
const DEFAULT_KEYBOARD_OCTAVE = 4;
const MIN_KEYBOARD_OCTAVE = 1;
const MAX_KEYBOARD_OCTAVE = 7;

const KEYBOARD_OCTAVE_DOWN_KEY = 'z';
const KEYBOARD_OCTAVE_UP_KEY = 'x';
const KEYBOARD_NOTE_MAP: ReadonlyMap<
  string,
  { label: string; offset: number }
> = new Map([
  ['a', { label: 'A', offset: 0 }],
  ['w', { label: 'W', offset: 1 }],
  ['s', { label: 'S', offset: 2 }],
  ['e', { label: 'E', offset: 3 }],
  ['d', { label: 'D', offset: 4 }],
  ['f', { label: 'F', offset: 5 }],
  ['t', { label: 'T', offset: 6 }],
  ['g', { label: 'G', offset: 7 }],
  ['y', { label: 'Y', offset: 8 }],
  ['h', { label: 'H', offset: 9 }],
  ['u', { label: 'U', offset: 10 }],
  ['j', { label: 'J', offset: 11 }],
  ['k', { label: 'K', offset: 12 }],
]);

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

function getKeyboardNote(key: string, octave: number) {
  const keyboardNote = KEYBOARD_NOTE_MAP.get(key);
  if (!keyboardNote) {
    return null;
  }

  return getBasePitchByOctave(octave) + keyboardNote.offset;
}

function clampKeyboardOctave(octave: number) {
  return Math.min(MAX_KEYBOARD_OCTAVE, Math.max(MIN_KEYBOARD_OCTAVE, octave));
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"]'),
  );
}

function usePianoControl(
  playingNotes: Set<number>,
  onNoteInput?: (pitch: number) => void,
) {
  const synthEngine = useSynthEngine();
  const { isKeyboardControlEnabled } = useAppSettings();
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const [keyboardOctave, setKeyboardOctave] = useState(DEFAULT_KEYBOARD_OCTAVE);
  const pressedKeysRef = useRef<Set<number>>(new Set());
  const keyboardOctaveRef = useRef(DEFAULT_KEYBOARD_OCTAVE);
  const activeKeyboardNotesRef = useRef<Map<string, number>>(new Map());

  const playNote = useCallback(
    (note: number) => {
      synthEngine.playNote(note, DEFAULT_DURATION_SECONDS, DEFAULT_VOLUME);
    },
    [synthEngine],
  );

  useEffect(() => {
    keyboardOctaveRef.current = keyboardOctave;
  }, [keyboardOctave]);

  const handleKeyDown = useCallback(
    (e: MouseEvent | TouchEvent, note: number) => {
      if (!('touches' in e)) {
        e.preventDefault();
      }
      if (pressedKeysRef.current.has(note)) {
        return;
      }

      pressedKeysRef.current = new Set(pressedKeysRef.current).add(note);
      setPressedKeys(pressedKeysRef.current);
      playNote(note);
      onNoteInput?.(note);
    },
    [onNoteInput, playNote],
  );

  const handleKeyUp = useCallback(
    (e: MouseEvent | TouchEvent, note: number) => {
      e.preventDefault();
      const newSet = new Set(pressedKeysRef.current);
      newSet.delete(note);
      pressedKeysRef.current = newSet;
      setPressedKeys(newSet);
    },
    [],
  );

  useEffect(() => {
    if (!isKeyboardControlEnabled) {
      const keyboardNotes = activeKeyboardNotesRef.current;
      if (keyboardNotes.size > 0) {
        const newSet = new Set(pressedKeysRef.current);
        for (const note of keyboardNotes.values()) {
          newSet.delete(note);
        }
        keyboardNotes.clear();
        pressedKeysRef.current = newSet;
        setPressedKeys(newSet);
      }
      return;
    }

    function handleKeyboardKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e.target) || e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === KEYBOARD_OCTAVE_DOWN_KEY || key === KEYBOARD_OCTAVE_UP_KEY) {
        e.preventDefault();
        if (!e.repeat) {
          const octaveDelta = key === KEYBOARD_OCTAVE_UP_KEY ? +1 : -1;
          setKeyboardOctave((current) =>
            clampKeyboardOctave(current + octaveDelta),
          );
        }
        return;
      }

      const note = getKeyboardNote(key, keyboardOctaveRef.current);
      if (note === null || activeKeyboardNotesRef.current.has(key)) {
        return;
      }
      e.preventDefault();
      activeKeyboardNotesRef.current.set(key, note);
      pressedKeysRef.current = new Set(pressedKeysRef.current).add(note);
      setPressedKeys(pressedKeysRef.current);
      playNote(note);
      onNoteInput?.(note);
    }

    function handleKeyboardKeyUp(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const note = activeKeyboardNotesRef.current.get(key);
      if (note === undefined) {
        return;
      }

      e.preventDefault();
      activeKeyboardNotesRef.current.delete(key);
      const newSet = new Set(pressedKeysRef.current);
      newSet.delete(note);
      pressedKeysRef.current = newSet;
      setPressedKeys(newSet);
    }

    window.addEventListener('keydown', handleKeyboardKeyDown);
    window.addEventListener('keyup', handleKeyboardKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyboardKeyDown);
      window.removeEventListener('keyup', handleKeyboardKeyUp);
    };
  }, [isKeyboardControlEnabled, onNoteInput, playNote]);

  const { whiteKeys, blackKeys } = pianoKeys;

  const keyHints = useMemo(() => {
    const hints = new Map<number, string>();

    if (!isKeyboardControlEnabled) {
      return hints;
    }

    const basePitch = getBasePitchByOctave(keyboardOctave);

    for (const { label, offset } of KEYBOARD_NOTE_MAP.values()) {
      hints.set(basePitch + offset, label);
    }

    return hints;
  }, [isKeyboardControlEnabled, keyboardOctave]);

  const isKeyPressed = useCallback(
    (note: number) => pressedKeys.has(note) || playingNotes.has(note),
    [pressedKeys, playingNotes],
  );

  return {
    whiteKeys,
    blackKeys,
    keyHints,
    isKeyPressed,
    handleKeyDown,
    handleKeyUp,
  };
}

export default usePianoControl;
