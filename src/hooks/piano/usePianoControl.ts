import { useCallback, useRef, useState } from 'react';
import { useAppSettings } from '../../contexts/useAppSettings';
import { useSynthEngine } from '../../contexts/useSynthEngine';
import {
  getPitchName,
  getPitchOctave,
  MIN_PIANO_PITCH,
  MAX_PIANO_PITCH,
} from '../../utils/pitch';
import useKeyboardControl from './useKeyboardControl';
import useMidiControl from './useMidiControl';
import usePointerControl from './usePointerControl';

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
  const pressedKeysRef = useRef<Set<number>>(new Set());
  const activeKeyboardNotesRef = useRef<Map<string, number>>(new Map());
  const activeMouseNotesRef = useRef<Set<number>>(new Set());
  const activeTouchNotesRef = useRef<Set<number>>(new Set());

  const playNote = useCallback(
    (note: number) => {
      synthEngine.playNote(note, DEFAULT_DURATION_SECONDS, DEFAULT_VOLUME);
    },
    [synthEngine],
  );

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

  const { keyHints } = useKeyboardControl({
    enabled: isKeyboardControlEnabled,
    activeNotesRef: activeKeyboardNotesRef,
    pressedKeysRef,
    onNotePress: playPressedKey,
    onActiveNotesChange: syncPressedKeys,
  });

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

  const { handleKeyDown, handleKeyUp } = usePointerControl({
    isMouseControlEnabled,
    isTouchControlEnabled,
    activeMouseNotesRef,
    activeTouchNotesRef,
    pressedKeysRef,
    onNotePress: playPressedKey,
    onActiveNotesChange: syncPressedKeys,
  });

  const { whiteKeys, blackKeys } = pianoKeys;

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
