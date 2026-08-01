import { Gamepad2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ControlCheckbox from '../shared/ControlCheckbox';

interface GamepadControlSettingsProps {
  isGamepadControlEnabled: boolean;
  setIsGamepadControlEnabled: (enabled: boolean) => void;
}

function GamepadControlSettings({
  isGamepadControlEnabled,
  setIsGamepadControlEnabled,
}: GamepadControlSettingsProps) {
  const { t } = useTranslation('app');

  return (
    <ControlCheckbox
      checked={isGamepadControlEnabled}
      icon={<Gamepad2 size={16} />}
      label={t('settings.gamepadControl')}
      onChange={(e) => setIsGamepadControlEnabled(e.target.checked)}
    />
  );
}

export default GamepadControlSettings;
