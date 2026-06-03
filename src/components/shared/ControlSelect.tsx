import { useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';

type ControlSelectProps = {
  label?: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

function ControlSelect({
  className = '',
  id,
  label,
  children,
  ...props
}: ControlSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <label className="flex flex-col gap-1 text-center">
      {label && <span>{label}</span>}
      <select
        id={selectId}
        className={`
          w-full py-2 rounded-2xl text-center
          bg-app-surface dark:bg-app-surface-dark
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
