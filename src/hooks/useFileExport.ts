import { useCallback } from 'react';

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
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }, [content, fileName, mimeType]);
}

export default useFileExport;
