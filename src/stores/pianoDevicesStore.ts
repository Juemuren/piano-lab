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
  setGamepadControl: (state: GamepadControlState) => void;
  setMidiControl: (state: MidiControlState) => void;
  setSelectedGamepadIndex: (index?: number) => void;
  setSelectedMidiInputId: (inputId: string) => void;
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
  setGamepadControl: (gamepadControl) => set({ gamepadControl }),
  setMidiControl: (midiControl) => set({ midiControl }),
  setSelectedGamepadIndex: (selectedGamepadIndex) =>
    set({ selectedGamepadIndex }),
  setSelectedMidiInputId: (selectedMidiInputId) => set({ selectedMidiInputId }),
}));
