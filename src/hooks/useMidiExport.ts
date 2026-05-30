import { useCallback } from 'react';
import { type MidiFile, synth } from 'abcjs';
import { downloadBlob } from '../utils/file';

function getMidiBinary(midiFile: MidiFile): Uint8Array | null {
  if (midiFile instanceof Uint8Array) return midiFile;
  if (Array.isArray(midiFile)) {
    const midiBinary = midiFile.find(
      (item): item is Uint8Array => item instanceof Uint8Array,
    );

    return midiBinary ?? null;
  }

  return null;
}

function useMidiExport(abcContent: string) {
  return useCallback(() => {
    const midiFile = synth.getMidiFile(abcContent, {
      midiOutputType: 'binary',
    });
    const midiBinary = getMidiBinary(midiFile);
    if (!midiBinary) return;

    const midiBuffer = Uint8Array.from(midiBinary).buffer;
    const blob = new Blob([midiBuffer], { type: 'audio/midi' });

    downloadBlob(blob, 'score.midi');
  }, [abcContent]);
}

export default useMidiExport;
