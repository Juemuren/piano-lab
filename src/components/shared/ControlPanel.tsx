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
        bg-app-mantle/50 dark:bg-app-mantle-dark/50
        shadow-xl shadow-app-overlay/5
        ${className}
        `}
    >
      {children}
    </div>
  );
}

export default ControlPanel;
