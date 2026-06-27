import { createContext } from 'react';

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

export interface MidiControlContextValue {
  midiControl: MidiControlState;
  selectedMidiInputId: string;
  setMidiControl: (state: MidiControlState) => void;
  setSelectedMidiInputId: (inputId: string) => void;
}

export const MidiControlContext = createContext<MidiControlContextValue | null>(
  null,
);
