import { useCallback } from 'react';
import { useAbcContent } from '../../contexts/abcContent';
import { useAppSettings } from '../../contexts/appSettings';
import type { PianoInputSettings } from '../../contexts/appSettings/AppSettingsContext';
import { updateAbcHeader } from '../../services/abc/AbcInput';

function usePianoInputSettings() {
  const { pianoInputSettings, setPianoInputSettings } = useAppSettings();
  const { setAbcContent } = useAbcContent();

  return useCallback(
    (settings: Partial<PianoInputSettings>) => {
      setPianoInputSettings({
        ...pianoInputSettings,
        ...settings,
      });
      setAbcContent((content) => updateAbcHeader(content, settings));
    },
    [pianoInputSettings, setAbcContent, setPianoInputSettings],
  );
}

export default usePianoInputSettings;
