import type { InputHTMLAttributes, ReactNode } from 'react';

type ControlCheckboxProps = {
  label: string;
  icon?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

function ControlCheckbox({
  label,
  icon,
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
      <span className="inline-flex items-center gap-1">
        {icon}
        {label}
      </span>
    </label>
  );
}

export default ControlCheckbox;
