import ControlRange from '../../shared/ControlRange';
import ControlSelect from '../../shared/ControlSelect';

interface HarmonicSynthesizerParameterControlsProps {
  oscillatorType: OscillatorType;
  volume: number;
  attackTime: number;
  decayTime: number;
  releaseTime: number;
  sustainGain: number;
  silenceGain: number;
  labels: {
    sine: string;
    triangle: string;
    sawtooth: string;
    square: string;
    volume: string;
    attackTime: string;
    decayTime: string;
    releaseTime: string;
    sustainGain: string;
    silenceGain: string;
  };
  onOscillatorTypeChange: (value: OscillatorType) => void;
  onVolumeChange: (value: number) => void;
  onAttackTimeChange: (value: number) => void;
  onDecayTimeChange: (value: number) => void;
  onReleaseTimeChange: (value: number) => void;
  onSustainGainChange: (value: number) => void;
  onSilenceGainChange: (value: number) => void;
}

function HarmonicSynthesizerParameterControls({
  oscillatorType,
  volume,
  attackTime,
  decayTime,
  releaseTime,
  sustainGain,
  silenceGain,
  labels,
  onOscillatorTypeChange,
  onVolumeChange,
  onAttackTimeChange,
  onDecayTimeChange,
  onReleaseTimeChange,
  onSustainGainChange,
  onSilenceGainChange,
}: HarmonicSynthesizerParameterControlsProps) {
  return (
    <>
      <ControlSelect
        value={oscillatorType}
        onChange={(e) =>
          onOscillatorTypeChange(e.target.value as OscillatorType)
        }
      >
        <option value="sine">{labels.sine}</option>
        <option value="triangle">{labels.triangle}</option>
        <option value="sawtooth">{labels.sawtooth}</option>
        <option value="square">{labels.square}</option>
      </ControlSelect>

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

export default HarmonicSynthesizerParameterControls;
