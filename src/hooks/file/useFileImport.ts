import type { ChangeEventHandler, RefObject } from 'react';
import { useCallback, useRef } from 'react';

interface UseFileImportOptions {
  onImport: (content: string, file: File) => void | Promise<void>;
}

interface UseFileImportResult {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFileChange: ChangeEventHandler<HTMLInputElement>;
  openFileDialog: () => void;
}

function useFileImport({
  onImport,
}: UseFileImportOptions): UseFileImportResult {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        file.text().then((content) => onImport(content, file));
      }
      e.target.value = '';
    },
    [onImport],
  );

  return {
    fileInputRef,
    handleFileChange,
    openFileDialog,
  };
}

export default useFileImport;
