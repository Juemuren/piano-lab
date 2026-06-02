import { useContext } from 'react';
import { MidiControlContext } from './MidiControlContextValue';

export function useMidiControlContext() {
  const midiControl = useContext(MidiControlContext);

  if (!midiControl) {
    throw new Error(
      'useMidiControlContext must be used within MidiControlProvider',
    );
  }

  return midiControl;
}
