import type { ReactNode } from 'react';

type ControlRangeProps = {
  label: string;
  value: number;
  min: number | string;
  max: number | string;
  step: number | string;
  onChange: (value: number) => void;
  symbol?: ReactNode;
  displayValue?: string;
  accentClassName?: string;
};

function ControlRange({
  label,
  value,
  min,
  max,
  step,
  onChange,
  symbol,
  displayValue = value.toString(),
  accentClassName = 'accent-app-tip dark:accent-app-tip-dark',
}: ControlRangeProps) {
  return (
    <div className="p-2">
      <div className="p-2 flex items-center justify-between text-sm">
        <span>
          {label} {symbol}
        </span>
        <span className="font-semibold">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full ${accentClassName}`}
      />
    </div>
  );
}

export default ControlRange;
