import { useTranslation } from 'react-i18next';
import useEnvelopeControl from '../../../hooks/synth/useEnvelopeControl';
import type { EnvelopeConfig } from '../../../types/synth';
import EnvelopeCurvePreview from './EnvelopeCurvePreview';
import EnvelopeFormulaPreview from './EnvelopeFormulaPreview';
import EnvelopeParameterControls from './EnvelopeParameterControls';

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
        labels={{
          attackTime: t('envelope.attackTime'),
          decayTime: t('envelope.decayTime'),
          releaseTime: t('envelope.releaseTime'),
          silenceGain: t('envelope.silenceGain'),
          sustainGain: t('envelope.sustainGain'),
        }}
        onAttackTimeChange={setAttackTime}
        onDecayTimeChange={setDecayTime}
        onReleaseTimeChange={setReleaseTime}
        onSilenceGainChange={setSilenceGain}
        onSustainGainChange={setSustainGain}
        releaseTime={releaseTime}
        silenceGain={silenceGain}
        sustainGain={sustainGain}
      />
      <EnvelopeFormulaPreview title={t('envelope.amplitudeEnvelopeFormula')} />
      <EnvelopeCurvePreview
        envelopeCurve={envelopeCurve}
        title={t('envelope.amplitudeEnvelopeCurve')}
      />
    </>
  );
}

export default Envelope;
