import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AudioEngine } from '../../services/audio/AudioEngine';
import CollapsibleSection from '../shared/CollapsibleSection';
import ControlPanel from '../shared/ControlPanel';
import ControlRange from '../shared/ControlRange';
import HarmonicSynthesizer from './Harmonic';
import TimbreAdjuster from './Timbre';
import TransferFunctionModifier from './TransferFunction';

interface SoundSynthesizerProps {
  audioEngine: AudioEngine;
}

function SoundSynthesizer({ audioEngine }: SoundSynthesizerProps) {
  const { t } = useTranslation('piano');
  const [harmonicCount, setHarmonicCount] = useState(() =>
    audioEngine.getHarmonicCount(),
  );

  useEffect(() => {
    audioEngine.setHarmonicCount(harmonicCount);
  }, [audioEngine, harmonicCount]);

  return (
    <ControlPanel className="space-y-4">
      <div>
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
        bgClassName=""
        expanded
      >
        <HarmonicSynthesizer audioEngine={audioEngine} />
      </CollapsibleSection>

      <CollapsibleSection title={t('sections.timbre')} bgClassName="" expanded>
        <TimbreAdjuster
          audioEngine={audioEngine}
          harmonicCount={harmonicCount}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('sections.transferFunction')}
        bgClassName=""
        expanded
      >
        <TransferFunctionModifier
          audioEngine={audioEngine}
          harmonicCount={harmonicCount}
        />
      </CollapsibleSection>
    </ControlPanel>
  );
}

export default SoundSynthesizer;
