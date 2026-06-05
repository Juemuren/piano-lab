import type { InputHTMLAttributes } from 'react';

type ControlCheckboxProps = {
  label: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

function ControlCheckbox({
  label,
  className = '',
  ...props
}: ControlCheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        className={`size-4 flex-none accent-app-accent ${className}`}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

export default ControlCheckbox;
