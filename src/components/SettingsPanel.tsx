import { useTranslation } from 'react-i18next';
import { useAppSettings } from '../contexts/useAppSettings';
import ControlPanel from './shared/ControlPanel';

function SettingsPanel() {
  const { t } = useTranslation('app');
  const {
    isPianoInputEnabled,
    setIsPianoInputEnabled,
    isKeyboardControlEnabled,
    setIsKeyboardControlEnabled,
  } = useAppSettings();

  return (
    <ControlPanel className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isKeyboardControlEnabled}
          onChange={(e) => setIsKeyboardControlEnabled(e.target.checked)}
          className="size-4 accent-app-accent"
        />
        <span>{t('settings.keyboardControl')}</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPianoInputEnabled}
          onChange={(e) => setIsPianoInputEnabled(e.target.checked)}
          className="size-4 accent-app-accent"
        />
        <span>{t('settings.pianoInput')}</span>
      </label>
    </ControlPanel>
  );
}

export default SettingsPanel;
