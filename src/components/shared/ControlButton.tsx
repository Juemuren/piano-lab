import type { ReactNode } from 'react';

type ControlButtonProps = {
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
  title?: string;
  onClick: () => void;
};

function ControlButton({
  label,
  icon,
  disabled = false,
  onClick,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="
        inline-flex items-center justify-center gap-2 p-2 rounded-xl transition-colors
        bg-app-surface dark:bg-app-surface-dark
        hover:bg-app-surface-muted dark:hover:bg-app-surface-muted-dark
        disabled:cursor-not-allowed disabled:opacity-50
      "
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

export default ControlButton;
