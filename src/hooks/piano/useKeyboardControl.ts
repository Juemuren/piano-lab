import type { RefObject } from 'react';
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
  activeNotesRef: RefObject<Map<string, number>>;
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
  activeNotesRef,
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
  const keyboardOctaveRef = useRef(DEFAULT_KEYBOARD_OCTAVE);

  useEffect(() => {
    keyboardOctaveRef.current = keyboardOctave;
  }, [keyboardOctave]);

  const keyboardNoteMap = useMemo(
    () => createKeyboardNoteMap(noteMappings),
    [noteMappings],
  );

  useEffect(() => {
    if (!enabled) {
      const keyboardNotes = activeNotesRef.current;
      activeTemporaryOctaveKeysRef.current.clear();
      setActiveTemporaryOctaveKeys(new Set());
      if (keyboardNotes.size > 0) {
        const releasedNotes = Array.from(keyboardNotes.values());
        keyboardNotes.clear();
        for (const note of releasedNotes) {
          onNoteRelease(note);
        }
      }
      return;
    }

    function handleKeyboardKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e.target) || e.altKey || e.metaKey) {
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
          setKeyboardOctave((current) =>
            clampKeyboardOctave(current + octaveDelta),
          );
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

    return () => {
      activeTemporaryOctaveKeysRef.current.clear();
      setActiveTemporaryOctaveKeys(new Set());
      window.removeEventListener('keydown', handleKeyboardKeyDown);
      window.removeEventListener('keyup', handleKeyboardKeyUp);
    };
  }, [
    activeNotesRef,
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
