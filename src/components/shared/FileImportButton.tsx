import type { ChangeEventHandler, ReactNode, RefObject } from 'react';
import ControlButton from './ControlButton';

interface FileImportButtonProps {
  accept?: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  icon?: ReactNode;
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick: () => void;
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
        accept={accept}
        className="hidden"
        onChange={onChange}
        ref={fileInputRef}
        title={label}
        type="file"
      />
      <ControlButton icon={icon} label={label} onClick={onClick} />
    </>
  );
}

export default FileImportButton;
