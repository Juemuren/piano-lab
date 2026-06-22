import type { ReactNode } from 'react';

interface ControlPanelProps {
  children: ReactNode;
  className?: string;
}

function ControlPanel({ children, className = '' }: ControlPanelProps) {
  return (
    <div
      className={`w-full rounded-3xl border border-app-border bg-app-mantle/50 p-5 shadow-app-overlay/5 shadow-xl dark:border-app-border-dark dark:bg-app-mantle-dark/50 ${className}`}
    >
      {children}
    </div>
  );
}

export default ControlPanel;
