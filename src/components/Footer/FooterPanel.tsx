import { type ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type FooterPanelProps = {
  title: string;
  children: ReactNode;
};

function FooterPanel({ title, children }: FooterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className="
        text-sm text-app-muted dark:text-app-muted-dark
        rounded-lg bg-app-surface-muted dark:bg-app-surface-muted-dark
      "
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="
          w-full p-3 rounded-lg flex justify-between
          transition-colors hover:bg-app-accent-weak dark:hover:bg-app-accent-strong
          hover:text-app-accent-strong dark:hover:text-app-accent-weak
        "
      >
        <span className="font-semibold tracking-wide">{title}</span>
        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      <div className={`${isExpanded ? 'px-4 leading-8' : 'hidden'}`}>
        {children}
      </div>
    </section>
  );
}

export default FooterPanel;
