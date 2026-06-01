import { useId } from 'react';
import type { SelectHTMLAttributes } from 'react';

type ControlSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

function ControlSelect({
  className = '',
  id,
  children,
  ...props
}: ControlSelectProps) {
  const generatedId = useId();

  return (
    <select
      id={id ?? generatedId}
      className={`
        w-full py-2 rounded-2xl text-center
        border border-app-border dark:border-app-border-dark
        bg-app-surface text-app-text dark:bg-app-surface-dark dark:text-app-text-dark
        focus:border-app-accent focus:ring-2 focus:ring-app-accent/50
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}

export default ControlSelect;
