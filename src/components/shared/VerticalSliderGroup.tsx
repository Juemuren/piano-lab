import type { ReactNode } from 'react';
import { getRangeProgressStyle } from '../../utils/range';

interface VerticalSliderGroupProps {
  disabled?: boolean;
  formatValue?: (value: number, index: number) => string;
  getKey?: (index: number) => string | number;
  labels: ReactNode[];
  max: number | string;
  min: number | string;
  onChange?: (index: number, value: number) => void;
  step: number | string;
  values: number[];
}

function VerticalSliderGroup({
  values,
  labels,
  min,
  max,
  step,
  getKey = (index) => index,
  formatValue = (value) => value.toFixed(2),
  onChange,
  disabled = false,
}: VerticalSliderGroupProps) {
  return (
    <div className="flex w-full items-end gap-2 overflow-x-auto py-3">
      {values.map((value, index) => (
        <div className="flex flex-1 flex-col items-center" key={getKey(index)}>
          <div className="text-xs">{formatValue(value, index)}</div>
          <div className="relative flex h-36 w-8 items-center justify-center">
            <input
              className="range-input h-6 w-36 -rotate-90 text-app-tip dark:text-app-tip-dark"
              disabled={disabled}
              max={max}
              min={min}
              onChange={(e) => onChange?.(index, parseFloat(e.target.value))}
              step={step}
              style={getRangeProgressStyle(value, min, max)}
              title={(index + 1).toString()}
              type="range"
              value={value}
            />
          </div>
          <div className="text-app-subtext text-xs dark:text-app-subtext-dark">
            {labels[index]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VerticalSliderGroup;
