import { useCallback } from 'react';
import { downloadBlob } from '../../utils/file';

interface UseFileExportOptions {
  content: BlobPart;
  fileName: string;
  mimeType: string;
}

function useFileExport({ content, fileName, mimeType }: UseFileExportOptions) {
  return useCallback(() => {
    const blob = new Blob([content], {
      type: mimeType,
    });

    downloadBlob(blob, fileName);
  }, [content, fileName, mimeType]);
}

export default useFileExport;
