import type { ReactNode } from 'react';
import ControlButton from './ControlButton';

interface FileExportButtonProps {
  disabled?: boolean;
  icon?: ReactNode;
  label: string;
  onClick: () => void;
}

function FileExportButton({
  disabled = false,
  icon,
  label,
  onClick,
}: FileExportButtonProps) {
  return (
    <ControlButton
      bgClassName="bg-app-info/15 hover:bg-app-info/25 dark:bg-app-info-dark/15 dark:hover:bg-app-info-dark/25"
      colorClassName="text-app-info dark:text-app-info-dark"
      disabled={disabled}
      icon={icon}
      label={label}
      onClick={onClick}
    />
  );
}

export default FileExportButton;
