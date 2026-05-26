type ControlRangeProps = {
  label: string;
  value: number;
  min: number | string;
  max: number | string;
  step: number | string;
  onChange: (value: number) => void;
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
  displayValue = value.toString(),
  accentClassName = 'accent-app-tip dark:accent-app-tip-dark',
}: ControlRangeProps) {
  return (
    <div
      className="
        mb-4 pb-1 p-4 rounded-2xl
        border border-app-border/50 dark:border-app-border-dark/50
      "
    >
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{label}</span>
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
