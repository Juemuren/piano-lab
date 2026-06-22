import type { ReactNode } from 'react';
import { getRangeProgressStyle } from '../../utils/range';

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
  accentClassName = 'text-app-tip dark:text-app-tip-dark',
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
        className={`
          range-input w-full h-6
          ${accentClassName}
        `}
        max={max}
        min={min}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        step={step}
        style={getRangeProgressStyle(value, min, max)}
        title={label}
        type="range"
        value={value}
      />
      {p && <p className={`text-xs text-center ${pClassName}`}>{p}</p>}
    </div>
  );
}

export default ControlRange;
