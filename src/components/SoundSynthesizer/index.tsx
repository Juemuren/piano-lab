import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Upload } from 'lucide-react';
import type {
  EnvelopeConfig,
  EffectConfig,
  SpectrumConfig,
  SynthConfig,
} from '../../types';
import {
  createDefaultSynthConfig,
  normalizeSynthConfig,
} from '../../services/synth/SynthConfig';
import { useSynthEngine } from '../../contexts/synthEngine';
import CollapsibleSection from '../shared/CollapsibleSection';
import ControlPanel from '../shared/ControlPanel';
import ControlRange from '../shared/ControlRange';
import ControlSelect from '../shared/ControlSelect';
import FileExportButton from '../shared/FileExportButton';
import FileImportButton from '../shared/FileImportButton';
import useFileExport from '../../hooks/file/useFileExport';
import useFileImport from '../../hooks/file/useFileImport';
import Envelope from './Envelope';
import Effect from './Effect';
import Spectrum from './Spectrum';

function SoundSynthesizer() {
  const { t } = useTranslation('synth');
  const synthEngine = useSynthEngine();
  const defaultConfig = useMemo(() => createDefaultSynthConfig(), []);
  const [oscillatorType, setOscillatorType] = useState(() =>
    synthEngine.getOscillatorType(),
  );
  const [volumeRatio, setVolumeRatio] = useState(() =>
    synthEngine.getVolumeRatio(),
  );
  const [harmonicCount, setHarmonicCount] = useState(() =>
    synthEngine.getHarmonicCount(),
  );
  const [envelopeConfig, setEnvelopeConfig] = useState<EnvelopeConfig>(
    defaultConfig.envelope,
  );
  const [spectrumConfig, setSpectrumConfig] = useState<SpectrumConfig>(
    defaultConfig.spectrum,
  );
  const [effectConfig, setEffectConfig] = useState<EffectConfig>(
    defaultConfig.effect,
  );
  const [importedConfig, setImportedConfig] = useState<SynthConfig | null>(
    null,
  );
  const [importRevision, setImportRevision] = useState(0);

  const synthConfig = useMemo<SynthConfig>(
    () => ({
      version: 1,
      synth: {
        oscillatorType,
        volumeRatio,
        harmonicCount,
      },
      envelope: envelopeConfig,
      spectrum: spectrumConfig,
      effect: effectConfig,
    }),
    [
      effectConfig,
      envelopeConfig,
      harmonicCount,
      oscillatorType,
      spectrumConfig,
      volumeRatio,
    ],
  );

  const synthConfigJson = useMemo(
    () => JSON.stringify(synthConfig, null, 2),
    [synthConfig],
  );

  const handleImportConfig = useCallback(
    (content: string) => {
      try {
        const config = normalizeSynthConfig(JSON.parse(content));
        if (!config) throw new Error('Invalid synth config');

        setOscillatorType(config.synth.oscillatorType);
        setVolumeRatio(config.synth.volumeRatio);
        setHarmonicCount(config.synth.harmonicCount);
        setEnvelopeConfig(config.envelope);
        setSpectrumConfig(config.spectrum);
        setEffectConfig(config.effect);
        setImportedConfig(config);
        setImportRevision((revision) => revision + 1);
      } catch {
        window.alert(t('config.importError'));
      }
    },
    [t],
  );

  const { fileInputRef, openFileDialog, handleFileChange } = useFileImport({
    onImport: handleImportConfig,
  });
  const handleExportConfig = useFileExport({
    content: synthConfigJson,
    fileName: 'synth-config.json',
    mimeType: 'application/json',
  });

  useEffect(() => {
    synthEngine.setOscillatorType(oscillatorType);
  }, [synthEngine, oscillatorType]);

  useEffect(() => {
    synthEngine.setVolumeRatio(volumeRatio);
  }, [synthEngine, volumeRatio]);

  useEffect(() => {
    synthEngine.setHarmonicCount(harmonicCount);
  }, [synthEngine, harmonicCount]);

  return (
    <ControlPanel className="space-y-4">
      <div>
        <div className="pb-2 grid gap-2 grid-cols-2">
          <FileImportButton
            fileInputRef={fileInputRef}
            accept=".json,application/json"
            label="JSON"
            icon={<Upload size={18} />}
            onClick={openFileDialog}
            onChange={handleFileChange}
          />
          <FileExportButton
            label="JSON"
            icon={<Download size={18} />}
            onClick={handleExportConfig}
          />
        </div>

        <ControlSelect
          value={oscillatorType}
          onChange={(e) => setOscillatorType(e.target.value as OscillatorType)}
        >
          <option value="sine">{t('oscillator.sine')}</option>
          <option value="triangle">{t('oscillator.triangle')}</option>
          <option value="sawtooth">{t('oscillator.sawtooth')}</option>
          <option value="square">{t('oscillator.square')}</option>
        </ControlSelect>
        <ControlRange
          label={t('controls.volume')}
          min="0"
          max="1"
          step="0.01"
          value={volumeRatio}
          displayValue={volumeRatio.toFixed(2)}
          onChange={setVolumeRatio}
        />
        <ControlRange
          label={t('controls.harmonicCount')}
          min="2"
          max="20"
          step="1"
          value={harmonicCount}
          displayValue={harmonicCount.toString()}
          accentClassName="accent-app-warning dark:accent-app-warning-dark"
          onChange={(value) => setHarmonicCount(Math.round(value))}
          p={t('controls.harmonicCountWarning')}
          pClassName="text-app-warning/50 dark:text-app-warning-dark/50"
        />
      </div>

      <CollapsibleSection
        title={t('sections.envelope')}
        bgClassName="bg-app-surface-muted/50 dark:bg-app-surface-muted-dark/50"
        expanded
      >
        <Envelope
          key={`envelope-${importRevision}`}
          initialConfig={importedConfig?.envelope}
          onConfigChange={setEnvelopeConfig}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('sections.spectrum')}
        bgClassName="bg-app-surface-muted/50 dark:bg-app-surface-muted-dark/50"
        expanded
      >
        <Spectrum
          key={`spectrum-${importRevision}`}
          harmonicCount={harmonicCount}
          initialConfig={importedConfig?.spectrum}
          onConfigChange={setSpectrumConfig}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('sections.effect')}
        bgClassName="bg-app-surface-muted/50 dark:bg-app-surface-muted-dark/50"
        expanded
      >
        <Effect
          key={`effect-${importRevision}`}
          harmonicCount={harmonicCount}
          initialConfig={importedConfig?.effect}
          onConfigChange={setEffectConfig}
        />
      </CollapsibleSection>
    </ControlPanel>
  );
}

export default SoundSynthesizer;
