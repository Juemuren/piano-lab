import { type ChangeEventHandler, type RefObject } from 'react';

interface FileImportButtonProps {
  label: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  accept?: string;
  fileInputId?: string;
  onClick: () => void;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

function FileImportButton({
  label,
  fileInputRef,
  accept,
  fileInputId,
  onClick,
  onChange,
}: FileImportButtonProps) {
  return (
    <>
      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={onClick}
        className="
        py-2 rounded-xl transition-colors
        bg-app-surface dark:bg-app-surface-dark
        hover:bg-app-surface-muted dark:hover:bg-app-surface-muted-dark
      "
      >
        {label}
      </button>
    </>
  );
}

export default FileImportButton;
