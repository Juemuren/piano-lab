import { InlineMath } from 'react-katex';
import ControlRange from '../../shared/ControlRange';

interface EnvelopeParameterControlsProps {
  attackTime: number;
  decayTime: number;
  releaseTime: number;
  sustainGain: number;
  silenceGain: number;
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
  onSustainGainChange: (value: number) => void;
  onSilenceGainChange: (value: number) => void;
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
        label={labels.attackTime}
        symbol={<InlineMath math="\tau_a" />}
        min="0.001"
        max="0.1"
        step="0.001"
        value={attackTime}
        displayValue={`${attackTime.toFixed(3)} s`}
        onChange={onAttackTimeChange}
      />
      <ControlRange
        label={labels.decayTime}
        symbol={<InlineMath math="\tau_d" />}
        min="0.01"
        max="1"
        step="0.01"
        value={decayTime}
        displayValue={`${decayTime.toFixed(2)} s`}
        onChange={onDecayTimeChange}
      />
      <ControlRange
        label={labels.releaseTime}
        symbol={<InlineMath math="\tau_r" />}
        min="0.1"
        max="10"
        step="0.1"
        value={releaseTime}
        displayValue={`${releaseTime.toFixed(2)} s`}
        onChange={onReleaseTimeChange}
      />
      <ControlRange
        label={labels.sustainGain}
        symbol={<InlineMath math="S" />}
        min="0.1"
        max="1"
        step="0.01"
        value={sustainGain}
        displayValue={sustainGain.toFixed(2)}
        onChange={onSustainGainChange}
      />
      <ControlRange
        label={labels.silenceGain}
        symbol={<InlineMath math="\varepsilon" />}
        min="0.000001"
        max="0.001"
        step="0.000001"
        value={silenceGain}
        displayValue={silenceGain.toExponential(2)}
        onChange={onSilenceGainChange}
      />
    </>
  );
}

export default EnvelopeParameterControls;
