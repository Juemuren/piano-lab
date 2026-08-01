import { InlineMath } from 'react-katex';
import { SYNTH_CONFIG_RANGES } from '../../../services/synth/config/Ranges';
import ControlRange from '../../shared/ControlRange';

interface EnvelopeParameterControlsProps {
  attackTime: number;
  decayTime: number;
  labels: {
    attackTime: string;
    decayTime: string;
    releaseTime: string;
    sustainGain: string;
    silenceGain: string;
  };
  onAttackTimeChange: (value: number) => void;
  onDecayTimeChange: (value: number) => void;
  onReleaseTimeChange: (value: number) => void;
  onSilenceGainChange: (value: number) => void;
  onSustainGainChange: (value: number) => void;
  releaseTime: number;
  silenceGain: number;
  sustainGain: number;
}

function EnvelopeParameterControls({
  attackTime,
  decayTime,
  releaseTime,
  sustainGain,
  silenceGain,
  labels,
  onAttackTimeChange,
  onDecayTimeChange,
  onReleaseTimeChange,
  onSustainGainChange,
  onSilenceGainChange,
}: EnvelopeParameterControlsProps) {
  return (
    <>
      <ControlRange
        {...SYNTH_CONFIG_RANGES.envelope.attackTime}
        displayValue={`${attackTime.toFixed(3)} s`}
        label={labels.attackTime}
        onChange={onAttackTimeChange}
        step="0.001"
        symbol={<InlineMath math="\tau_a" />}
        value={attackTime}
      />
      <ControlRange
        {...SYNTH_CONFIG_RANGES.envelope.decayTime}
        displayValue={`${decayTime.toFixed(2)} s`}
        label={labels.decayTime}
        onChange={onDecayTimeChange}
        step="0.01"
        symbol={<InlineMath math="\tau_d" />}
        value={decayTime}
      />
      <ControlRange
        {...SYNTH_CONFIG_RANGES.envelope.releaseTime}
        displayValue={`${releaseTime.toFixed(2)} s`}
        label={labels.releaseTime}
        onChange={onReleaseTimeChange}
        step="0.1"
        symbol={<InlineMath math="\tau_r" />}
        value={releaseTime}
      />
      <ControlRange
        {...SYNTH_CONFIG_RANGES.envelope.sustainGain}
        displayValue={sustainGain.toFixed(2)}
        label={labels.sustainGain}
        onChange={onSustainGainChange}
        step="0.01"
        symbol={<InlineMath math="S" />}
        value={sustainGain}
      />
      <ControlRange
        {...SYNTH_CONFIG_RANGES.envelope.silenceGain}
        displayValue={silenceGain.toExponential(2)}
        label={labels.silenceGain}
        onChange={onSilenceGainChange}
        step="0.000001"
        symbol={<InlineMath math="\varepsilon" />}
        value={silenceGain}
      />
    </>
  );
}

export default EnvelopeParameterControls;
