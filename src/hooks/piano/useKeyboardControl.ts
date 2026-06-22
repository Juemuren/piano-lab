import type { RefObject } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../../constants/keyboard';
import { getKeyboardControlKeyLabel } from '../../utils/keyboard';
import { getBasePitchByOctave } from '../../utils/pitch';

const DEFAULT_KEYBOARD_OCTAVE = 4;
const MIN_KEYBOARD_OCTAVE = 1;
const MAX_KEYBOARD_OCTAVE = 7;

interface UseKeyboardPianoControlOptions {
  activeNotesRef: RefObject<Map<string, number>>;
  enabled: boolean;
  keyboardNoteMappings: KeyboardNoteMapping[];
  keyboardOctaveKeyMappings: KeyboardOctaveKeyMappings;
  keyboardTemporaryOctaveKeyMappings: KeyboardOctaveKeyMappings;
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

function getKeyboardOctaveWithTemporaryShift(
  octave: number,
  activeTemporaryOctaveKeys: ReadonlySet<string>,
  temporaryOctaveKeyMappings: KeyboardOctaveKeyMappings,
) {
  const modifierDelta =
    (activeTemporaryOctaveKeys.has(temporaryOctaveKeyMappings.upKey) ? 1 : 0) +
    (activeTemporaryOctaveKeys.has(temporaryOctaveKeyMappings.downKey)
      ? -1
      : 0);

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
  keyboardOctaveKeyMappings,
  keyboardTemporaryOctaveKeyMappings,
  activeNotesRef,
  onNotePress,
  onNoteRelease,
  showKeyHints,
  showOctaveHints,
}: UseKeyboardPianoControlOptions) {
  const [keyboardOctave, setKeyboardOctave] = useState(DEFAULT_KEYBOARD_OCTAVE);
  const activeTemporaryOctaveKeysRef = useRef<Set<string>>(new Set());
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
      activeTemporaryOctaveKeysRef.current.clear();
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

      if (
        key === keyboardTemporaryOctaveKeyMappings.downKey ||
        key === keyboardTemporaryOctaveKeyMappings.upKey
      ) {
        e.preventDefault();
        activeTemporaryOctaveKeysRef.current.add(key);
        return;
      }

      if (
        key === keyboardOctaveKeyMappings.downKey ||
        key === keyboardOctaveKeyMappings.upKey
      ) {
        e.preventDefault();
        if (!e.repeat) {
          const octaveDelta = key === keyboardOctaveKeyMappings.upKey ? +1 : -1;
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
          keyboardTemporaryOctaveKeyMappings,
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
      const key = e.key.toLowerCase();
      if (
        key === keyboardTemporaryOctaveKeyMappings.downKey ||
        key === keyboardTemporaryOctaveKeyMappings.upKey
      ) {
        e.preventDefault();
        activeTemporaryOctaveKeysRef.current.delete(key);
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
      window.removeEventListener('keydown', handleKeyboardKeyDown);
      window.removeEventListener('keyup', handleKeyboardKeyUp);
    };
  }, [
    activeNotesRef,
    enabled,
    keyboardNoteMap,
    keyboardOctaveKeyMappings,
    keyboardTemporaryOctaveKeyMappings,
    onNotePress,
    onNoteRelease,
  ]);

  const keyHints = useMemo(() => {
    const hints = new Map<number, string>();

    if (!enabled || !showKeyHints) {
      return hints;
    }

    const basePitch = getBasePitchByOctave(keyboardOctave);

    for (const { key, offset } of keyboardNoteMappings) {
      if (key) {
        hints.set(basePitch + offset, getKeyboardControlKeyLabel(key));
      }
    }

    return hints;
  }, [enabled, keyboardNoteMappings, keyboardOctave, showKeyHints]);

  const octaveHints = useMemo<KeyboardOctaveHint[]>(() => {
    if (!enabled || !showOctaveHints) {
      return [];
    }

    return [
      {
        downKey: keyboardOctaveKeyMappings.downKey
          ? getKeyboardControlKeyLabel(keyboardOctaveKeyMappings.downKey)
          : '',
        downMark: '⇓',
        upKey: keyboardOctaveKeyMappings.upKey
          ? getKeyboardControlKeyLabel(keyboardOctaveKeyMappings.upKey)
          : '',
        upMark: '⇑',
      },
      {
        downKey: keyboardTemporaryOctaveKeyMappings.downKey
          ? getKeyboardControlKeyLabel(
              keyboardTemporaryOctaveKeyMappings.downKey,
            )
          : '',
        downMark: '↓',
        upKey: keyboardTemporaryOctaveKeyMappings.upKey
          ? getKeyboardControlKeyLabel(keyboardTemporaryOctaveKeyMappings.upKey)
          : '',
        upMark: '↑',
      },
    ].filter(({ downKey, upKey }) => downKey || upKey);
  }, [
    enabled,
    keyboardOctaveKeyMappings,
    keyboardTemporaryOctaveKeyMappings,
    showOctaveHints,
  ]);

  return { keyHints, octaveHints };
}

export default useKeyboardControl;
