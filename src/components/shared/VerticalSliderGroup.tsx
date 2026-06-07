import type { ReactNode } from 'react';

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
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              disabled={disabled}
              onChange={(e) => onChange?.(index, parseFloat(e.target.value))}
              className={`
                h-1 -rotate-90 rounded-full
                appearance-none bg-app-overlay dark:bg-app-overlay-dark
                border border-app-border dark:border-app-border-dark
                accent-app-tip dark:accent-app-tip-dark
                ${disabled ? 'cursor-not-allowed' : ''}
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
