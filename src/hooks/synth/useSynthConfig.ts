import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';
import { createDefaultSynthConfig } from '../../services/synth/config/Factories';
import type { SynthConfig } from '../../services/synth/config/Schema';
import { parseSynthConfig } from '../../services/synth/config/Schema';
import type { EffectConfig } from '../../services/synth/EffectChain';
import type { EnvelopeConfig } from '../../services/synth/Envelope';
import type { SpectrumConfig } from '../../services/synth/Spectrum';
import useFileExport from '../file/useFileExport';
import useFileImport from '../file/useFileImport';

interface UseSynthConfigOptions {
  onImportError: () => void;
}

function useSynthConfig({ onImportError }: UseSynthConfigOptions) {
  const synthEngine = useSynthEngine();
  const [config, setConfig] = useState(createDefaultSynthConfig);
  const [importedConfig, setImportedConfig] = useState<SynthConfig | null>(
    null,
  );
  const [importRevision, setImportRevision] = useState(0);

  const updateSynthConfig = useCallback(
    <Key extends keyof SynthConfig['synth']>(
      key: Key,
      value: SynthConfig['synth'][Key],
    ) => {
      setConfig((current) => ({
        ...current,
        synth: { ...current.synth, [key]: value },
      }));
    },
    [],
  );

  const updateSpectrumConfig = useCallback((spectrum: SpectrumConfig) => {
    setConfig((current) => ({ ...current, spectrum }));
  }, []);

  const updateEnvelopeConfig = useCallback((envelope: EnvelopeConfig) => {
    setConfig((current) => ({ ...current, envelope }));
  }, []);

  const updateEffectConfig = useCallback((effect: EffectConfig) => {
    setConfig((current) => ({ ...current, effect }));
  }, []);

  const handleImportConfig = useCallback(
    (content: string) => {
      try {
        const imported = parseSynthConfig(content);
        setConfig(imported);
        setImportedConfig(imported);
        setImportRevision((revision) => revision + 1);
      } catch {
        onImportError();
      }
    },
    [onImportError],
  );

  const { fileInputRef, openFileDialog, handleFileChange } = useFileImport({
    onImport: handleImportConfig,
  });
  const configJson = useMemo(() => JSON.stringify(config, null, 2), [config]);
  const handleExportConfig = useFileExport({
    content: configJson,
    fileName: 'synth-config.json',
    mimeType: 'application/json',
  });

  useEffect(() => {
    synthEngine.configureSynth(config.synth);
  }, [config.synth, synthEngine]);

  return {
    config,
    fileInputRef,
    handleEffectConfigChange: updateEffectConfig,
    handleEnvelopeConfigChange: updateEnvelopeConfig,
    handleExportConfig,
    handleFileChange,
    handleSpectrumConfigChange: updateSpectrumConfig,
    importedConfig,
    importRevision,
    openFileDialog,
    updateSynthConfig,
  };
}

export default useSynthConfig;
