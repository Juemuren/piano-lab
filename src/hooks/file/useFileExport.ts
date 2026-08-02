import { useCallback } from 'react';
import { downloadBlob } from '../../utils/file';

interface UseFileExportOptions {
  content: BlobPart | (() => BlobPart);
  fileName: string;
  mimeType: string;
}

function useFileExport({ content, fileName, mimeType }: UseFileExportOptions) {
  return useCallback(() => {
    const resolvedContent = typeof content === 'function' ? content() : content;
    const blob = new Blob([resolvedContent], {
      type: mimeType,
    });

    downloadBlob(blob, fileName);
  }, [content, fileName, mimeType]);
}

export default useFileExport;
