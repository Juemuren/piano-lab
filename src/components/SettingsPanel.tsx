import { useTranslation } from 'react-i18next';
import { useAppSettings } from '../contexts/useAppSettings';
import ControlPanel from './shared/ControlPanel';

function SettingsPanel() {
  const { t } = useTranslation('app');
  const { isPianoInputEnabled, setIsPianoInputEnabled } = useAppSettings();

  return (
    <ControlPanel>
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
