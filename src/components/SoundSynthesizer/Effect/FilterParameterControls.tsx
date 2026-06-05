import ControlRange from '../../shared/ControlRange';

interface FilterParameterControlsProps {
  frequency: number;
  q: number;
  labels: {
    frequency: string;
    q: string;
  };
  onFrequencyChange: (value: number) => void;
  onQChange: (value: number) => void;
}

function FilterParameterControls({
  frequency,
  q,
  labels,
  onFrequencyChange,
  onQChange,
}: FilterParameterControlsProps) {
  return (
    <>
      <ControlRange
        label={labels.frequency}
        min="20"
        max="10000"
        step="1"
        value={frequency}
        displayValue={`${frequency.toFixed(0)} Hz`}
        onChange={onFrequencyChange}
      />
      <ControlRange
        label={labels.q}
        min="0.1"
        max="20"
        step="0.1"
        value={q}
        displayValue={q.toFixed(1)}
        onChange={onQChange}
      />
    </>
  );
}

export default FilterParameterControls;
