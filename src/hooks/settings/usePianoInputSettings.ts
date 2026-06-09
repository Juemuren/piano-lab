import { useCallback } from 'react';
import { useAbcContent } from '../../contexts/abcContent';
import { useAppSettings } from '../../contexts/appSettings';
import type { PianoInputSettings } from '../../contexts/appSettings/AppSettingsContext';
import { DEFAULT_PIANO_INPUT_SETTINGS } from '../../contexts/appSettings/AppSettingsContext';
import { clearAbcBody, updateAbcHeader } from '../../services/abc/AbcInput';

function usePianoInputSettings() {
  const { pianoInputSettings, setPianoInputSettings } = useAppSettings();
  const { setAbcContent } = useAbcContent();

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
    updatePianoInputSettings,
    resetPianoInputSettings,
    clearScoreBody,
  };
}

export default usePianoInputSettings;
