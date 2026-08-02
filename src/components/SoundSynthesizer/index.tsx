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
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useSynthConfig from '../../hooks/synth/useSynthConfig';
import type { SynthOscillatorType } from '../../services/synth/config/Options';
import { SYNTH_CONFIG_RANGES } from '../../services/synth/config/Ranges';
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
  const handleImportError = useCallback(() => {
    window.alert(t('config.importError'));
  }, [t]);
  const {
    config,
    fileInputRef,
    handleEffectConfigChange,
    handleEnvelopeConfigChange,
    handleExportConfig,
    handleFileChange,
    handleSpectrumConfigChange,
    importRevision,
    importedConfig,
    openFileDialog,
    updateSynthConfig,
  } = useSynthConfig({ onImportError: handleImportError });
  const { harmonicCount, oscillatorType, volumeRatio } = config.synth;
  const volumeIcon = useMemo(() => {
    if (volumeRatio === 0) return <VolumeX size={16} />;
    if (volumeRatio >= 0.5) return <Volume2 size={16} />;

    return <Volume1 size={16} />;
  }, [volumeRatio]);
  const harmonicIcon = useMemo(() => {
    if (harmonicCount >= 10) return <Layers3 size={16} />;

    return <Layers2 size={16} />;
  }, [harmonicCount]);

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
          onChange={(e) =>
            updateSynthConfig(
              'oscillatorType',
              e.target.value as SynthOscillatorType,
            )
          }
          value={oscillatorType}
        >
          <option value="sine">{t('oscillator.sine')}</option>
          <option value="triangle">{t('oscillator.triangle')}</option>
          <option value="sawtooth">{t('oscillator.sawtooth')}</option>
          <option value="square">{t('oscillator.square')}</option>
        </ControlSelect>
        <ControlRange
          {...SYNTH_CONFIG_RANGES.synth.volumeRatio}
          displayValue={`${Math.trunc(volumeRatio * 100).toString()}%`}
          icon={volumeIcon}
          label={t('controls.volume')}
          onChange={(value) => updateSynthConfig('volumeRatio', value)}
          step="0.01"
          value={volumeRatio}
        />
        <ControlRange
          {...SYNTH_CONFIG_RANGES.synth.harmonicCount}
          accentClassName="text-app-warning dark:text-app-warning-dark"
          displayValue={harmonicCount.toString()}
          icon={harmonicIcon}
          label={t('controls.harmonicCount')}
          onChange={(value) =>
            updateSynthConfig('harmonicCount', Math.round(value))
          }
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
          onConfigChange={handleSpectrumConfigChange}
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
          onConfigChange={handleEnvelopeConfigChange}
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
          onConfigChange={handleEffectConfigChange}
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
