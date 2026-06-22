import type { ReactNode } from 'react';
import { getRangeProgressStyle } from '../../utils/range';

interface ControlRangeProps {
  accentClassName?: string;
  displayValue?: string;
  icon?: ReactNode;
  label: string;
  max: number | string;
  min: number | string;
  onChange: (value: number) => void;
  p?: ReactNode;
  pClassName?: string;
  step: number | string;
  symbol?: ReactNode;
  value: number;
}

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
  accentClassName = 'text-app-tip dark:text-app-tip-dark',
  pClassName = 'text-app-tip/50 dark:text-app-tip-dark/50',
}: ControlRangeProps) {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between p-2 text-sm">
        <span className="inline-flex items-center gap-1">
          {icon}
          {label} {symbol}
        </span>
        <span className="font-semibold">{displayValue}</span>
      </div>
      <input
        className={`range-input h-6 w-full ${accentClassName}`}
        max={max}
        min={min}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        step={step}
        style={getRangeProgressStyle(value, min, max)}
        title={label}
        type="range"
        value={value}
      />
      {p && <p className={`text-center text-xs ${pClassName}`}>{p}</p>}
    </div>
  );
}

export default ControlRange;
