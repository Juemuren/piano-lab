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

function useActivePianoNotes() {
  const [activeInputNotes, setActiveInputNotes] = useState<Set<number>>(
    new Set(),
  );
  const activeNoteCountsRef = useRef<Map<number, number>>(new Map());
  const activeKeyboardNotesRef = useRef<Map<string, number>>(new Map());
  const activeMouseNotesRef = useRef<Set<number>>(new Set());
  const activeTouchNotesRef = useRef<Set<number>>(new Set());

  const activateInputNote = useCallback((note: number) => {
    const currentCount = activeNoteCountsRef.current.get(note) || 0;
    activeNoteCountsRef.current.set(note, currentCount + 1);

    if (currentCount === 0) {
      setActiveInputNotes((current) => new Set(current).add(note));
      return true;
    }

    return false;
  }, []);

  const releaseInputNote = useCallback((note: number) => {
    const currentCount = activeNoteCountsRef.current.get(note) || 0;
    if (currentCount > 1) {
      activeNoteCountsRef.current.set(note, currentCount - 1);
      return true;
    }

    activeNoteCountsRef.current.delete(note);
    setActiveInputNotes((current) => {
      const nextNotes = new Set(current);
      nextNotes.delete(note);
      return nextNotes;
    });
    return false;
  }, []);

  const isInputNoteActive = useCallback((note: number) => {
    return activeNoteCountsRef.current.has(note);
  }, []);

  return {
    activeInputNotes,
    activeKeyboardNotesRef,
    activeMouseNotesRef,
    activeTouchNotesRef,
    activateInputNote,
    releaseInputNote,
    isInputNoteActive,
  };
}

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
  const {
    activeInputNotes,
    activeKeyboardNotesRef,
    activeMouseNotesRef,
    activeTouchNotesRef,
    activateInputNote,
    releaseInputNote,
    isInputNoteActive,
  } = useActivePianoNotes();
  const noteStartedAtRef = useRef<Map<number, number>>(new Map());

  const startInputNote = useCallback(
    async (note: number, volume: number = DEFAULT_VOLUME) => {
      const shouldStart = activateInputNote(note);
      if (!shouldStart) {
        return;
      }

      const startResult = await synthEngine.startNote(note, volume);
      if (!startResult.started) {
        return;
      }

      if (!isInputNoteActive(note)) {
        synthEngine.stopNote(note);
        return;
      }

      if (!noteStartedAtRef.current.has(note)) {
        noteStartedAtRef.current.set(note, startResult.startedAt);
      }
    },
    [activateInputNote, isInputNoteActive, synthEngine],
  );

  const stopInputNote = useCallback(
    (note: number) => {
      const isStillActive = releaseInputNote(note);
      if (isStillActive) {
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
    [onNoteInput, releaseInputNote, synthEngine],
  );

  const { keyHints } = useKeyboardControl({
    enabled: isKeyboardControlEnabled,
    activeNotesRef: activeKeyboardNotesRef,
    onNotePress: startInputNote,
    onNoteRelease: stopInputNote,
  });

  const startMidiPressedKey = useCallback(
    (note: number, velocity: number) => {
      startInputNote(note, velocity);
    },
    [startInputNote],
  );

  const midiControl = useMidiControl({
    enabled: isMidiControlEnabled,
    selectedInputId: selectedMidiInputId,
    onNoteOn: startMidiPressedKey,
    onNoteOff: stopInputNote,
  });

  const { handleKeyDown, handleKeyUp } = usePointerControl({
    isMouseControlEnabled,
    isTouchControlEnabled,
    activeMouseNotesRef,
    activeTouchNotesRef,
    onNotePress: startInputNote,
    onNoteRelease: stopInputNote,
  });

  const { whiteKeys, blackKeys } = pianoKeys;

  const isKeyPressed = useCallback(
    (note: number) => activeInputNotes.has(note) || playingNotes.has(note),
    [activeInputNotes, playingNotes],
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
