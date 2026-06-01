import {
  type MouseEvent,
  type RefObject,
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';

const TOUCH_MOUSE_EVENT_IGNORE_MS = 1000;

interface UsePointerControlOptions {
  isMouseControlEnabled: boolean;
  isTouchControlEnabled: boolean;
  activeMouseNotesRef: RefObject<Set<number>>;
  activeTouchNotesRef: RefObject<Set<number>>;
  pressedKeysRef: RefObject<Set<number>>;
  onNotePress: (note: number) => void;
  onActiveNotesChange: () => void;
}

function usePointerControl({
  isMouseControlEnabled,
  isTouchControlEnabled,
  activeMouseNotesRef,
  activeTouchNotesRef,
  pressedKeysRef,
  onNotePress,
  onActiveNotesChange,
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
        const shouldPlay = !pressedKeysRef.current.has(note);
        activeTouchNotesRef.current = new Set(activeTouchNotesRef.current).add(
          note,
        );
        if (shouldPlay) {
          onNotePress(note);
        }
        onActiveNotesChange();
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
        const shouldPlay = !pressedKeysRef.current.has(note);
        activeMouseNotesRef.current = new Set(activeMouseNotesRef.current).add(
          note,
        );
        if (shouldPlay) {
          onNotePress(note);
        }
        onActiveNotesChange();
      }
    },
    [
      activeMouseNotesRef,
      activeTouchNotesRef,
      isMouseControlEnabled,
      isTouchControlEnabled,
      onActiveNotesChange,
      onNotePress,
      pressedKeysRef,
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
        const newSet = new Set(activeTouchNotesRef.current);
        newSet.delete(note);
        activeTouchNotesRef.current = newSet;
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
        const newSet = new Set(activeMouseNotesRef.current);
        newSet.delete(note);
        activeMouseNotesRef.current = newSet;
      }

      onActiveNotesChange();
    },
    [
      activeMouseNotesRef,
      activeTouchNotesRef,
      isMouseControlEnabled,
      isTouchControlEnabled,
      onActiveNotesChange,
    ],
  );

  useEffect(() => {
    let shouldSync = false;

    if (!isMouseControlEnabled && activeMouseNotesRef.current.size > 0) {
      activeMouseNotesRef.current = new Set();
      shouldSync = true;
    }
    if (!isTouchControlEnabled && activeTouchNotesRef.current.size > 0) {
      activeTouchNotesRef.current = new Set();
      shouldSync = true;
    }

    if (shouldSync) {
      onActiveNotesChange();
    }
  }, [
    activeMouseNotesRef,
    activeTouchNotesRef,
    isMouseControlEnabled,
    isTouchControlEnabled,
    onActiveNotesChange,
  ]);

  return {
    handleKeyDown,
    handleKeyUp,
  };
}

export default usePointerControl;
