import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  GamepadControlState,
  GamepadDevice,
  GamepadStatus,
} from '../../stores/pianoDevicesStore';
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
const SLOWEST_REPEAT_INTERVAL_MS = 500;
const FASTEST_REPEAT_INTERVAL_MS = 100;

interface UseGamepadControlOptions {
  enabled: boolean;
  onNotePress: (note: number, volume: number) => void | Promise<void>;
  onNoteRelease: (note: number) => void;
  selectedGamepadIndex?: number;
}

export interface GamepadNotes {
  left?: number;
  right?: number;
}

interface RepeatState {
  direction: number;
  repeatedAt: number;
}

const EMPTY_GAMEPAD_DEVICES: GamepadDevice[] = [];

export function createInitialGamepadControlState(): GamepadControlState {
  return {
    devices: [],
    status: 'idle',
  };
}

function getGamepadDevice(gamepad: Gamepad): GamepadDevice {
  return {
    axisCount: gamepad.axes.length,
    buttonCount: gamepad.buttons.length,
    id: gamepad.id,
    index: gamepad.index,
    mapping: gamepad.mapping,
  };
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
  selectedGamepadIndex,
}: UseGamepadControlOptions) {
  const [gamepadNotes, setGamepadNotes] = useState<GamepadNotes>({});
  const [devices, setDevices] = useState<GamepadDevice[]>([]);
  const [activeGamepadIndex, setActiveGamepadIndex] = useState<number>();
  const [status, setStatus] = useState<GamepadStatus>('idle');
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
      setGamepadNotes({});
      setDevices([]);
      setActiveGamepadIndex(undefined);
      setStatus('idle');
      return;
    }

    if (!navigator.getGamepads) {
      setStatus('unsupported');
      return;
    }

    let animationFrameId = 0;
    let currentGamepadIndex: number | undefined;

    function getConnectedGamepads() {
      return Array.from(navigator.getGamepads()).filter(
        (gamepad): gamepad is Gamepad => gamepad !== null,
      );
    }

    function updateDevices() {
      try {
        setDevices(getConnectedGamepads().map(getGamepadDevice));
        setStatus('ready');
      } catch {
        setDevices([]);
        setStatus('error');
      }
    }

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
        onNotePress(note, Math.round(value * 127));
      } else if (value < TRIGGER_THRESHOLD && activeNote !== undefined) {
        delete activeNotesRef.current[side];
        onNoteRelease(activeNote);
      }
    }

    function pollGamepad(now: number) {
      let gamepads: (Gamepad | null)[];
      try {
        gamepads = Array.from(navigator.getGamepads());
      } catch {
        setStatus('error');
        return;
      }
      const selectedGamepad =
        (selectedGamepadIndex === undefined
          ? undefined
          : gamepads[selectedGamepadIndex]) ||
        gamepads.find((item) => item?.mapping === 'standard');
      const gamepad =
        selectedGamepad?.mapping === 'standard' ? selectedGamepad : null;

      if (!gamepad) {
        if (currentGamepadIndex !== undefined) {
          currentGamepadIndex = undefined;
          setActiveGamepadIndex(undefined);
          digitalButtonsRef.current.clear();
          repeatStatesRef.current.clear();
          releaseActiveNotes();
          indicatorNotesRef.current = {};
          setGamepadNotes({});
        }
        animationFrameId = requestAnimationFrame(pollGamepad);
        return;
      }

      if (currentGamepadIndex !== gamepad.index) {
        currentGamepadIndex = gamepad.index;
        setActiveGamepadIndex(gamepad.index);
      }

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
        setGamepadNotes({ left: leftNote, right: rightNote });
      }

      handleTrigger(gamepad, LEFT_TRIGGER_BUTTON, 'left', leftNote);
      handleTrigger(gamepad, RIGHT_TRIGGER_BUTTON, 'right', rightNote);
      animationFrameId = requestAnimationFrame(pollGamepad);
    }

    animationFrameId = requestAnimationFrame(pollGamepad);
    updateDevices();
    window.addEventListener('gamepadconnected', updateDevices);
    window.addEventListener('gamepaddisconnected', updateDevices);
    window.addEventListener('blur', releaseActiveNotes);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('gamepadconnected', updateDevices);
      window.removeEventListener('gamepaddisconnected', updateDevices);
      window.removeEventListener('blur', releaseActiveNotes);
      releaseActiveNotes();
    };
  }, [enabled, onNotePress, onNoteRelease, selectedGamepadIndex]);

  const gamepadControl = useMemo(
    (): GamepadControlState => ({
      activeGamepadIndex: enabled ? activeGamepadIndex : undefined,
      devices: enabled ? devices : EMPTY_GAMEPAD_DEVICES,
      status: enabled ? status : 'idle',
    }),
    [activeGamepadIndex, devices, enabled, status],
  );

  return { gamepadControl, gamepadNotes };
}

export default useGamepadControl;
