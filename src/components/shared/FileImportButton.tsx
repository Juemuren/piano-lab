import { type ChangeEventHandler, type ReactNode, type RefObject } from 'react';

interface FileImportButtonProps {
  label: string;
  icon?: ReactNode;
  fileInputRef: RefObject<HTMLInputElement | null>;
  accept?: string;
  onClick: () => void;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

function FileImportButton({
  label,
  icon,
  fileInputRef,
  accept,
  onClick,
  onChange,
}: FileImportButtonProps) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={onClick}
        className="
        inline-flex items-center justify-center gap-2 p-2 rounded-xl transition-colors
        bg-app-surface dark:bg-app-surface-dark
        hover:bg-app-surface-muted dark:hover:bg-app-surface-muted-dark
      "
      >
        {icon}
        {label}
      </button>
    </>
  );
}

export default FileImportButton;
