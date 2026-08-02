import { useCallback, useEffect } from 'react';
import {
  clearAbcBody,
  getPianoInputSettingsFromAbcHeader,
  hasPianoInputSettingsHeader,
  updateAbcHeader,
} from '../../services/abc/AbcHeader';
import type { PianoInputSettings } from '../../services/abc/AbcSettings';
import { DEFAULT_PIANO_INPUT_SETTINGS } from '../../services/abc/AbcSettings';
import { useAppSettingsStore } from '../../stores/appSettingsStore';
import { useScoreStore } from '../../stores/scoreStore';

function isSamePianoInputSettings(
  left: PianoInputSettings,
  right: PianoInputSettings,
) {
  return (
    left.defaultNoteLength === right.defaultNoteLength &&
    left.keySignature === right.keySignature &&
    Object.is(left.tempo, right.tempo) &&
    left.timeSignature === right.timeSignature
  );
}

function usePianoInputSettings() {
  const isPianoInputEnabled = useAppSettingsStore(
    (state) => state.isPianoInputEnabled,
  );
  const pianoInputSettings = useAppSettingsStore(
    (state) => state.pianoInputSettings,
  );
  const setPianoInputSettings = useAppSettingsStore(
    (state) => state.setPianoInputSettings,
  );
  const abcContent = useScoreStore((state) => state.abcContent);
  const setAbcContent = useScoreStore((state) => state.setAbcContent);

  const syncPianoInputSettings = useCallback(() => {
    setAbcContent((content) => updateAbcHeader(content, pianoInputSettings));
  }, [pianoInputSettings, setAbcContent]);

  useEffect(() => {
    if (!isPianoInputEnabled) {
      return;
    }

    if (!hasPianoInputSettingsHeader(abcContent)) {
      syncPianoInputSettings();
      return;
    }

    const headerSettings = getPianoInputSettingsFromAbcHeader(abcContent);
    if (!isSamePianoInputSettings(headerSettings, pianoInputSettings)) {
      setPianoInputSettings(headerSettings);
    }
  }, [
    abcContent,
    isPianoInputEnabled,
    pianoInputSettings,
    setPianoInputSettings,
    syncPianoInputSettings,
  ]);

  const updatePianoInputSettings = useCallback(
    (settings: Partial<PianoInputSettings>) => {
      setPianoInputSettings({
        ...pianoInputSettings,
        ...settings,
      });
      setAbcContent((content) => updateAbcHeader(content, settings));
    },
    [pianoInputSettings, setAbcContent, setPianoInputSettings],
  );

  const resetPianoInputSettings = useCallback(() => {
    setPianoInputSettings(DEFAULT_PIANO_INPUT_SETTINGS);
    setAbcContent((content) =>
      updateAbcHeader(content, DEFAULT_PIANO_INPUT_SETTINGS),
    );
  }, [setAbcContent, setPianoInputSettings]);

  const clearScoreBody = useCallback(() => {
    setAbcContent((content) => clearAbcBody(content));
  }, [setAbcContent]);

  return {
    clearScoreBody,
    resetPianoInputSettings,
    syncPianoInputSettings,
    updatePianoInputSettings,
  };
}

export default usePianoInputSettings;
