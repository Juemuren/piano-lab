import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Plot from 'react-plotly.js';
import { AudioEngine } from '../services/audio/AudioEngine';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import ControlRange from './shared/ControlRange';

interface HarmonicSynthesizerProps {
  audioEngine: AudioEngine;
  harmonicCount: number;
  onHarmonicCountChange: (value: number) => void;
}

const ENVELOPE_SUSTAIN_SECONDS = 1;
const ENVELOPE_HARMONIC_TIMES = 1;
const ENVELOPE_POINTS_PER_SEGMENT = 50;

function sampleExponentialRamp(
  startTime: number,
  endTime: number,
  startGain: number,
  endGain: number,
) {
  return Array.from({ length: ENVELOPE_POINTS_PER_SEGMENT + 1 }, (_, index) => {
    const progress = index / ENVELOPE_POINTS_PER_SEGMENT;
    const time = startTime + (endTime - startTime) * progress;
    const gain = startGain * Math.pow(endGain / startGain, progress);

    return { time, gain };
  });
}

function HarmonicSynthesizer({
  audioEngine,
  harmonicCount,
  onHarmonicCountChange,
}: HarmonicSynthesizerProps) {
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

  const envelopeCurve = useMemo(() => {
    const attackEnd = attackTime;
    const decayEnd = attackEnd + decayTime;
    const sustainEnd = decayEnd + ENVELOPE_SUSTAIN_SECONDS;
    const releaseEnd = sustainEnd + releaseTime;
    const attackGain = volume;
    const decayGain = Math.max(attackGain * sustainGain, silenceGain);
    const holdGain = Math.max(
      decayGain / Math.sqrt(1 + ENVELOPE_HARMONIC_TIMES),
      silenceGain,
    );

    const points = [
      ...sampleExponentialRamp(0, attackEnd, silenceGain, attackGain),
      ...sampleExponentialRamp(attackEnd, decayEnd, attackGain, decayGain),
      ...sampleExponentialRamp(decayEnd, sustainEnd, decayGain, holdGain),
      ...sampleExponentialRamp(sustainEnd, releaseEnd, holdGain, silenceGain),
    ];

    return {
      time: points.map(({ time }) => time),
      gain: points.map(({ gain }) => gain),
      maxTime: releaseEnd,
    };
  }, [volume, attackTime, decayTime, releaseTime, silenceGain, sustainGain]);

  return (
    <ControlPanel>
      <ControlSelect
        value={oscillatorType}
        onChange={(e) => setOscillatorType(e.target.value as OscillatorType)}
      >
        <option value="sine">{t('oscillator.sine')}</option>
        <option value="triangle">{t('oscillator.triangle')}</option>
        <option value="sawtooth">{t('oscillator.sawtooth')}</option>
        <option value="square">{t('oscillator.square')}</option>
      </ControlSelect>

      <details open className="mt-4">
        <summary className="text-lg font-bold">
          {t('charts.envelopeCurve')}
        </summary>
        <Plot
          data={[
            {
              x: envelopeCurve.time,
              y: envelopeCurve.gain,
              type: 'scatter',
              mode: 'lines',
            },
          ]}
          layout={{
            autosize: true,
            margin: { t: 40, r: 40, b: 40, l: 40 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
              ticksuffix: 's',
              fixedrange: true,
              gridcolor: 'rgba(128,128,128,0.25)',
            },
            yaxis: {
              fixedrange: true,
              gridcolor: 'rgba(128,128,128,0.25)',
            },
          }}
          config={{
            autosizable: true,
            displayModeBar: false,
          }}
          useResizeHandler
          className="h-full w-full"
        />
      </details>

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
        accentClassName="accent-app-warning dark:accent-app-warning-dark"
        onChange={handleHarmonicCountChange}
      />
      <p
        className="
          text-xs text-app-warning/50 dark:text-app-warning-dark/50
        "
      >
        {t('controls.harmonicCountWarning')}
      </p>
    </ControlPanel>
  );
}

export default HarmonicSynthesizer;
