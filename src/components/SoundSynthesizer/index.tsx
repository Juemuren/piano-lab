import {
  Activity,
  ChartColumnDecreasing,
  ChartLine,
  ChartSpline,
  Download,
  Layers2,
  Layers3,
  Sparkles,
  Upload,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSynthEngine } from '../../contexts/synthEngine';
import useFileExport from '../../hooks/file/useFileExport';
import useFileImport from '../../hooks/file/useFileImport';
import type { SynthConfig } from '../../services/synth/config/Defaults';
import { createDefaultSynthConfig } from '../../services/synth/config/Defaults';
import type { EffectConfig } from '../../services/synth/EffectChain';
import type { EnvelopeConfig } from '../../services/synth/Envelope';
import type { SpectrumConfig } from '../../services/synth/Spectrum';
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
      effect: effectConfig,
      envelope: envelopeConfig,
      spectrum: spectrumConfig,
      synth: {
        harmonicCount,
        oscillatorType,
        volumeRatio,
      },
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
  const volumeIcon = useMemo(() => {
    if (volumeRatio === 0) return <VolumeX size={16} />;
    if (volumeRatio >= 0.5) return <Volume2 size={16} />;

    return <Volume1 size={16} />;
  }, [volumeRatio]);
  const harmonicIcon = useMemo(() => {
    if (harmonicCount >= 10) return <Layers3 size={16} />;

    return <Layers2 size={16} />;
  }, [harmonicCount]);

  const handleImportConfig = useCallback(
    (content: string) => {
      try {
        const config = JSON.parse(content) as SynthConfig;

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
      harmonicCount,
      oscillatorType,
      volumeRatio,
    });
  }, [harmonicCount, oscillatorType, synthEngine, volumeRatio]);

  return (
    <ControlPanel className="space-y-4">
      <div>
        <div className="grid grid-cols-2 gap-2 pb-2">
          <FileImportButton
            accept=".json,application/json"
            fileInputRef={fileInputRef}
            icon={<Upload size={18} />}
            label="JSON"
            onChange={handleFileChange}
            onClick={openFileDialog}
          />
          <ControlButton
            icon={<Download size={18} />}
            label="JSON"
            onClick={handleExportConfig}
          />
        </div>

        <ControlSelect
          icon={<Activity size={16} />}
          label={t('controls.oscillatorType')}
          onChange={(e) => setOscillatorType(e.target.value as OscillatorType)}
          value={oscillatorType}
        >
          <option value="sine">{t('oscillator.sine')}</option>
          <option value="triangle">{t('oscillator.triangle')}</option>
          <option value="sawtooth">{t('oscillator.sawtooth')}</option>
          <option value="square">{t('oscillator.square')}</option>
        </ControlSelect>
        <ControlRange
          displayValue={`${Math.trunc(volumeRatio * 100).toString()}%`}
          icon={volumeIcon}
          label={t('controls.volume')}
          max="1"
          min="0"
          onChange={setVolumeRatio}
          step="0.01"
          value={volumeRatio}
        />
        <ControlRange
          accentClassName="text-app-warning dark:text-app-warning-dark"
          displayValue={harmonicCount.toString()}
          icon={harmonicIcon}
          label={t('controls.harmonicCount')}
          max="20"
          min="2"
          onChange={(value) => setHarmonicCount(Math.round(value))}
          p={t('controls.harmonicCountWarning')}
          pClassName="text-app-warning/50 dark:text-app-warning-dark/50"
          step="1"
          value={harmonicCount}
        />
      </div>

      <CollapsibleSection
        bgClassName="bg-app-surface/50 dark:bg-app-surface-dark/50"
        expanded
        icon={<ChartColumnDecreasing size={20} />}
        title={t('sections.spectrum')}
      >
        <Spectrum
          harmonicCount={harmonicCount}
          initialConfig={importedConfig?.spectrum}
          key={`spectrum-${importRevision}`}
          onConfigChange={setSpectrumConfig}
        />
      </CollapsibleSection>

      <CollapsibleSection
        bgClassName="bg-app-surface/50 dark:bg-app-surface-dark/50"
        expanded
        icon={<ChartSpline size={20} />}
        title={t('sections.envelope')}
      >
        <Envelope
          initialConfig={importedConfig?.envelope}
          key={`envelope-${importRevision}`}
          onConfigChange={setEnvelopeConfig}
        />
      </CollapsibleSection>

      <CollapsibleSection
        bgClassName="bg-app-surface/50 dark:bg-app-surface-dark/50"
        expanded
        icon={<Sparkles size={20} />}
        title={t('sections.effect')}
      >
        <Effect
          harmonicCount={harmonicCount}
          initialConfig={importedConfig?.effect}
          key={`effect-${importRevision}`}
          onConfigChange={setEffectConfig}
        />
      </CollapsibleSection>

      <CollapsibleSection
        bgClassName="bg-app-surface/50 dark:bg-app-surface-dark/50"
        expanded
        icon={<ChartLine size={20} />}
        title={t('sections.analysis')}
      >
        <Analysis />
      </CollapsibleSection>
    </ControlPanel>
  );
}

export default SoundSynthesizer;
