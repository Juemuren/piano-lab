import {
  Activity,
  ChartColumnDecreasing,
  ChartLine,
  ChartSpline,
  Download,
  Layers,
  Sparkles,
  Upload,
  Volume,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSynthEngine } from '../../contexts/synthEngine';
import useFileExport from '../../hooks/file/useFileExport';
import useFileImport from '../../hooks/file/useFileImport';
import {
  createDefaultSynthConfig,
  normalizeSynthConfig,
} from '../../services/synth/SynthConfig';
import type {
  EffectConfig,
  EnvelopeConfig,
  SpectrumConfig,
  SynthConfig,
} from '../../types';
import CollapsibleSection from '../shared/CollapsibleSection';
import ControlButton from '../shared/ControlButton';
import ControlPanel from '../shared/ControlPanel';
import ControlRange from '../shared/ControlRange';
import ControlSelect from '../shared/ControlSelect';
import FileImportButton from '../shared/FileImportButton';
import Analysis from './Analysis';
import Effect from './Effect';
import Envelope from './Envelope';
import Spectrum from './Spectrum';

function SoundSynthesizer() {
  const { t } = useTranslation('synth');
  const synthEngine = useSynthEngine();
  const defaultConfig = useMemo(() => createDefaultSynthConfig(), []);
  const [oscillatorType, setOscillatorType] = useState(
    () => defaultConfig.synth.oscillatorType,
  );
  const [volumeRatio, setVolumeRatio] = useState(
    () => defaultConfig.synth.volumeRatio,
  );
  const [harmonicCount, setHarmonicCount] = useState(
    () => defaultConfig.synth.harmonicCount,
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
    synthEngine.configureSynth({
      oscillatorType,
      volumeRatio,
      harmonicCount,
    });
  }, [harmonicCount, oscillatorType, synthEngine, volumeRatio]);

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
          <ControlButton
            label="JSON"
            icon={<Download size={18} />}
            onClick={handleExportConfig}
          />
        </div>

        <ControlSelect
          label={t('controls.oscillatorType')}
          icon={<Activity size={16} />}
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
          icon={<Volume size={16} />}
          min="0"
          max="1"
          step="0.01"
          value={volumeRatio}
          displayValue={volumeRatio.toFixed(2)}
          onChange={setVolumeRatio}
        />
        <ControlRange
          label={t('controls.harmonicCount')}
          icon={<Layers size={16} />}
          min="2"
          max="20"
          step="1"
          value={harmonicCount}
          displayValue={harmonicCount.toString()}
          accentClassName="text-app-warning dark:text-app-warning-dark"
          onChange={(value) => setHarmonicCount(Math.round(value))}
          p={t('controls.harmonicCountWarning')}
          pClassName="text-app-warning/50 dark:text-app-warning-dark/50"
        />
      </div>

      <CollapsibleSection
        title={t('sections.envelope')}
        icon={<ChartSpline size={20} />}
        bgClassName="bg-app-surface/50 dark:bg-app-surface-dark/50"
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
        icon={<ChartColumnDecreasing size={20} />}
        bgClassName="bg-app-surface/50 dark:bg-app-surface-dark/50"
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
        icon={<Sparkles size={20} />}
        bgClassName="bg-app-surface/50 dark:bg-app-surface-dark/50"
        expanded
      >
        <Effect
          key={`effect-${importRevision}`}
          harmonicCount={harmonicCount}
          initialConfig={importedConfig?.effect}
          onConfigChange={setEffectConfig}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('sections.analysis')}
        icon={<ChartLine size={20} />}
        bgClassName="bg-app-surface/50 dark:bg-app-surface-dark/50"
        expanded
      >
        <Analysis />
      </CollapsibleSection>
    </ControlPanel>
  );
}

export default SoundSynthesizer;
