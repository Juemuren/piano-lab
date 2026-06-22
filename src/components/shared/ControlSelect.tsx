import type { ReactNode, SelectHTMLAttributes } from 'react';
import { useId } from 'react';

interface ControlSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  icon?: ReactNode;
  label?: string;
}

function ControlSelect({
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
        <span className="p-1 font-bold inline-flex items-center justify-center gap-1">
          {icon}
          {label}
        </span>
      )}
      <select
        className={`
          w-full p-2 rounded-xl text-left
          bg-app-surface dark:bg-app-surface-dark
          border border-app-border dark:border-app-border-dark
          focus:border-app-accent focus:ring-2 focus:ring-app-accent/50
          ${className}
        `}
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
