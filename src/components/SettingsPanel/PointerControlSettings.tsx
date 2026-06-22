import { Hand, MousePointer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ControlCheckbox from '../shared/ControlCheckbox';

interface PointerControlSettingsProps {
  isMouseControlEnabled: boolean;
  isTouchControlEnabled: boolean;
  setIsMouseControlEnabled: (enabled: boolean) => void;
  setIsTouchControlEnabled: (enabled: boolean) => void;
}

function PointerControlSettings({
  isMouseControlEnabled,
  setIsMouseControlEnabled,
  isTouchControlEnabled,
  setIsTouchControlEnabled,
}: PointerControlSettingsProps) {
  const { t } = useTranslation('app');

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        checked={isMouseControlEnabled}
        icon={<MousePointer size={16} />}
        label={t('settings.mouseControl')}
        onChange={(e) => setIsMouseControlEnabled(e.target.checked)}
      />
      <ControlCheckbox
        checked={isTouchControlEnabled}
        icon={<Hand size={16} />}
        label={t('settings.touchControl')}
        onChange={(e) => setIsTouchControlEnabled(e.target.checked)}
      />
    </div>
  );
}

export default PointerControlSettings;
