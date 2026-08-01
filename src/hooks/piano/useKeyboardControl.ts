import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardControlMappings } from '../../constants/keyboard';
import { DEFAULT_KEYBOARD_OCTAVE } from '../../constants/keyboard';
import {
  clampKeyboardOctave,
  createKeyboardNoteMap,
  getKeyboardNote,
  getKeyboardOctaveWithTemporaryShift,
  normalizeKeyboardControlKey,
} from '../../utils/keyboard';
import { getBasePitchByOctave } from '../../utils/pitch';

interface UseKeyboardPianoControlOptions {
  enabled: boolean;
  keyboardControlMappings: KeyboardControlMappings;
  onNotePress: (note: number) => void | Promise<void>;
  onNoteRelease: (note: number) => void;
  showKeyHints: boolean;
  showOctaveHints: boolean;
}

interface KeyboardOctaveHint {
  downKey: string;
  downMark: string;
  upKey: string;
  upMark: string;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"]'),
  );
}

function useKeyboardControl({
  enabled,
  keyboardControlMappings: {
    noteMappings,
    octaveKeyMappings,
    temporaryOctaveKeyMappings,
  },
  onNotePress,
  onNoteRelease,
  showKeyHints,
  showOctaveHints,
}: UseKeyboardPianoControlOptions) {
  const [keyboardOctave, setKeyboardOctave] = useState(DEFAULT_KEYBOARD_OCTAVE);
  const [activeTemporaryOctaveKeys, setActiveTemporaryOctaveKeys] = useState<
    ReadonlySet<string>
  >(() => new Set());
  const activeTemporaryOctaveKeysRef = useRef<Set<string>>(new Set());
  const activeNotesRef = useRef<Map<string, number>>(new Map());
  const keyboardOctaveRef = useRef(DEFAULT_KEYBOARD_OCTAVE);

  const keyboardNoteMap = useMemo(
    () => createKeyboardNoteMap(noteMappings),
    [noteMappings],
  );

  useEffect(() => {
    function clearTemporaryOctaveKeys() {
      if (activeTemporaryOctaveKeysRef.current.size === 0) {
        return;
      }

      activeTemporaryOctaveKeysRef.current.clear();
      setActiveTemporaryOctaveKeys(new Set());
    }

    function releaseActiveNotes() {
      const activeNotes = activeNotesRef.current;
      if (activeNotes.size === 0) {
        return;
      }

      const notes = Array.from(activeNotes.values());
      activeNotes.clear();
      for (const note of notes) {
        onNoteRelease(note);
      }
    }

    function resetKeyboardInput() {
      clearTemporaryOctaveKeys();
      releaseActiveNotes();
    }

    if (!enabled) {
      resetKeyboardInput();
      return;
    }

    clearTemporaryOctaveKeys();

    function handleKeyboardKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e.target) || e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }

      const key = normalizeKeyboardControlKey(e.key);
      if (key === null) {
        return;
      }

      if (
        key === temporaryOctaveKeyMappings.downKey ||
        key === temporaryOctaveKeyMappings.upKey
      ) {
        e.preventDefault();
        if (!activeTemporaryOctaveKeysRef.current.has(key)) {
          activeTemporaryOctaveKeysRef.current.add(key);
          setActiveTemporaryOctaveKeys(
            new Set(activeTemporaryOctaveKeysRef.current),
          );
        }
        return;
      }

      if (
        key === octaveKeyMappings.downKey ||
        key === octaveKeyMappings.upKey
      ) {
        e.preventDefault();
        if (!e.repeat) {
          const octaveDelta = key === octaveKeyMappings.upKey ? +1 : -1;
          setKeyboardOctave((current) => {
            const nextOctave = clampKeyboardOctave(current + octaveDelta);
            keyboardOctaveRef.current = nextOctave;
            return nextOctave;
          });
        }
        return;
      }

      const note = getKeyboardNote(
        key,
        getKeyboardOctaveWithTemporaryShift(
          keyboardOctaveRef.current,
          activeTemporaryOctaveKeysRef.current,
          temporaryOctaveKeyMappings,
        ),
        keyboardNoteMap,
      );
      if (note === null) {
        return;
      }

      e.preventDefault();
      if (activeNotesRef.current.has(key)) {
        return;
      }

      activeNotesRef.current.set(key, note);
      onNotePress(note);
    }

    function handleKeyboardKeyUp(e: KeyboardEvent) {
      const key = normalizeKeyboardControlKey(e.key);
      if (key === null) {
        return;
      }
      if (
        key === temporaryOctaveKeyMappings.downKey ||
        key === temporaryOctaveKeyMappings.upKey
      ) {
        e.preventDefault();
        if (activeTemporaryOctaveKeysRef.current.delete(key)) {
          setActiveTemporaryOctaveKeys(
            new Set(activeTemporaryOctaveKeysRef.current),
          );
        }
        return;
      }

      const note = activeNotesRef.current.get(key);
      if (note === undefined) {
        return;
      }

      e.preventDefault();
      activeNotesRef.current.delete(key);
      onNoteRelease(note);
    }

    window.addEventListener('keydown', handleKeyboardKeyDown);
    window.addEventListener('keyup', handleKeyboardKeyUp);
    window.addEventListener('blur', resetKeyboardInput);

    return () => {
      window.removeEventListener('keydown', handleKeyboardKeyDown);
      window.removeEventListener('keyup', handleKeyboardKeyUp);
      window.removeEventListener('blur', resetKeyboardInput);
      releaseActiveNotes();
    };
  }, [
    enabled,
    keyboardNoteMap,
    octaveKeyMappings,
    temporaryOctaveKeyMappings,
    onNotePress,
    onNoteRelease,
  ]);

  const keyHints = useMemo(() => {
    const hints = new Map<number, string>();

    if (!enabled || !showKeyHints) {
      return hints;
    }

    const basePitch = getBasePitchByOctave(
      getKeyboardOctaveWithTemporaryShift(
        keyboardOctave,
        activeTemporaryOctaveKeys,
        temporaryOctaveKeyMappings,
      ),
    );

    for (const { key, offset } of noteMappings) {
      if (key) {
        hints.set(basePitch + offset, key.toUpperCase());
      }
    }

    return hints;
  }, [
    activeTemporaryOctaveKeys,
    enabled,
    noteMappings,
    keyboardOctave,
    temporaryOctaveKeyMappings,
    showKeyHints,
  ]);

  const octaveHints = useMemo<KeyboardOctaveHint[]>(() => {
    if (!enabled || !showOctaveHints) {
      return [];
    }

    return [
      {
        downKey: octaveKeyMappings.downKey
          ? octaveKeyMappings.downKey.toUpperCase()
          : '',
        downMark: '⇓',
        upKey: octaveKeyMappings.upKey
          ? octaveKeyMappings.upKey.toUpperCase()
          : '',
        upMark: '⇑',
      },
      {
        downKey: temporaryOctaveKeyMappings.downKey
          ? temporaryOctaveKeyMappings.downKey.toUpperCase()
          : '',
        downMark: '↓',
        upKey: temporaryOctaveKeyMappings.upKey
          ? temporaryOctaveKeyMappings.upKey.toUpperCase()
          : '',
        upMark: '↑',
      },
    ].filter(({ downKey, upKey }) => downKey || upKey);
  }, [enabled, octaveKeyMappings, temporaryOctaveKeyMappings, showOctaveHints]);

  return { keyHints, octaveHints };
}

export default useKeyboardControl;
