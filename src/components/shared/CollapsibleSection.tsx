import { type ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  expanded?: boolean;
  bgClassName?: string;
  hoverBgClassName?: string;
};

function CollapsibleSection({
  title,
  children,
  expanded = false,
  bgClassName = 'bg-app-surface-muted dark:bg-app-surface-muted-dark',
  hoverBgClassName = 'hover:bg-app-surface dark:hover:bg-app-surface-dark',
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleToggle}
        className={`
          w-full p-3 text-center rounded-lg transition-colors
          ${bgClassName} ${hoverBgClassName}
        `}
      >
        <h2 className="inline-flex items-center justify-center gap-2 text-xl font-semibold">
          {title}
          {isExpanded ? (
            <ChevronDown size={24} aria-hidden="true" />
          ) : (
            <ChevronRight size={24} aria-hidden="true" />
          )}
        </h2>
      </button>
      <div className={isExpanded ? 'my-4' : 'hidden'}>{children}</div>
    </div>
  );
}

export default CollapsibleSection;
