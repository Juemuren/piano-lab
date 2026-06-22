import { InlineMath } from 'react-katex';
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
        displayValue={`${attackTime.toFixed(3)} s`}
        label={labels.attackTime}
        max="0.1"
        min="0.001"
        onChange={onAttackTimeChange}
        step="0.001"
        symbol={<InlineMath math="\tau_a" />}
        value={attackTime}
      />
      <ControlRange
        displayValue={`${decayTime.toFixed(2)} s`}
        label={labels.decayTime}
        max="1"
        min="0.01"
        onChange={onDecayTimeChange}
        step="0.01"
        symbol={<InlineMath math="\tau_d" />}
        value={decayTime}
      />
      <ControlRange
        displayValue={`${releaseTime.toFixed(2)} s`}
        label={labels.releaseTime}
        max="10"
        min="0.1"
        onChange={onReleaseTimeChange}
        step="0.1"
        symbol={<InlineMath math="\tau_r" />}
        value={releaseTime}
      />
      <ControlRange
        displayValue={sustainGain.toFixed(2)}
        label={labels.sustainGain}
        max="1"
        min="0.1"
        onChange={onSustainGainChange}
        step="0.01"
        symbol={<InlineMath math="S" />}
        value={sustainGain}
      />
      <ControlRange
        displayValue={silenceGain.toExponential(2)}
        label={labels.silenceGain}
        max="0.001"
        min="0.000001"
        onChange={onSilenceGainChange}
        step="0.000001"
        symbol={<InlineMath math="\varepsilon" />}
        value={silenceGain}
      />
    </>
  );
}

export default EnvelopeParameterControls;
