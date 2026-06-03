import type { ReactNode } from 'react';

type ControlFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

function ControlField({ label, children, className = '' }: ControlFieldProps) {
  return (
    <label className={`flex flex-col gap-1 text-center ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export default ControlField;
