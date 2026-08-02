import { Power, PowerOff } from 'lucide-react';
import ControlButton from '../../shared/ControlButton';

interface EffectToggleButtonProps {
  disableLabel: string;
  enabled: boolean;
  enableLabel: string;
  onClick: () => void;
  title: string;
}

function EffectToggleButton({
  disableLabel,
  enableLabel,
  enabled,
  onClick,
  title,
}: EffectToggleButtonProps) {
  return (
    <ControlButton
      bgClassName={
        enabled
          ? 'bg-app-error/15 hover:bg-app-error/25 dark:bg-app-error-dark/15 dark:hover:bg-app-error-dark/25'
          : 'bg-app-tip/15 hover:bg-app-tip/25 dark:bg-app-tip-dark/15 dark:hover:bg-app-tip-dark/25'
      }
      colorClassName={
        enabled
          ? 'text-app-error dark:text-app-error-dark'
          : 'text-app-tip dark:text-app-tip-dark'
      }
      icon={enabled ? <Power size={18} /> : <PowerOff size={18} />}
      label={enabled ? disableLabel : enableLabel}
      onClick={onClick}
      title={title}
    />
  );
}

export default EffectToggleButton;
