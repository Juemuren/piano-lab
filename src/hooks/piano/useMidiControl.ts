import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MAX_PIANO_PITCH, MIN_PIANO_PITCH } from '../../utils/pitch';

const MIDI_COMMAND_NOTE_OFF = 0x80;
const MIDI_COMMAND_NOTE_ON = 0x90;
const EMPTY_ACTIVE_NOTES = new Set<number>();
const EMPTY_MIDI_DEVICES: MidiInputDevice[] = [];

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
  status: MidiStatus;
}

interface UseMidiControlOptions {
  enabled: boolean;
  onNoteOn: (note: number, velocity: number) => void;
}

function isPianoRangeNote(note: number) {
  return note >= MIN_PIANO_PITCH && note <= MAX_PIANO_PITCH;
}

function getInputDevice(input: MIDIInput): MidiInputDevice {
  return {
    id: input.id,
    name: input.name || input.id,
    manufacturer: input.manufacturer || '',
    state: input.state,
    connection: input.connection,
  };
}

function useMidiControl({ enabled, onNoteOn }: UseMidiControlOptions) {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [devices, setDevices] = useState<MidiInputDevice[]>([]);
  const [status, setStatus] = useState<MidiStatus>('idle');
  const midiAccessRef = useRef<MIDIAccess | null>(null);
  const activeNotesRef = useRef<Set<number>>(new Set());
  const attachedInputsRef = useRef<Set<MIDIInput>>(new Set());

  const setActiveMidiNotes = useCallback((notes: Set<number>) => {
    activeNotesRef.current = notes;
    setActiveNotes(notes);
  }, []);

  const clearActiveNotes = useCallback(() => {
    if (activeNotesRef.current.size > 0) {
      setActiveMidiNotes(new Set());
    }
  }, [setActiveMidiNotes]);

  const resetMidiState = useCallback(() => {
    setDevices([]);
    setStatus('idle');
    clearActiveNotes();
  }, [clearActiveNotes]);

  const handleMidiMessage = useCallback(
    (event: MIDIMessageEvent) => {
      if (!event.data) {
        return;
      }

      const [status = 0, note = -1, velocity = 0] = event.data;
      const command = status & 0xf0;

      if (!isPianoRangeNote(note)) {
        return;
      }

      if (command === MIDI_COMMAND_NOTE_ON && velocity > 0) {
        const shouldPlay = !activeNotesRef.current.has(note);
        setActiveMidiNotes(new Set(activeNotesRef.current).add(note));
        if (shouldPlay) {
          onNoteOn(note, velocity);
        }
        return;
      }

      if (
        command === MIDI_COMMAND_NOTE_OFF ||
        (command === MIDI_COMMAND_NOTE_ON && velocity === 0)
      ) {
        const nextNotes = new Set(activeNotesRef.current);
        nextNotes.delete(note);
        setActiveMidiNotes(nextNotes);
      }
    },
    [onNoteOn, setActiveMidiNotes],
  );

  useEffect(() => {
    const attachedInputs = attachedInputsRef.current;
    let disposed = false;

    function detachInputs() {
      for (const input of attachedInputs) {
        input.onmidimessage = null;
      }
      attachedInputs.clear();
    }

    function attachInputs(midiAccess: MIDIAccess) {
      detachInputs();
      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = handleMidiMessage;
        attachedInputs.add(input);
      }
      setDevices(Array.from(midiAccess.inputs.values(), getInputDevice));
      setStatus('ready');
    }

    async function connectMidi() {
      if (!navigator.requestMIDIAccess) {
        setStatus('unsupported');
        return;
      }

      setStatus('requesting');
      const midiAccess = await navigator.requestMIDIAccess({
        sysex: false,
      });
      if (disposed) {
        return;
      }

      midiAccessRef.current = midiAccess;
      attachInputs(midiAccess);
      midiAccess.onstatechange = () => attachInputs(midiAccess);
    }

    if (!enabled) {
      if (midiAccessRef.current) {
        midiAccessRef.current.onstatechange = null;
      }
      detachInputs();
      activeNotesRef.current = new Set();
      queueMicrotask(resetMidiState);
      return;
    }

    connectMidi().catch(() => {
      setDevices([]);
      setStatus('error');
      clearActiveNotes();
    });

    return () => {
      disposed = true;
      if (midiAccessRef.current) {
        midiAccessRef.current.onstatechange = null;
      }
      detachInputs();
    };
  }, [clearActiveNotes, enabled, handleMidiMessage, resetMidiState]);

  return useMemo(
    () => ({
      activeNotes: enabled ? activeNotes : EMPTY_ACTIVE_NOTES,
      devices: enabled ? devices : EMPTY_MIDI_DEVICES,
      status: enabled ? status : 'idle',
    }),
    [activeNotes, devices, enabled, status],
  );
}

export default useMidiControl;
