import type { ReactNode } from 'react';

type ControlPanelProps = {
  children: ReactNode;
  className?: string;
};

function ControlPanel({ children, className = '' }: ControlPanelProps) {
  return (
    <div
      className={`
        w-full p-5 rounded-3xl
        border border-app-border dark:border-app-border-dark
        bg-app-surface/75 dark:bg-app-surface-dark/25
        shadow-xl shadow-app-muted/5
        ${className}
        `}
    >
      {children}
    </div>
  );
}

export default ControlPanel;
