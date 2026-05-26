import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AudioEngine } from '../services/audio/AudioEngine';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import ControlRange from './shared/ControlRange';

interface HarmonicSynthesizerProps {
  audioEngine: AudioEngine;
  harmonicCount: number;
  onHarmonicCountChange: (value: number) => void;
}

const HarmonicSynthesizer: React.FC<HarmonicSynthesizerProps> = ({
  audioEngine,
  harmonicCount,
  onHarmonicCountChange,
}) => {
  const { t } = useTranslation('piano');
  const [oscillatorType, setOscillatorType] = useState(
    audioEngine.getOscillatorType(),
  );
  const [volume, setVolume] = useState(audioEngine.getVolume());
  const [attackTime, setAttackTime] = useState(audioEngine.getAttackTime());
  const [decayTime, setDecayTime] = useState(audioEngine.getDecayTime());
  const [releaseTime, setReleaseTime] = useState(audioEngine.getReleaseTime());
  const [sustainGain, setSustainGain] = useState(audioEngine.getSustainGain());
  const [silenceGain, setSilenceGain] = useState(audioEngine.getSilenceGain());

  useEffect(() => {
    audioEngine.setOscillatorType(oscillatorType);
  }, [oscillatorType, audioEngine]);

  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume, audioEngine]);

  useEffect(() => {
    audioEngine.setAttackTime(attackTime);
  }, [attackTime, audioEngine]);

  useEffect(() => {
    audioEngine.setDecayTime(decayTime);
  }, [decayTime, audioEngine]);

  useEffect(() => {
    audioEngine.setReleaseTime(releaseTime);
  }, [releaseTime, audioEngine]);

  useEffect(() => {
    audioEngine.setSustainGain(sustainGain);
  }, [sustainGain, audioEngine]);

  useEffect(() => {
    audioEngine.setSilenceGain(silenceGain);
  }, [silenceGain, audioEngine]);

  useEffect(() => {
    audioEngine.setHarmonicCount(harmonicCount);
  }, [harmonicCount, audioEngine]);

  const handleHarmonicCountChange = (value: number) => {
    onHarmonicCountChange(Math.round(value));
  };

  return (
    <ControlPanel>
      <div className="mb-4 flex flex-col gap-3">
        <div className="space-y-2">
          <ControlSelect
            value={oscillatorType}
            onChange={(e) =>
              setOscillatorType(e.target.value as OscillatorType)
            }
          >
            <option value="sine">{t('oscillator.sine')}</option>
            <option value="triangle">{t('oscillator.triangle')}</option>
            <option value="sawtooth">{t('oscillator.sawtooth')}</option>
            <option value="square">{t('oscillator.square')}</option>
          </ControlSelect>
        </div>
      </div>

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
        label={t('controls.attackTime')}
        min="0.001"
        max="0.1"
        step="0.001"
        value={attackTime}
        displayValue={`${attackTime.toFixed(3)} s`}
        onChange={setAttackTime}
      />
      <ControlRange
        label={t('controls.decayTime')}
        min="0.01"
        max="1"
        step="0.01"
        value={decayTime}
        displayValue={`${decayTime.toFixed(2)} s`}
        onChange={setDecayTime}
      />
      <ControlRange
        label={t('controls.releaseTime')}
        min="0.01"
        max="1"
        step="0.01"
        value={releaseTime}
        displayValue={`${releaseTime.toFixed(2)} s`}
        onChange={setReleaseTime}
      />
      <ControlRange
        label={t('controls.sustainGain')}
        min="0.1"
        max="1"
        step="0.01"
        value={sustainGain}
        displayValue={sustainGain.toFixed(2)}
        onChange={setSustainGain}
      />
      <ControlRange
        label={t('controls.silenceGain')}
        min="0.000001"
        max="0.001"
        step="0.000001"
        value={silenceGain}
        displayValue={silenceGain.toExponential(2)}
        onChange={setSilenceGain}
      />
      <ControlRange
        label={t('controls.harmonicCount')}
        min="2"
        max="20"
        step="1"
        value={harmonicCount}
        displayValue={harmonicCount.toString()}
        accentClassName="accent-app-warning"
        onChange={handleHarmonicCountChange}
      />
      <p
        className="
          mb-4 px-3 py-2
          rounded-lg bg-app-warning-surface dark:bg-app-warning-surface-dark
          border border-app-warning/60 dark:border-app-warning/40 
          text-xs text-app-warning-text dark:text-app-warning-text-dark
        "
      >
        {t('controls.harmonicCountWarning')}
      </p>
    </ControlPanel>
  );
};

export default HarmonicSynthesizer;
