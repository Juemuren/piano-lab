import { getRangeProgressStyle } from '../../utils/range';

interface RangeInputProps {
  accentClassName?: string;
  className?: string;
  disabled?: boolean;
  max: number | string;
  min: number | string;
  onChange: (value: number) => void;
  step: number | string;
  title?: string;
  value: number;
}

function RangeInput({
  accentClassName = 'text-app-tip dark:text-app-tip-dark',
  className = '',
  disabled = false,
  max,
  min,
  onChange,
  step,
  title,
  value,
}: RangeInputProps) {
  return (
    <input
      className={`range-input h-6 ${accentClassName} ${className}`}
      disabled={disabled}
      max={max}
      min={min}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      step={step}
      style={getRangeProgressStyle(value, min, max)}
      title={title}
      type="range"
      value={value}
    />
  );
}

export default RangeInput;
