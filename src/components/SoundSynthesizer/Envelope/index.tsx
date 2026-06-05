import { useTranslation } from 'react-i18next';
import type { EnvelopeConfig } from '../../../types';
import EnvelopeCurvePreview from './EnvelopeCurvePreview';
import EnvelopeParameterControls from './EnvelopeParameterControls';
import useEnvelopeControl from '../../../hooks/synth/useEnvelopeControl';

interface EnvelopeProps {
  initialConfig?: EnvelopeConfig | null;
  onConfigChange?: (config: EnvelopeConfig) => void;
}

function Envelope({ initialConfig, onConfigChange }: EnvelopeProps) {
  const { t } = useTranslation('synth');
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
    envelopeCurve,
  } = useEnvelopeControl(initialConfig, onConfigChange);

  return (
    <>
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
      />
    </>
  );
}

export default Envelope;
