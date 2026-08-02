import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  MidiControlState,
  MidiInputDevice,
  MidiStatus,
} from '../../stores/pianoDevicesStore';
import { MAX_PIANO_PITCH, MIN_PIANO_PITCH } from '../../utils/pitch';

const MIDI_COMMAND_NOTE_OFF = 0x80;
const MIDI_COMMAND_NOTE_ON = 0x90;
const EMPTY_ACTIVE_NOTES = new Set<number>();
const EMPTY_MIDI_DEVICES: MidiInputDevice[] = [];

interface UseMidiControlOptions {
  enabled: boolean;
  onNoteOff: (note: number) => void;
  onNoteOn: (note: number, velocity: number) => void | Promise<void>;
  selectedInputId?: string;
}

export function createInitialMidiControlState(): MidiControlState {
  return {
    activeInputId: '',
    activeNotes: new Set(),
    devices: [],
    status: 'idle',
  };
}

function isPianoRangeNote(note: number) {
  return note >= MIN_PIANO_PITCH && note <= MAX_PIANO_PITCH;
}

function getInputDevice(input: MIDIInput): MidiInputDevice {
  return {
    connection: input.connection,
    id: input.id,
    manufacturer: input.manufacturer || '',
    name: input.name || input.id,
    state: input.state,
  };
}

function useMidiControl({
  enabled,
  selectedInputId,
  onNoteOn,
  onNoteOff,
}: UseMidiControlOptions) {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [devices, setDevices] = useState<MidiInputDevice[]>([]);
  const [activeInputId, setActiveInputId] = useState('');
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
      const releasedNotes = Array.from(activeNotesRef.current);
      setActiveMidiNotes(new Set());
      for (const note of releasedNotes) {
        onNoteOff(note);
      }
    }
  }, [onNoteOff, setActiveMidiNotes]);

  const resetMidiState = useCallback(() => {
    setDevices([]);
    setActiveInputId('');
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
        if (!activeNotesRef.current.has(note)) {
          return;
        }

        const nextNotes = new Set(activeNotesRef.current);
        nextNotes.delete(note);
        setActiveMidiNotes(nextNotes);
        onNoteOff(note);
      }
    },
    [onNoteOff, onNoteOn, setActiveMidiNotes],
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
      const inputs = Array.from(midiAccess.inputs.values());
      const selectedInput =
        inputs.find((input) => input.id === selectedInputId) || inputs[0];

      if (selectedInput) {
        selectedInput.onmidimessage = handleMidiMessage;
        attachedInputs.add(selectedInput);
      }

      setDevices(inputs.map(getInputDevice));
      setActiveInputId(selectedInput?.id || '');
      clearActiveNotes();
      setStatus('ready');
    }

    async function connectMidi() {
      if (!navigator.requestMIDIAccess) {
        setStatus('unsupported');
        return;
      }

      if (midiAccessRef.current) {
        attachInputs(midiAccessRef.current);
        midiAccessRef.current.onstatechange = () => {
          if (midiAccessRef.current) {
            attachInputs(midiAccessRef.current);
          }
        };
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
      clearActiveNotes();
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
  }, [
    clearActiveNotes,
    enabled,
    handleMidiMessage,
    resetMidiState,
    selectedInputId,
  ]);

  return useMemo(
    () => ({
      activeInputId: enabled ? activeInputId : '',
      activeNotes: enabled ? activeNotes : EMPTY_ACTIVE_NOTES,
      devices: enabled ? devices : EMPTY_MIDI_DEVICES,
      status: enabled ? status : 'idle',
    }),
    [activeInputId, activeNotes, devices, enabled, status],
  );
}

export default useMidiControl;
