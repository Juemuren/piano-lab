import { useCallback, useRef, useState } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';
import { appendPitchToAbc } from '../../services/abc/AbcInput';
import { useAppSettingsStore } from '../../stores/appSettingsStore';
import { usePianoDevicesStore } from '../../stores/pianoDevicesStore';
import { usePlayingNotesStore } from '../../stores/playingNotesStore';
import { useScoreStore } from '../../stores/scoreStore';
import {
  getPitchName,
  getPitchOctave,
  MAX_PIANO_PITCH,
  MIN_PIANO_PITCH,
} from '../../utils/pitch';
import useGamepadControl from './useGamepadControl';
import useKeyboardControl from './useKeyboardControl';
import useMidiControl from './useMidiControl';
import usePointerControl from './usePointerControl';

const DEFAULT_VOLUME = 100;

interface WhitePianoKey {
  char: string;
  note: number;
  number: number;
}

interface BlackPianoKey extends WhitePianoKey {
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
      char: name[0],
      note,
      number: octave,
    };

    if (name.includes('#')) {
      const whiteKeyIndex = whiteKeys.length;
      blackKeys.push({ ...keyInfo, position: whiteKeyIndex });
    } else {
      whiteKeys.push(keyInfo);
    }
  }

  return { blackKeys, whiteKeys };
}

const pianoKeys = getPianoKeys();

function useActivePianoNotes() {
  const [activeInputNotes, setActiveInputNotes] = useState<Set<number>>(
    new Set(),
  );
  const activeNoteCountsRef = useRef<Map<number, number>>(new Map());
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
    activateInputNote,
    activeInputNotes,
    activeMouseNotesRef,
    activeTouchNotesRef,
    isInputNoteActive,
    releaseInputNote,
  };
}

function usePianoControl() {
  const synthEngine = useSynthEngine();
  const setAbcContent = useScoreStore((state) => state.setAbcContent);
  const playingNotes = usePlayingNotesStore((state) => state.playingNotes);
  const selectedMidiInputId = usePianoDevicesStore(
    (state) => state.selectedMidiInputId,
  );
  const selectedGamepadIndex = usePianoDevicesStore(
    (state) => state.selectedGamepadIndex,
  );
  const {
    isPianoInputEnabled,
    isKeyboardControlEnabled,
    isKeyboardKeyHintEnabled,
    isKeyboardOctaveHintEnabled,
    keyboardControlMappings,
    isMouseControlEnabled,
    isTouchControlEnabled,
    isMidiControlEnabled,
    isGamepadControlEnabled,
  } = useAppSettingsStore();
  const {
    activeInputNotes,
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
      if (isPianoInputEnabled) {
        setAbcContent((content) =>
          appendPitchToAbc(
            content,
            note,
            (performance.now() - startedAt) / 1000,
          ),
        );
      }
    },
    [isPianoInputEnabled, releaseInputNote, setAbcContent, synthEngine],
  );

  const { keyHints, octaveHints } = useKeyboardControl({
    enabled: isKeyboardControlEnabled,
    keyboardControlMappings,
    onNotePress: startInputNote,
    onNoteRelease: stopInputNote,
    showKeyHints: isKeyboardKeyHintEnabled,
    showOctaveHints: isKeyboardOctaveHintEnabled,
  });

  const gamepadNotes = useGamepadControl({
    enabled: isGamepadControlEnabled,
    onNotePress: startInputNote,
    onNoteRelease: stopInputNote,
    selectedGamepadIndex,
  });

  const startMidiPressedKey = useCallback(
    (note: number, velocity: number) => {
      startInputNote(note, velocity);
    },
    [startInputNote],
  );

  useMidiControl({
    enabled: isMidiControlEnabled,
    onNoteOff: stopInputNote,
    onNoteOn: startMidiPressedKey,
    selectedInputId: selectedMidiInputId,
  });

  const { handleKeyDown, handleKeyUp } = usePointerControl({
    activeMouseNotesRef,
    activeTouchNotesRef,
    isMouseControlEnabled,
    isTouchControlEnabled,
    onNotePress: startInputNote,
    onNoteRelease: stopInputNote,
  });

  const { whiteKeys, blackKeys } = pianoKeys;

  const isKeyPressed = useCallback(
    (note: number) => activeInputNotes.has(note) || playingNotes.has(note),
    [activeInputNotes, playingNotes],
  );

  return {
    blackKeys,
    gamepadNotes,
    handleKeyDown,
    handleKeyUp,
    isKeyPressed,
    isMouseControlEnabled,
    keyHints,
    octaveHints,
    whiteKeys,
  };
}

export default usePianoControl;
