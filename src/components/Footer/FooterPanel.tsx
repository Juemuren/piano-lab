import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface FooterPanelProps {
  children: ReactNode;
  icon?: ReactNode;
  title: string;
}

function FooterPanel({ title, children, icon }: FooterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="rounded-lg bg-app-surface/50 text-app-text text-sm dark:bg-app-surface-dark/50 dark:text-app-text-dark">
      <button
        className="flex w-full justify-between rounded-lg p-3 transition-colors hover:bg-app-overlay/50 hover:text-app-subtext dark:hover:bg-app-overlay-dark/50 dark:hover:text-app-subtext-dark"
        onClick={() => setIsExpanded((prev) => !prev)}
        type="button"
      >
        <span className="inline-flex items-center gap-2 font-semibold tracking-wide">
          {icon}
          {title}
        </span>
        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      <div className={`${isExpanded ? 'px-4 leading-8' : 'hidden'}`}>
        {children}
      </div>
    </section>
  );
}

export default FooterPanel;
