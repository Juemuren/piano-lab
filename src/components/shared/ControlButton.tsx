import type { ReactNode } from 'react';

interface ControlButtonProps {
  disabled?: boolean;
  icon?: ReactNode;
  label?: string;
  onClick: () => void;
  title?: string;
}

function ControlButton({
  label,
  icon,
  disabled = false,
  title,
  onClick,
}: ControlButtonProps) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-app-surface p-2 transition-colors hover:bg-app-overlay disabled:cursor-not-allowed disabled:opacity-50 dark:bg-app-surface-dark dark:hover:bg-app-overlay-dark"
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
