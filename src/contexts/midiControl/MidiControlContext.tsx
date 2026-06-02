import { type ReactNode, useMemo, useState } from 'react';
import { createInitialMidiControlState } from '../../hooks/piano/useMidiControl';
import type { MidiControlState } from '../../types';
import { MidiControlContext } from './MidiControlContextValue';

interface MidiControlProviderProps {
  children: ReactNode;
}

export function MidiControlProvider({ children }: MidiControlProviderProps) {
  const [midiControl, setMidiControl] = useState<MidiControlState>(
    createInitialMidiControlState,
  );
  const [selectedMidiInputId, setSelectedMidiInputId] = useState('');

  const value = useMemo(
    () => ({
      midiControl,
      setMidiControl,
      selectedMidiInputId,
      setSelectedMidiInputId,
    }),
    [midiControl, selectedMidiInputId],
  );

  return (
    <MidiControlContext.Provider value={value}>
      {children}
    </MidiControlContext.Provider>
  );
}
