import { useTranslation } from 'react-i18next';
import Scatter from 'react-plotly.js/scatter';
import { AudioEngine } from '../services/audio/AudioEngine';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import ControlRange from './shared/ControlRange';
import useHarmonicSynthesizerControl from '../hooks/useHarmonicSynthesizerControl';

interface HarmonicSynthesizerProps {
  audioEngine: AudioEngine;
  harmonicCount: number;
  onHarmonicCountChange: (value: number) => void;
}

function HarmonicSynthesizer({
  audioEngine,
  harmonicCount,
  onHarmonicCountChange,
}: HarmonicSynthesizerProps) {
  const { t } = useTranslation('piano');
  const {
    oscillatorType,
    setOscillatorType,
    volume,
    setVolume,
    attackTime,
    setAttackTime,
    decayTime,
    setDecayTime,
    releaseTime,
    setReleaseTime,
    sustainGain,
    setSustainGain,
    silenceGain,
    setSilenceGain,
    envelopeChartContainerRef,
    envelopeChartWidth,
    envelopeCurve,
    handleHarmonicCountChange,
  } = useHarmonicSynthesizerControl(
    audioEngine,
    harmonicCount,
    onHarmonicCountChange,
  );

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
        <div ref={envelopeChartContainerRef} className="w-full">
          {envelopeChartWidth > 0 && (
            <Scatter
              data={[
                {
                  x: envelopeCurve.time,
                  y: envelopeCurve.gain,
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
              style={{
                width: `${envelopeChartWidth}px`,
                height: `100%`,
              }}
              useResizeHandler
            />
          )}
        </div>
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
