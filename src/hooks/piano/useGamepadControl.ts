import { useEffect, useRef, useState } from 'react';
import { MAX_PIANO_PITCH, MIN_PIANO_PITCH } from '../../utils/pitch';

const LEFT_TRIGGER_INITIAL_NOTE = 57; // A3
const RIGHT_TRIGGER_INITIAL_NOTE = 72; // C5
const LEFT_TRIGGER_BUTTON = 6;
const RIGHT_TRIGGER_BUTTON = 7;
const LEFT_SHOULDER_BUTTON = 4;
const RIGHT_SHOULDER_BUTTON = 5;
const LEFT_STICK_BUTTON = 10;
const RIGHT_STICK_BUTTON = 11;
const DPAD_UP_BUTTON = 12;
const DPAD_DOWN_BUTTON = 13;
const DPAD_LEFT_BUTTON = 14;
const DPAD_RIGHT_BUTTON = 15;
const A_BUTTON = 0;
const B_BUTTON = 1;
const X_BUTTON = 2;
const Y_BUTTON = 3;
const STICK_DEAD_ZONE = 0.35;
const TRIGGER_THRESHOLD = 0.05;
const SLOWEST_REPEAT_INTERVAL_MS = 400;
const FASTEST_REPEAT_INTERVAL_MS = 70;
const MAX_GAMEPAD_VOLUME = 127;

interface UseGamepadControlOptions {
  enabled: boolean;
  onNotePress: (note: number, volume: number) => void | Promise<void>;
  onNoteRelease: (note: number) => void;
}

export interface GamepadNoteIndicator {
  label: 'LT' | 'RT';
  note: number;
}

interface RepeatState {
  direction: number;
  repeatedAt: number;
}

function clampPianoNote(note: number) {
  return Math.min(Math.max(note, MIN_PIANO_PITCH), MAX_PIANO_PITCH);
}

function getRepeatInterval(strength: number) {
  const progress = (strength - STICK_DEAD_ZONE) / (1 - STICK_DEAD_ZONE);
  return (
    SLOWEST_REPEAT_INTERVAL_MS -
    progress * (SLOWEST_REPEAT_INTERVAL_MS - FASTEST_REPEAT_INTERVAL_MS)
  );
}

function useGamepadControl({
  enabled,
  onNotePress,
  onNoteRelease,
}: UseGamepadControlOptions) {
  const [indicators, setIndicators] = useState<GamepadNoteIndicator[]>([]);
  const selectedNotesRef = useRef({
    left: LEFT_TRIGGER_INITIAL_NOTE,
    right: RIGHT_TRIGGER_INITIAL_NOTE,
  });
  const activeNotesRef = useRef<{ left?: number; right?: number }>({});
  const indicatorNotesRef = useRef<{ left?: number; right?: number }>({});
  const digitalButtonsRef = useRef<Set<number>>(new Set());
  const repeatStatesRef = useRef<Map<string, RepeatState>>(new Map());

  useEffect(() => {
    if (!enabled) {
      indicatorNotesRef.current = {};
      setIndicators([]);
      return;
    }

    let animationFrameId = 0;
    let activeGamepadIndex: number | undefined;

    function releaseActiveNotes() {
      const { left, right } = activeNotesRef.current;
      activeNotesRef.current = {};
      if (left !== undefined) {
        onNoteRelease(left);
      }
      if (right !== undefined) {
        onNoteRelease(right);
      }
    }

    function updateSelectedNote(side: 'left' | 'right', delta: number) {
      selectedNotesRef.current[side] = clampPianoNote(
        selectedNotesRef.current[side] + delta,
      );
    }

    function handleDigitalButton(
      gamepad: Gamepad,
      button: number,
      side: 'left' | 'right',
      delta: number,
    ) {
      const pressed = gamepad.buttons[button].pressed;
      if (pressed && !digitalButtonsRef.current.has(button)) {
        digitalButtonsRef.current.add(button);
        updateSelectedNote(side, delta);
      } else if (!pressed) {
        digitalButtonsRef.current.delete(button);
      }
    }

    function handleStickAxis(
      name: string,
      value: number,
      side: 'left' | 'right',
      step: number,
      now: number,
    ) {
      const strength = Math.abs(value);
      if (strength < STICK_DEAD_ZONE) {
        repeatStatesRef.current.delete(name);
        return;
      }

      const direction = Math.sign(value);
      const repeatState = repeatStatesRef.current.get(name);
      if (
        !repeatState ||
        repeatState.direction !== direction ||
        now - repeatState.repeatedAt >= getRepeatInterval(strength)
      ) {
        updateSelectedNote(side, direction * step);
        repeatStatesRef.current.set(name, { direction, repeatedAt: now });
      }
    }

    function handleTrigger(
      gamepad: Gamepad,
      button: number,
      side: 'left' | 'right',
      note: number,
    ) {
      const value = gamepad.buttons[button].value;
      const activeNote = activeNotesRef.current[side];
      if (value >= TRIGGER_THRESHOLD && activeNote === undefined) {
        activeNotesRef.current[side] = note;
        onNotePress(note, Math.round(value * MAX_GAMEPAD_VOLUME));
      } else if (value < TRIGGER_THRESHOLD && activeNote !== undefined) {
        delete activeNotesRef.current[side];
        onNoteRelease(activeNote);
      }
    }

    function pollGamepad(now: number) {
      const gamepads = navigator.getGamepads();
      const gamepad =
        activeGamepadIndex === undefined
          ? Array.from(gamepads).find((item) => item?.mapping === 'standard')
          : gamepads[activeGamepadIndex];

      if (!gamepad) {
        if (activeGamepadIndex !== undefined) {
          activeGamepadIndex = undefined;
          digitalButtonsRef.current.clear();
          repeatStatesRef.current.clear();
          releaseActiveNotes();
          indicatorNotesRef.current = {};
          setIndicators([]);
        }
        animationFrameId = requestAnimationFrame(pollGamepad);
        return;
      }

      activeGamepadIndex = gamepad.index;

      handleDigitalButton(gamepad, DPAD_LEFT_BUTTON, 'left', -1);
      handleDigitalButton(gamepad, DPAD_RIGHT_BUTTON, 'left', 1);
      handleDigitalButton(gamepad, DPAD_UP_BUTTON, 'left', 12);
      handleDigitalButton(gamepad, DPAD_DOWN_BUTTON, 'left', -12);
      handleDigitalButton(gamepad, X_BUTTON, 'right', -1);
      handleDigitalButton(gamepad, B_BUTTON, 'right', 1);
      handleDigitalButton(gamepad, Y_BUTTON, 'right', 12);
      handleDigitalButton(gamepad, A_BUTTON, 'right', -12);

      handleStickAxis('left-horizontal', gamepad.axes[0], 'left', 1, now);
      handleStickAxis('left-vertical', -gamepad.axes[1], 'left', 12, now);
      handleStickAxis('right-horizontal', gamepad.axes[2], 'right', 1, now);
      handleStickAxis('right-vertical', -gamepad.axes[3], 'right', 12, now);

      const leftOctaveShift =
        (gamepad.buttons[LEFT_SHOULDER_BUTTON].pressed ? 12 : 0) -
        (gamepad.buttons[LEFT_STICK_BUTTON].pressed ? 12 : 0);
      const rightOctaveShift =
        (gamepad.buttons[RIGHT_SHOULDER_BUTTON].pressed ? 12 : 0) -
        (gamepad.buttons[RIGHT_STICK_BUTTON].pressed ? 12 : 0);
      const leftNote = clampPianoNote(
        selectedNotesRef.current.left + leftOctaveShift,
      );
      const rightNote = clampPianoNote(
        selectedNotesRef.current.right + rightOctaveShift,
      );

      if (
        indicatorNotesRef.current.left !== leftNote ||
        indicatorNotesRef.current.right !== rightNote
      ) {
        indicatorNotesRef.current = { left: leftNote, right: rightNote };
        setIndicators([
          { label: 'LT', note: leftNote },
          { label: 'RT', note: rightNote },
        ]);
      }

      handleTrigger(gamepad, LEFT_TRIGGER_BUTTON, 'left', leftNote);
      handleTrigger(gamepad, RIGHT_TRIGGER_BUTTON, 'right', rightNote);
      animationFrameId = requestAnimationFrame(pollGamepad);
    }

    animationFrameId = requestAnimationFrame(pollGamepad);
    window.addEventListener('blur', releaseActiveNotes);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('blur', releaseActiveNotes);
      releaseActiveNotes();
    };
  }, [enabled, onNotePress, onNoteRelease]);

  return { gamepadNoteIndicators: indicators };
}

export default useGamepadControl;
