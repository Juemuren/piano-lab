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
  onNoteInput?: (pitch: number, duration: number) => void,
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
  const noteStartedAtRef = useRef<Map<number, number>>(new Map());

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

  const isNoteActive = useCallback((note: number) => {
    for (const activeNote of activeKeyboardNotesRef.current.values()) {
      if (activeNote === note) {
        return true;
      }
    }

    return (
      activeMouseNotesRef.current.has(note) ||
      activeTouchNotesRef.current.has(note)
    );
  }, []);

  const startPressedKey = useCallback(
    async (note: number, volume: number = DEFAULT_VOLUME) => {
      const startResult = await synthEngine.startNote(note, volume);
      if (!startResult.started) {
        return;
      }

      if (!isNoteActive(note)) {
        synthEngine.stopNote(note);
        return;
      }

      if (!noteStartedAtRef.current.has(note)) {
        noteStartedAtRef.current.set(note, startResult.startedAt);
      }
    },
    [isNoteActive, synthEngine],
  );

  const stopPressedKey = useCallback(
    (note: number) => {
      if (isNoteActive(note)) {
        return;
      }

      synthEngine.stopNote(note);
      const startedAt = noteStartedAtRef.current.get(note);
      if (startedAt === undefined) {
        return;
      }

      noteStartedAtRef.current.delete(note);
      onNoteInput?.(note, (performance.now() - startedAt) / 1000);
    },
    [isNoteActive, onNoteInput, synthEngine],
  );

  const { keyHints } = useKeyboardControl({
    enabled: isKeyboardControlEnabled,
    activeNotesRef: activeKeyboardNotesRef,
    pressedKeysRef,
    onNotePress: startPressedKey,
    onNoteRelease: stopPressedKey,
    onActiveNotesChange: syncPressedKeys,
  });

  const startMidiPressedKey = useCallback(
    (note: number, velocity: number) => {
      if (!pressedKeysRef.current.has(note)) {
        startPressedKey(note, velocity);
      }
    },
    [startPressedKey],
  );

  const midiControl = useMidiControl({
    enabled: isMidiControlEnabled,
    selectedInputId: selectedMidiInputId,
    onNoteOn: startMidiPressedKey,
    onNoteOff: stopPressedKey,
  });

  const { handleKeyDown, handleKeyUp } = usePointerControl({
    isMouseControlEnabled,
    isTouchControlEnabled,
    activeMouseNotesRef,
    activeTouchNotesRef,
    pressedKeysRef,
    onNotePress: startPressedKey,
    onNoteRelease: stopPressedKey,
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
