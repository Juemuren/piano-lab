import { useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';

type ControlSelectProps = {
  label?: string;
  icon?: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

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
        id={selectId}
        className={`
          w-full p-2 rounded-2xl text-left
          bg-app-mantle dark:bg-app-mantle-dark
          border border-app-border dark:border-app-border-dark
          focus:border-app-accent focus:ring-2 focus:ring-app-accent/50
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export default ControlSelect;
