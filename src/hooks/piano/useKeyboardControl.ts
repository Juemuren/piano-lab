import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { getBasePitchByOctave } from '../../utils/pitch';

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

interface UseKeyboardPianoControlOptions {
  enabled: boolean;
  activeNotesRef: RefObject<Map<string, number>>;
  onNotePress: (note: number) => void | Promise<void>;
  onNoteRelease: (note: number) => void;
}

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
  activeNotesRef,
  onNotePress,
  onNoteRelease,
}: UseKeyboardPianoControlOptions) {
  const [keyboardOctave, setKeyboardOctave] = useState(DEFAULT_KEYBOARD_OCTAVE);
  const keyboardOctaveRef = useRef(DEFAULT_KEYBOARD_OCTAVE);

  useEffect(() => {
    keyboardOctaveRef.current = keyboardOctave;
  }, [keyboardOctave]);

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
  }, [activeNotesRef, enabled, onNotePress, onNoteRelease]);

  const keyHints = useMemo(() => {
    const hints = new Map<number, string>();

    if (!enabled) {
      return hints;
    }

    const basePitch = getBasePitchByOctave(keyboardOctave);

    for (const { label, offset } of KEYBOARD_NOTE_MAP.values()) {
      hints.set(basePitch + offset, label);
    }

    return hints;
  }, [enabled, keyboardOctave]);

  return { keyHints };
}

export default useKeyboardControl;
