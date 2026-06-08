import { type ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type FooterPanelProps = {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
};

function FooterPanel({ title, children, icon }: FooterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className="
        text-sm text-app-text dark:text-app-text-dark
        rounded-lg bg-app-surface/50 dark:bg-app-surface-dark/50
      "
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="
          w-full p-3 rounded-lg flex justify-between transition-colors
          hover:bg-app-overlay/50 dark:hover:bg-app-overlay-dark/50
          hover:text-app-subtext dark:hover:text-app-subtext-dark
        "
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
