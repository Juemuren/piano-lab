import { useCallback, useEffect } from 'react';
import { useAbcContent } from '../../contexts/abcContent';
import { useAppSettings } from '../../contexts/appSettings';
import type { PianoInputSettings } from '../../contexts/appSettings/AppSettingsContext';
import { DEFAULT_PIANO_INPUT_SETTINGS } from '../../contexts/appSettings/AppSettingsContext';
import {
  clearAbcBody,
  getPianoInputSettingsFromAbcHeader,
  hasPianoInputSettingsHeader,
  updateAbcHeader,
} from '../../services/abc/AbcHeader';

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
  const { isPianoInputEnabled, pianoInputSettings, setPianoInputSettings } =
    useAppSettings();
  const { abcContent, setAbcContent } = useAbcContent();

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
