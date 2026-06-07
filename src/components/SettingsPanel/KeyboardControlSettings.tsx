import { useTranslation } from 'react-i18next';
import ControlCheckbox from '../shared/ControlCheckbox';

type KeyboardControlSettingsProps = {
  isKeyboardControlEnabled: boolean;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
};

function KeyboardControlSettings({
  isKeyboardControlEnabled,
  setIsKeyboardControlEnabled,
}: KeyboardControlSettingsProps) {
  const { t } = useTranslation('app');

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        label={t('settings.keyboardControl')}
        checked={isKeyboardControlEnabled}
        onChange={(e) => setIsKeyboardControlEnabled(e.target.checked)}
      />
      {isKeyboardControlEnabled && (
        <p className="text-sm text-app-overlay dark:text-app-overlay-dark">
          {t('settings.keyboard.hint')}
        </p>
      )}
    </div>
  );
}

export default KeyboardControlSettings;
