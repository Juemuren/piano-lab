import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useSyncSynthEngine from '../../hooks/synth/useSyncSynthEngine';
import useSynthConfig from '../../hooks/synth/useSynthConfig';
import { SynthConfigStoreProvider } from '../../stores/SynthConfigStoreProvider';
import ControlPanel from '../shared/ControlPanel';
import SynthConfigFileActions from './SynthConfigFileActions';
import SynthControls from './SynthControls';
import SynthSections from './SynthSections';

function SoundSynthesizerContent() {
  const { t } = useTranslation('synth');
  useSyncSynthEngine();
  const handleImportError = useCallback(() => {
    window.alert(t('config.importError'));
  }, [t]);
  const {
    fileInputRef,
    handleExportConfig,
    handleFileChange,
    openFileDialog,
    updateSynthConfig,
  } = useSynthConfig({ onImportError: handleImportError });
  return (
    <ControlPanel className="space-y-4">
      <div>
        <SynthConfigFileActions
          fileInputRef={fileInputRef}
          onExport={handleExportConfig}
          onFileChange={handleFileChange}
          onImport={openFileDialog}
        />
        <SynthControls updateSynthConfig={updateSynthConfig} />
      </div>
      <SynthSections />
    </ControlPanel>
  );
}

function SoundSynthesizer() {
  return (
    <SynthConfigStoreProvider>
      <SoundSynthesizerContent />
    </SynthConfigStoreProvider>
  );
}

export default SoundSynthesizer;
