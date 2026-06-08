import type { ReactNode } from 'react';

type ControlRangeProps = {
  label: string;
  icon?: ReactNode;
  value: number;
  min: number | string;
  max: number | string;
  step: number | string;
  onChange: (value: number) => void;
  symbol?: ReactNode;
  displayValue?: string;
  p?: ReactNode;
  accentClassName?: string;
  pClassName?: string;
};

function ControlRange({
  label,
  icon,
  value,
  min,
  max,
  step,
  onChange,
  symbol,
  displayValue = value.toString(),
  p,
  accentClassName = 'accent-app-tip dark:accent-app-tip-dark',
  pClassName = 'text-app-tip/50 dark:text-app-tip-dark/50',
}: ControlRangeProps) {
  return (
    <div className="p-2">
      <div className="p-2 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1">
          {icon}
          {label} {symbol}
        </span>
        <span className="font-semibold">{displayValue}</span>
      </div>
      <input
        title={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full ${accentClassName}`}
      />
      {p && <p className={`text-xs text-center ${pClassName}`}>{p}</p>}
    </div>
  );
}

export default ControlRange;
