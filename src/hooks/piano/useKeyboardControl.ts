import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import {
  KEYBOARD_OCTAVE_DOWN_KEY,
  KEYBOARD_OCTAVE_UP_KEY,
  type KeyboardNoteMapping,
} from '../../constants/keyboard';
import { getKeyboardControlKeyLabel } from '../../utils/keyboard';
import { getBasePitchByOctave } from '../../utils/pitch';

const DEFAULT_KEYBOARD_OCTAVE = 4;
const MIN_KEYBOARD_OCTAVE = 1;
const MAX_KEYBOARD_OCTAVE = 7;

interface UseKeyboardPianoControlOptions {
  enabled: boolean;
  keyboardNoteMappings: KeyboardNoteMapping[];
  activeNotesRef: RefObject<Map<string, number>>;
  onNotePress: (note: number) => void | Promise<void>;
  onNoteRelease: (note: number) => void;
}

function getKeyboardNote(
  key: string,
  octave: number,
  keyboardNoteMap: ReadonlyMap<string, number>,
) {
  const offset = keyboardNoteMap.get(key);
  if (offset === undefined) {
    return null;
  }

  return getBasePitchByOctave(octave) + offset;
}

function clampKeyboardOctave(octave: number) {
  return Math.min(MAX_KEYBOARD_OCTAVE, Math.max(MIN_KEYBOARD_OCTAVE, octave));
}

function getKeyboardOctaveWithModifier(octave: number, e: KeyboardEvent) {
  const modifierDelta = (e.shiftKey ? 1 : 0) + (e.ctrlKey ? -1 : 0);

  return clampKeyboardOctave(octave + modifierDelta);
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
  keyboardNoteMappings,
  activeNotesRef,
  onNotePress,
  onNoteRelease,
}: UseKeyboardPianoControlOptions) {
  const [keyboardOctave, setKeyboardOctave] = useState(DEFAULT_KEYBOARD_OCTAVE);
  const keyboardOctaveRef = useRef(DEFAULT_KEYBOARD_OCTAVE);

  useEffect(() => {
    keyboardOctaveRef.current = keyboardOctave;
  }, [keyboardOctave]);

  const keyboardNoteMap = useMemo(() => {
    return new Map(
      keyboardNoteMappings
        .filter((mapping) => mapping.key)
        .map((mapping) => [mapping.key, mapping.offset]),
    );
  }, [keyboardNoteMappings]);

  useEffect(() => {
    if (!enabled) {
      const keyboardNotes = activeNotesRef.current;
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

      const note = getKeyboardNote(
        key,
        getKeyboardOctaveWithModifier(keyboardOctaveRef.current, e),
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
      const key = e.key.toLowerCase();
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
      window.removeEventListener('keydown', handleKeyboardKeyDown);
      window.removeEventListener('keyup', handleKeyboardKeyUp);
    };
  }, [activeNotesRef, enabled, keyboardNoteMap, onNotePress, onNoteRelease]);

  const keyHints = useMemo(() => {
    const hints = new Map<number, string>();

    if (!enabled) {
      return hints;
    }

    const basePitch = getBasePitchByOctave(keyboardOctave);

    for (const { key, offset } of keyboardNoteMappings) {
      if (key) {
        hints.set(basePitch + offset, getKeyboardControlKeyLabel(key));
      }
    }

    return hints;
  }, [enabled, keyboardNoteMappings, keyboardOctave]);

  return { keyHints };
}

export default useKeyboardControl;
