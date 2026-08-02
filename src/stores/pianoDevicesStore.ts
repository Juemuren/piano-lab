import { create } from 'zustand';

export type MidiStatus =
  | 'idle'
  | 'unsupported'
  | 'requesting'
  | 'ready'
  | 'error';

export interface MidiInputDevice {
  connection: MIDIPortConnectionState;
  id: string;
  manufacturer: string;
  name: string;
  state: MIDIPortDeviceState;
}

export interface MidiControlState {
  activeInputId: string;
  activeNotes: Set<number>;
  devices: MidiInputDevice[];
  status: MidiStatus;
}

export type GamepadStatus = 'idle' | 'unsupported' | 'ready' | 'error';

export interface GamepadDevice {
  axisCount: number;
  buttonCount: number;
  id: string;
  index: number;
  mapping: GamepadMappingType;
}

export interface GamepadControlState {
  activeGamepadIndex?: number;
  devices: GamepadDevice[];
  status: GamepadStatus;
}

interface PianoDevicesState {
  gamepadControl: GamepadControlState;
  midiControl: MidiControlState;
  selectedGamepadIndex?: number;
  selectedMidiInputId: string;
  setSelectedGamepadIndex: (index?: number) => void;
  setSelectedMidiInputId: (inputId: string) => void;
  updateGamepadControl: (update: Partial<GamepadControlState>) => void;
  updateMidiControl: (update: Partial<MidiControlState>) => void;
}

export const usePianoDevicesStore = create<PianoDevicesState>()((set) => ({
  gamepadControl: { devices: [], status: 'idle' },
  midiControl: {
    activeInputId: '',
    activeNotes: new Set(),
    devices: [],
    status: 'idle',
  },
  selectedGamepadIndex: undefined,
  selectedMidiInputId: '',
  setSelectedGamepadIndex: (selectedGamepadIndex) =>
    set({ selectedGamepadIndex }),
  setSelectedMidiInputId: (selectedMidiInputId) => set({ selectedMidiInputId }),
  updateGamepadControl: (update) =>
    set(({ gamepadControl }) => ({
      gamepadControl: { ...gamepadControl, ...update },
    })),
  updateMidiControl: (update) =>
    set(({ midiControl }) => ({
      midiControl: { ...midiControl, ...update },
    })),
}));
