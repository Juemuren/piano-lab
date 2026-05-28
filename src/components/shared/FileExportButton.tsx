// import fileButtonClassName from './fileButtonClassName';

interface FileExportButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

function FileExportButton({
  label,
  disabled = false,
  onClick,
}: FileExportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        py-2 rounded-xl transition-colors
        bg-app-surface dark:bg-app-surface-dark
        hover:bg-app-surface-muted dark:hover:bg-app-surface-muted-dark
        disabled:cursor-not-allowed disabled:opacity-50
      "
    >
      {label}
    </button>
  );
}

export default FileExportButton;
