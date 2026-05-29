import { useTranslation } from 'react-i18next';
import { AudioEngine } from '../../../services/audio/AudioEngine';
import ControlPanel from '../../shared/ControlPanel';
import EnvelopeCurvePreview from './EnvelopeCurvePreview';
import EnvelopeParameterControls from './EnvelopeParameterControls';
import useEnvelopeControl from '../../../hooks/useEnvelopeControl';

interface EnvelopeProps {
  audioEngine: AudioEngine;
}

function Envelope({ audioEngine }: EnvelopeProps) {
  const { t } = useTranslation('piano');
  const {
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
  } = useEnvelopeControl(audioEngine);

  return (
    <ControlPanel>
      <EnvelopeParameterControls
        attackTime={attackTime}
        decayTime={decayTime}
        releaseTime={releaseTime}
        sustainGain={sustainGain}
        silenceGain={silenceGain}
        labels={{
          attackTime: t('controls.attackTime'),
          decayTime: t('controls.decayTime'),
          releaseTime: t('controls.releaseTime'),
          sustainGain: t('controls.sustainGain'),
          silenceGain: t('controls.silenceGain'),
        }}
        onAttackTimeChange={setAttackTime}
        onDecayTimeChange={setDecayTime}
        onReleaseTimeChange={setReleaseTime}
        onSustainGainChange={setSustainGain}
        onSilenceGainChange={setSilenceGain}
      />

      <EnvelopeCurvePreview
        title={t('charts.amplitudeEnvelopeCurve')}
        envelopeCurve={envelopeCurve}
        containerRef={envelopeChartContainerRef}
        width={envelopeChartWidth}
      />
    </ControlPanel>
  );
}

export default Envelope;
