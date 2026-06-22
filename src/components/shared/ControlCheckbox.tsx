import type { InputHTMLAttributes, ReactNode } from 'react';

type ControlCheckboxProps = {
  label: string;
  icon?: ReactNode;
  accentClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

function ControlCheckbox({
  label,
  icon,
  accentClassName = 'text-app-tip dark:text-app-tip-dark',
  className = '',
  ...props
}: ControlCheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        className={`checkbox-input ${className}`}
        type="checkbox"
        {...props}
      />
      <span className={`checkbox-track ${accentClassName}`} />
      <span className="inline-flex items-center gap-1">
        {icon}
        {label}
      </span>
    </label>
  );
}

export default ControlCheckbox;
