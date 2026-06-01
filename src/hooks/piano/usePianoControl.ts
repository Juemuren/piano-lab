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
import useMidiControl from './useMidiControl';

const DEFAULT_DURATION_SECONDS = 1;
const DEFAULT_VOLUME = 100;
const DEFAULT_KEYBOARD_OCTAVE = 4;
const MIN_KEYBOARD_OCTAVE = 1;
const MAX_KEYBOARD_OCTAVE = 7;

const KEYBOARD_OCTAVE_DOWN_KEY = 'z';
const KEYBOARD_OCTAVE_UP_KEY = 'x';
const TOUCH_MOUSE_EVENT_IGNORE_MS = 1000;
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
  selectedMidiInputId?: string,
) {
  const synthEngine = useSynthEngine();
  const {
    isKeyboardControlEnabled,
    isMouseControlEnabled,
    isTouchControlEnabled,
    isMidiControlEnabled,
  } = useAppSettings();
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const [keyboardOctave, setKeyboardOctave] = useState(DEFAULT_KEYBOARD_OCTAVE);
  const pressedKeysRef = useRef<Set<number>>(new Set());
  const keyboardOctaveRef = useRef(DEFAULT_KEYBOARD_OCTAVE);
  const activeKeyboardNotesRef = useRef<Map<string, number>>(new Map());
  const activeMouseNotesRef = useRef<Set<number>>(new Set());
  const activeTouchNotesRef = useRef<Set<number>>(new Set());
  const lastTouchEventAtRef = useRef(0);

  const playNote = useCallback(
    (note: number) => {
      synthEngine.playNote(note, DEFAULT_DURATION_SECONDS, DEFAULT_VOLUME);
    },
    [synthEngine],
  );

  useEffect(() => {
    keyboardOctaveRef.current = keyboardOctave;
  }, [keyboardOctave]);

  const syncPressedKeys = useCallback(() => {
    const newSet = new Set<number>();

    for (const note of activeKeyboardNotesRef.current.values()) {
      newSet.add(note);
    }
    for (const note of activeMouseNotesRef.current) {
      newSet.add(note);
    }
    for (const note of activeTouchNotesRef.current) {
      newSet.add(note);
    }

    pressedKeysRef.current = newSet;
    setPressedKeys(newSet);
  }, []);

  const playPressedKey = useCallback(
    (note: number) => {
      playNote(note);
      onNoteInput?.(note);
    },
    [onNoteInput, playNote],
  );

  const playMidiPressedKey = useCallback(
    (note: number, velocity: number) => {
      if (!pressedKeysRef.current.has(note)) {
        synthEngine.playNote(note, DEFAULT_DURATION_SECONDS, velocity);
        onNoteInput?.(note);
      }
    },
    [onNoteInput, synthEngine],
  );

  const midiControl = useMidiControl({
    enabled: isMidiControlEnabled,
    selectedInputId: selectedMidiInputId,
    onNoteOn: playMidiPressedKey,
  });

  const handleKeyDown = useCallback(
    (e: MouseEvent | TouchEvent, note: number) => {
      const isTouchEvent = 'touches' in e;
      if (isTouchEvent) {
        lastTouchEventAtRef.current = Date.now();
        if (!isTouchControlEnabled) {
          return;
        }
        e.preventDefault();
        const shouldPlay = !pressedKeysRef.current.has(note);
        activeTouchNotesRef.current = new Set(activeTouchNotesRef.current).add(
          note,
        );
        if (shouldPlay) {
          playPressedKey(note);
        }
        syncPressedKeys();
      } else {
        e.preventDefault();
        if (
          Date.now() - lastTouchEventAtRef.current <
          TOUCH_MOUSE_EVENT_IGNORE_MS
        ) {
          return;
        }
        if (!isMouseControlEnabled) {
          return;
        }
        const shouldPlay = !pressedKeysRef.current.has(note);
        activeMouseNotesRef.current = new Set(activeMouseNotesRef.current).add(
          note,
        );
        if (shouldPlay) {
          playPressedKey(note);
        }
        syncPressedKeys();
      }
    },
    [
      isMouseControlEnabled,
      isTouchControlEnabled,
      playPressedKey,
      syncPressedKeys,
    ],
  );

  const handleKeyUp = useCallback(
    (e: MouseEvent | TouchEvent, note: number) => {
      const isTouchEvent = 'touches' in e;
      if (isTouchEvent) {
        lastTouchEventAtRef.current = Date.now();
        if (!isTouchControlEnabled) {
          return;
        }
        e.preventDefault();
        const newSet = new Set(activeTouchNotesRef.current);
        newSet.delete(note);
        activeTouchNotesRef.current = newSet;
      } else {
        e.preventDefault();
        if (
          Date.now() - lastTouchEventAtRef.current <
          TOUCH_MOUSE_EVENT_IGNORE_MS
        ) {
          return;
        }
        if (!isMouseControlEnabled) {
          return;
        }
        const newSet = new Set(activeMouseNotesRef.current);
        newSet.delete(note);
        activeMouseNotesRef.current = newSet;
      }

      syncPressedKeys();
    },
    [isMouseControlEnabled, isTouchControlEnabled, syncPressedKeys],
  );

  useEffect(() => {
    let shouldSync = false;

    if (!isMouseControlEnabled && activeMouseNotesRef.current.size > 0) {
      activeMouseNotesRef.current = new Set();
      shouldSync = true;
    }
    if (!isTouchControlEnabled && activeTouchNotesRef.current.size > 0) {
      activeTouchNotesRef.current = new Set();
      shouldSync = true;
    }

    if (shouldSync) {
      syncPressedKeys();
    }
  }, [isMouseControlEnabled, isTouchControlEnabled, syncPressedKeys]);

  useEffect(() => {
    if (!isKeyboardControlEnabled) {
      const keyboardNotes = activeKeyboardNotesRef.current;
      if (keyboardNotes.size > 0) {
        keyboardNotes.clear();
        syncPressedKeys();
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
      const shouldPlay = !pressedKeysRef.current.has(note);
      activeKeyboardNotesRef.current.set(key, note);
      if (shouldPlay) {
        playPressedKey(note);
      }
      syncPressedKeys();
    }

    function handleKeyboardKeyUp(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const note = activeKeyboardNotesRef.current.get(key);
      if (note === undefined) {
        return;
      }

      e.preventDefault();
      activeKeyboardNotesRef.current.delete(key);
      syncPressedKeys();
    }

    window.addEventListener('keydown', handleKeyboardKeyDown);
    window.addEventListener('keyup', handleKeyboardKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyboardKeyDown);
      window.removeEventListener('keyup', handleKeyboardKeyUp);
    };
  }, [isKeyboardControlEnabled, playPressedKey, syncPressedKeys]);

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
    (note: number) =>
      pressedKeys.has(note) ||
      midiControl.activeNotes.has(note) ||
      playingNotes.has(note),
    [midiControl.activeNotes, pressedKeys, playingNotes],
  );

  return {
    whiteKeys,
    blackKeys,
    keyHints,
    isKeyPressed,
    midiControl,
    isMouseControlEnabled,
    handleKeyDown,
    handleKeyUp,
  };
}

export default usePianoControl;
