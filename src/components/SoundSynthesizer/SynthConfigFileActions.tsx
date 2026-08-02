import { Download, Upload } from 'lucide-react';
import type { ChangeEventHandler, RefObject } from 'react';
import FileExportButton from '../shared/FileExportButton';
import FileImportButton from '../shared/FileImportButton';

interface SynthConfigFileActionsProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onExport: () => void;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  onImport: () => void;
}

function SynthConfigFileActions({
  fileInputRef,
  onExport,
  onFileChange,
  onImport,
}: SynthConfigFileActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 pb-2">
      <FileImportButton
        accept=".json,application/json"
        fileInputRef={fileInputRef}
        icon={<Upload size={18} />}
        label="JSON"
        onChange={onFileChange}
        onClick={onImport}
      />
      <FileExportButton
        icon={<Download size={18} />}
        label="JSON"
        onClick={onExport}
      />
    </div>
  );
}

export default SynthConfigFileActions;
