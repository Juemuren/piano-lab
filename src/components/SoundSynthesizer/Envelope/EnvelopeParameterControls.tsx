import ControlRange from '../../shared/ControlRange';

interface EnvelopeParameterControlsProps {
  volume: number;
  attackTime: number;
  decayTime: number;
  releaseTime: number;
  sustainGain: number;
  silenceGain: number;
  labels: {
    volume: string;
    attackTime: string;
    decayTime: string;
    releaseTime: string;
    sustainGain: string;
    silenceGain: string;
  };
  onVolumeChange: (value: number) => void;
  onAttackTimeChange: (value: number) => void;
  onDecayTimeChange: (value: number) => void;
  onReleaseTimeChange: (value: number) => void;
  onSustainGainChange: (value: number) => void;
  onSilenceGainChange: (value: number) => void;
}

function EnvelopeParameterControls({
  volume,
  attackTime,
  decayTime,
  releaseTime,
  sustainGain,
  silenceGain,
  labels,
  onVolumeChange,
  onAttackTimeChange,
  onDecayTimeChange,
  onReleaseTimeChange,
  onSustainGainChange,
  onSilenceGainChange,
}: EnvelopeParameterControlsProps) {
  return (
    <>
      <ControlRange
        label={labels.volume}
        min="0"
        max="1"
        step="0.01"
        value={volume}
        displayValue={volume.toFixed(2)}
        onChange={onVolumeChange}
      />
      <ControlRange
        label={labels.attackTime}
        min="0.001"
        max="0.1"
        step="0.001"
        value={attackTime}
        displayValue={`${attackTime.toFixed(3)} s`}
        onChange={onAttackTimeChange}
      />
      <ControlRange
        label={labels.decayTime}
        min="0.01"
        max="1"
        step="0.01"
        value={decayTime}
        displayValue={`${decayTime.toFixed(2)} s`}
        onChange={onDecayTimeChange}
      />
      <ControlRange
        label={labels.releaseTime}
        min="0.01"
        max="1"
        step="0.01"
        value={releaseTime}
        displayValue={`${releaseTime.toFixed(2)} s`}
        onChange={onReleaseTimeChange}
      />
      <ControlRange
        label={labels.sustainGain}
        min="0.1"
        max="1"
        step="0.01"
        value={sustainGain}
        displayValue={sustainGain.toFixed(2)}
        onChange={onSustainGainChange}
      />
      <ControlRange
        label={labels.silenceGain}
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
