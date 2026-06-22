import type { MouseEvent, RefObject, TouchEvent } from 'react';
import { useCallback, useEffect, useRef } from 'react';

const TOUCH_MOUSE_EVENT_IGNORE_MS = 1000;

type NotePressHandler = (note: number) => void | Promise<void>;

interface UsePointerControlOptions {
  activeMouseNotesRef: RefObject<Set<number>>;
  activeTouchNotesRef: RefObject<Set<number>>;
  isMouseControlEnabled: boolean;
  isTouchControlEnabled: boolean;
  onNotePress: NotePressHandler;
  onNoteRelease: (note: number) => void;
}

function usePointerControl({
  isMouseControlEnabled,
  isTouchControlEnabled,
  activeMouseNotesRef,
  activeTouchNotesRef,
  onNotePress,
  onNoteRelease,
}: UsePointerControlOptions) {
  const lastTouchEventAtRef = useRef(0);

  const handleKeyDown = useCallback(
    (e: MouseEvent | TouchEvent, note: number) => {
      const isTouchEvent = 'touches' in e;
      if (isTouchEvent) {
        lastTouchEventAtRef.current = Date.now();
        if (!isTouchControlEnabled) {
          return;
        }
        e.preventDefault();
        if (activeTouchNotesRef.current.has(note)) {
          return;
        }
        activeTouchNotesRef.current = new Set(activeTouchNotesRef.current).add(
          note,
        );
        onNotePress(note);
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
        if (activeMouseNotesRef.current.has(note)) {
          return;
        }
        activeMouseNotesRef.current = new Set(activeMouseNotesRef.current).add(
          note,
        );
        onNotePress(note);
      }
    },
    [
      activeMouseNotesRef,
      activeTouchNotesRef,
      isMouseControlEnabled,
      isTouchControlEnabled,
      onNotePress,
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
        if (!activeTouchNotesRef.current.has(note)) {
          return;
        }
        const newSet = new Set(activeTouchNotesRef.current);
        newSet.delete(note);
        activeTouchNotesRef.current = newSet;
        onNoteRelease(note);
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
        if (!activeMouseNotesRef.current.has(note)) {
          return;
        }
        const newSet = new Set(activeMouseNotesRef.current);
        newSet.delete(note);
        activeMouseNotesRef.current = newSet;
        onNoteRelease(note);
      }
    },
    [
      activeMouseNotesRef,
      activeTouchNotesRef,
      isMouseControlEnabled,
      isTouchControlEnabled,
      onNoteRelease,
    ],
  );

  useEffect(() => {
    if (!isMouseControlEnabled && activeMouseNotesRef.current.size > 0) {
      const releasedNotes = Array.from(activeMouseNotesRef.current);
      activeMouseNotesRef.current = new Set();
      for (const note of releasedNotes) {
        onNoteRelease(note);
      }
    }
    if (!isTouchControlEnabled && activeTouchNotesRef.current.size > 0) {
      const releasedNotes = Array.from(activeTouchNotesRef.current);
      activeTouchNotesRef.current = new Set();
      for (const note of releasedNotes) {
        onNoteRelease(note);
      }
    }
  }, [
    activeMouseNotesRef,
    activeTouchNotesRef,
    isMouseControlEnabled,
    isTouchControlEnabled,
    onNoteRelease,
  ]);

  return {
    handleKeyDown,
    handleKeyUp,
  };
}

export default usePointerControl;
