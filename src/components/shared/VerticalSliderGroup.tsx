import type { ReactNode } from 'react';
import { getRangeProgressStyle } from '../../utils/range';

type VerticalSliderGroupProps = {
  values: number[];
  labels: ReactNode[];
  min: number | string;
  max: number | string;
  step: number | string;
  getKey?: (index: number) => string | number;
  formatValue?: (value: number, index: number) => string;
  onChange?: (index: number, value: number) => void;
  disabled?: boolean;
};

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
    <div className="flex items-end gap-2 overflow-x-auto py-3">
      {values.map((value, index) => (
        <div key={getKey(index)} className="flex flex-1 flex-col items-center">
          <div className="text-xs">{formatValue(value, index)}</div>
          <div className="relative flex h-36 w-8 items-center justify-center">
            <input
              title={(index + 1).toString()}
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              disabled={disabled}
              onChange={(e) => onChange?.(index, parseFloat(e.target.value))}
              style={getRangeProgressStyle(value, min, max)}
              className={`
                range-input w-36 h-6 -rotate-90
                text-app-tip dark:text-app-tip-dark
              `}
            />
          </div>
          <div className="text-xs text-app-subtext dark:text-app-subtext-dark">
            {labels[index]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VerticalSliderGroup;
