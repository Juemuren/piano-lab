import { useContext } from 'react';
import { MidiControlContext } from './MidiControlContext';

export function useMidiControlContext() {
  const midiControl = useContext(MidiControlContext);

  if (!midiControl) {
    throw new Error(
      'useMidiControlContext must be used within MidiControlProvider',
    );
  }

  return midiControl;
}
