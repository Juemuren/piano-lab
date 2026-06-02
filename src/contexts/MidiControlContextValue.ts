import { createContext } from 'react';
import type { MidiControlState } from '../types';

export interface MidiControlContextValue {
  midiControl: MidiControlState;
  setMidiControl: (state: MidiControlState) => void;
  selectedMidiInputId: string;
  setSelectedMidiInputId: (inputId: string) => void;
}

export const MidiControlContext = createContext<MidiControlContextValue | null>(
  null,
);
