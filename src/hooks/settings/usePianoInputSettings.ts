import { useCallback } from 'react';
import { clearAbcBody, updateAbcHeader } from '../../services/abc/AbcHeader';
import type { PianoInputSettings } from '../../services/abc/AbcSettings';
import { DEFAULT_PIANO_INPUT_SETTINGS } from '../../services/abc/AbcSettings';
import { useAppSettingsStore } from '../../stores/appSettingsStore';
import { useScoreStore } from '../../stores/scoreStore';

function usePianoInputSettings() {
  const pianoInputSettings = useAppSettingsStore(
    (state) => state.pianoInputSettings,
  );
  const setPianoInputSettings = useAppSettingsStore(
    (state) => state.setPianoInputSettings,
  );
  const setIsPianoInputEnabled = useAppSettingsStore(
    (state) => state.setIsPianoInputEnabled,
  );
  const setAbcContent = useScoreStore((state) => state.setAbcContent);

  const syncPianoInputSettings = useCallback(() => {
    setAbcContent((content) => updateAbcHeader(content, pianoInputSettings));
  }, [pianoInputSettings, setAbcContent]);

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

  const updatePianoInputEnabled = useCallback(
    (enabled: boolean) => {
      setIsPianoInputEnabled(enabled);
      if (enabled) {
        syncPianoInputSettings();
      }
    },
    [setIsPianoInputEnabled, syncPianoInputSettings],
  );

  return {
    clearScoreBody,
    resetPianoInputSettings,
    updatePianoInputEnabled,
    updatePianoInputSettings,
  };
}

export default usePianoInputSettings;
