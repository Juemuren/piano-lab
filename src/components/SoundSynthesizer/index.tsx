import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AudioEngine } from '../../services/audio/AudioEngine';
import CollapsibleSection from '../shared/CollapsibleSection';
import ControlPanel from '../shared/ControlPanel';
import ControlRange from '../shared/ControlRange';
import ControlSelect from '../shared/ControlSelect';
import Envelope from './Envelope';
import Spectrum from './Spectrum';
import TransferFunction from './TransferFunction';

interface SoundSynthesizerProps {
  audioEngine: AudioEngine;
}

function SoundSynthesizer({ audioEngine }: SoundSynthesizerProps) {
  const { t } = useTranslation('piano');
  const [oscillatorType, setOscillatorType] = useState(() =>
    audioEngine.getOscillatorType(),
  );
  const [volume, setVolume] = useState(() => audioEngine.getVolume());
  const [harmonicCount, setHarmonicCount] = useState(() =>
    audioEngine.getHarmonicCount(),
  );

  useEffect(() => {
    audioEngine.setOscillatorType(oscillatorType);
  }, [audioEngine, oscillatorType]);

  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [audioEngine, volume]);

  useEffect(() => {
    audioEngine.setHarmonicCount(harmonicCount);
  }, [audioEngine, harmonicCount]);

  return (
    <ControlPanel className="space-y-4">
      <div>
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
          value={volume}
          displayValue={volume.toFixed(2)}
          onChange={setVolume}
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
        />
        <p className="text-xs text-app-warning/50 dark:text-app-warning-dark/50">
          {t('controls.harmonicCountWarning')}
        </p>
      </div>

      <CollapsibleSection
        title={t('sections.soundEnvelope')}
        bgClassName="bg-app-surface dark:bg-app-surface-dark"
        expanded
      >
        <Envelope audioEngine={audioEngine} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('sections.timbre')}
        bgClassName="bg-app-surface dark:bg-app-surface-dark"
        expanded
      >
        <Spectrum audioEngine={audioEngine} harmonicCount={harmonicCount} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('sections.transferFunction')}
        bgClassName="bg-app-surface dark:bg-app-surface-dark"
        expanded
      >
        <TransferFunction
          audioEngine={audioEngine}
          harmonicCount={harmonicCount}
        />
      </CollapsibleSection>
    </ControlPanel>
  );
}

export default SoundSynthesizer;
