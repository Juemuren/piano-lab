import { type ChangeEventHandler, type ReactNode, type RefObject } from 'react';
import ControlButton from './ControlButton';

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
        title={label}
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
      />
      <ControlButton label={label} icon={icon} onClick={onClick} />
    </>
  );
}

export default FileImportButton;
