import type { ReactNode } from 'react';

interface ControlButtonProps {
  bgClassName?: string;
  colorClassName?: string;
  disabled?: boolean;
  icon?: ReactNode;
  label?: string;
  onClick: () => void;
  title?: string;
}

function ControlButton({
  bgClassName = 'bg-app-surface hover:bg-app-overlay dark:bg-app-surface-dark dark:hover:bg-app-overlay-dark',
  colorClassName = '',
  label,
  icon,
  disabled = false,
  title,
  onClick,
}: ControlButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${bgClassName} ${colorClassName}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

export default ControlButton;
