import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_PIANO_PITCH, MIN_PIANO_PITCH } from '../../utils/pitch';

const MIDI_COMMAND_NOTE_OFF = 0x80;
const MIDI_COMMAND_NOTE_ON = 0x90;

interface UseMidiControlOptions {
  enabled: boolean;
  onNoteOn: (note: number, velocity: number) => void;
}

function isPianoRangeNote(note: number) {
  return note >= MIN_PIANO_PITCH && note <= MAX_PIANO_PITCH;
}

function useMidiControl({ enabled, onNoteOn }: UseMidiControlOptions) {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
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
    }

    async function connectMidi() {
      if (!navigator.requestMIDIAccess) {
        return;
      }

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
      return;
    }

    connectMidi().catch(() => {
      clearActiveNotes();
    });

    return () => {
      disposed = true;
      if (midiAccessRef.current) {
        midiAccessRef.current.onstatechange = null;
      }
      detachInputs();
    };
  }, [clearActiveNotes, enabled, handleMidiMessage]);

  return activeNotes;
}

export default useMidiControl;
