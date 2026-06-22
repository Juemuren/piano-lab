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
  title,
  onClick,
}: ControlButtonProps) {
  return (
    <button
      className="
        inline-flex items-center justify-center gap-2 p-2 rounded-xl transition-colors
        bg-app-surface dark:bg-app-surface-dark
        hover:bg-app-overlay dark:hover:bg-app-overlay-dark
        disabled:cursor-not-allowed disabled:opacity-50
      "
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
