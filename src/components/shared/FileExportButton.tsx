import type { ReactNode } from 'react';

interface FileExportButtonProps {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

function FileExportButton({
  label,
  icon,
  disabled = false,
  onClick,
}: FileExportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        inline-flex items-center justify-center gap-2 p-2 rounded-xl transition-colors
        bg-app-surface dark:bg-app-surface-dark
        hover:bg-app-surface-muted dark:hover:bg-app-surface-muted-dark
        disabled:cursor-not-allowed disabled:opacity-50
      "
    >
      {icon}
      {label}
    </button>
  );
}

export default FileExportButton;
