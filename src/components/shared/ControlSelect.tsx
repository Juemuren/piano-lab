import type { ReactNode, SelectHTMLAttributes } from 'react';
import { useId } from 'react';

interface ControlSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  bgClassName?: string;
  icon?: ReactNode;
  label?: string;
}

function ControlSelect({
  bgClassName = 'bg-app-surface dark:bg-app-surface-dark',
  className = '',
  id,
  label,
  icon,
  children,
  ...props
}: ControlSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <label className="flex flex-col gap-1 text-center">
      {label && (
        <span className="inline-flex items-center justify-center gap-1 p-1 font-bold">
          {icon}
          {label}
        </span>
      )}
      <select
        className={`w-full rounded-xl p-2 text-left focus:ring-2 focus:ring-app-accent/50 ${bgClassName} ${className}`}
        id={selectId}
        title={label}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export default ControlSelect;
