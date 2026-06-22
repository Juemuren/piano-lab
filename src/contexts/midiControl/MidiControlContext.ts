import { createContext } from 'react';
import type { MidiControlState } from '../../types';

export interface MidiControlContextValue {
  midiControl: MidiControlState;
  selectedMidiInputId: string;
  setMidiControl: (state: MidiControlState) => void;
  setSelectedMidiInputId: (inputId: string) => void;
}

export const MidiControlContext = createContext<MidiControlContextValue | null>(
  null,
);
