export type MidiStatus =
  | 'idle'
  | 'unsupported'
  | 'requesting'
  | 'ready'
  | 'error';

export interface MidiInputDevice {
  id: string;
  name: string;
  manufacturer: string;
  state: MIDIPortDeviceState;
  connection: MIDIPortConnectionState;
}

export interface MidiControlState {
  activeNotes: Set<number>;
  devices: MidiInputDevice[];
  activeInputId: string;
  status: MidiStatus;
}
