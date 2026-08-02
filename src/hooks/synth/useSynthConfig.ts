import { useCallback } from 'react';
import type { SynthConfig } from '../../services/synth/config/Schema';
import { parseSynthConfig } from '../../services/synth/config/Schema';
import {
  useSynthConfigStore,
  useSynthConfigStoreApi,
} from '../../stores/synthConfigStore';
import useFileExport from '../file/useFileExport';
import useFileImport from '../file/useFileImport';

interface UseSynthConfigOptions {
  onImportError: () => void;
}

function useSynthConfig({ onImportError }: UseSynthConfigOptions) {
  const store = useSynthConfigStoreApi();
  const setConfig = useSynthConfigStore((state) => state.setConfig);
  const setSynthConfig = useSynthConfigStore((state) => state.setSynthConfig);

  const updateSynthConfig = useCallback(
    <Key extends keyof SynthConfig['synth']>(
      key: Key,
      value: SynthConfig['synth'][Key],
    ) => {
      setSynthConfig((current) => ({ ...current, [key]: value }));
    },
    [setSynthConfig],
  );

  const handleImportConfig = useCallback(
    (content: string) => {
      try {
        const imported = parseSynthConfig(content);
        setConfig(imported);
      } catch {
        onImportError();
      }
    },
    [onImportError, setConfig],
  );

  const { fileInputRef, openFileDialog, handleFileChange } = useFileImport({
    onImport: handleImportConfig,
  });
  const handleExportConfig = useFileExport({
    content: () => JSON.stringify(store.getState().config, null, 2),
    fileName: 'synth-config.json',
    mimeType: 'application/json',
  });

  return {
    fileInputRef,
    handleExportConfig,
    handleFileChange,
    openFileDialog,
    updateSynthConfig,
  };
}

export default useSynthConfig;
