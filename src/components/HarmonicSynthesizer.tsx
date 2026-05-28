import { useTranslation } from 'react-i18next';
import { AudioEngine } from '../services/audio/AudioEngine';
import ControlPanel from './shared/ControlPanel';
import HarmonicEnvelopePreview from './HarmonicEnvelopePreview';
import HarmonicSynthesizerParameterControls from './HarmonicSynthesizerParameterControls';
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
      <HarmonicSynthesizerParameterControls
        oscillatorType={oscillatorType}
        volume={volume}
        attackTime={attackTime}
        decayTime={decayTime}
        releaseTime={releaseTime}
        sustainGain={sustainGain}
        silenceGain={silenceGain}
        harmonicCount={harmonicCount}
        labels={{
          sine: t('oscillator.sine'),
          triangle: t('oscillator.triangle'),
          sawtooth: t('oscillator.sawtooth'),
          square: t('oscillator.square'),
          volume: t('controls.volume'),
          attackTime: t('controls.attackTime'),
          decayTime: t('controls.decayTime'),
          releaseTime: t('controls.releaseTime'),
          sustainGain: t('controls.sustainGain'),
          silenceGain: t('controls.silenceGain'),
          harmonicCount: t('controls.harmonicCount'),
          harmonicCountWarning: t('controls.harmonicCountWarning'),
        }}
        onOscillatorTypeChange={setOscillatorType}
        onVolumeChange={setVolume}
        onAttackTimeChange={setAttackTime}
        onDecayTimeChange={setDecayTime}
        onReleaseTimeChange={setReleaseTime}
        onSustainGainChange={setSustainGain}
        onSilenceGainChange={setSilenceGain}
        onHarmonicCountChange={handleHarmonicCountChange}
      />

      <HarmonicEnvelopePreview
        title={t('charts.envelopeCurve')}
        envelopeCurve={envelopeCurve}
        containerRef={envelopeChartContainerRef}
        width={envelopeChartWidth}
      />
    </ControlPanel>
  );
}

export default HarmonicSynthesizer;
