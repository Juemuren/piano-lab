import { useTranslation } from 'react-i18next';
import { MousePointer, Hand } from 'lucide-react';
import ControlCheckbox from '../shared/ControlCheckbox';

type PointerControlSettingsProps = {
  isMouseControlEnabled: boolean;
  setIsMouseControlEnabled: (enabled: boolean) => void;
  isTouchControlEnabled: boolean;
  setIsTouchControlEnabled: (enabled: boolean) => void;
};

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
        label={t('settings.mouseControl')}
        icon={<MousePointer size={16} />}
        checked={isMouseControlEnabled}
        onChange={(e) => setIsMouseControlEnabled(e.target.checked)}
      />
      <ControlCheckbox
        label={t('settings.touchControl')}
        icon={<Hand size={16} />}
        checked={isTouchControlEnabled}
        onChange={(e) => setIsTouchControlEnabled(e.target.checked)}
      />
    </div>
  );
}

export default PointerControlSettings;
